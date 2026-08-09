#!/bin/bash
# vr.org uptime watchdog. Runs every minute from cron.
#
# DEPLOYED COPY LIVES ON THE VPS at /home/ubuntu/uptime-watch.sh, installed in
# the `ubuntu` crontab as: * * * * * /home/ubuntu/uptime-watch.sh >/dev/null 2>&1
# This file is the version-controlled source of truth. It is NOT run from the
# repo and nothing deploys it automatically, so after editing here, copy it up:
#   scp scripts/uptime-watch.sh ubuntu@104.225.12.76:/home/ubuntu/uptime-watch.sh
#
# Why this exists: on 2026-08-09 a bot flood on one /opengraph-image URL
# saturated Node and vr.org returned 502/504 site-wide for ~15 minutes. The
# container stayed "running" the whole time, so nothing based on container
# health would have noticed, and the only external monitor points at
# /api/feed-health, which reports RSS staleness and stayed green throughout.
#
# This checks what actually matters: does https://vr.org/ return 200 through
# the full public path (TLS -> nginx -> Node). After 3 consecutive failures it
# restarts the container, which is the correct response to a wedged Node
# process and is what a human would have done manually.
#
# LIMITATION, on purpose: this runs ON the box, so it cannot detect the box
# itself being down (network, power, kernel). It catches application-level
# outages only. External monitoring is still worth having.
#
# Disable with: crontab -e  (comment out the uptime-watch line)

set -uo pipefail

URL="https://vr.org/"
LOG=/home/ubuntu/uptime.log
STATE=/home/ubuntu/.uptime-state
COMPOSE_DIR=/home/ubuntu/vr-org

FAIL_THRESHOLD=3          # consecutive failed minutes before acting
RESTART_COOLDOWN=900      # seconds between restarts (15 min)
MAX_RESTARTS_PER_DAY=5    # circuit breaker; stop trying and just log

log() { echo "$(date -Is) — $*" >> "$LOG"; }

# Single instance only.
exec 9>/home/ubuntu/.uptime-watch.lock
flock -n 9 || exit 0

# --- state ---
fails=0; last_restart=0; restarts_today=0; restart_day=""; was_down=0
[ -f "$STATE" ] && . "$STATE"

save_state() {
  cat > "$STATE" <<EOF
fails=$fails
last_restart=$last_restart
restarts_today=$restarts_today
restart_day="$restart_day"
was_down=$was_down
EOF
}

today=$(date +%F)
if [ "$restart_day" != "$today" ]; then
  restart_day="$today"; restarts_today=0
fi

# --- probe: 200 = healthy. One retry so a single blip is not a failure. ---
probe() {
  curl -sS -o /dev/null -w '%{http_code}' --max-time 15 \
       -H 'User-Agent: vr-org-uptime-watch/1.0' "$URL" 2>/dev/null
}

code=$(probe)
if [ "$code" != "200" ]; then
  sleep 5
  code=$(probe)
fi

now=$(date +%s)

if [ "$code" = "200" ]; then
  if [ "$was_down" = "1" ]; then
    log "RECOVERED — $URL returned 200 after $fails consecutive failures"
  fi
  fails=0; was_down=0
  save_state
  exit 0
fi

# --- failing ---
fails=$((fails + 1))
if [ "$was_down" = "0" ]; then
  log "DOWN — $URL returned '${code:-no-response}' (failure 1)"
fi
was_down=1

if [ "$fails" -lt "$FAIL_THRESHOLD" ]; then
  [ "$fails" -gt 1 ] && log "still failing — code='${code:-no-response}' consecutive=$fails"
  save_state
  exit 0
fi

# Never fight a deploy: a rebuild is slow but the old container keeps serving,
# and restarting mid-build would be actively harmful.
if pgrep -f "docker compose up" >/dev/null 2>&1; then
  log "threshold reached but a deploy build is running; not restarting"
  save_state
  exit 0
fi

if [ $((now - last_restart)) -lt "$RESTART_COOLDOWN" ]; then
  log "threshold reached but within restart cooldown ($((now - last_restart))s ago); not restarting"
  save_state
  exit 0
fi

if [ "$restarts_today" -ge "$MAX_RESTARTS_PER_DAY" ]; then
  log "ALERT — still down after $restarts_today restarts today; giving up, NEEDS A HUMAN"
  save_state
  exit 0
fi

log "ACTION — $fails consecutive failures (code='${code:-no-response}'), restarting container"
if (cd "$COMPOSE_DIR" && docker compose restart >>"$LOG" 2>&1); then
  last_restart=$now
  restarts_today=$((restarts_today + 1))
  log "restart issued (#$restarts_today today)"
else
  log "restart FAILED — docker compose restart returned non-zero"
fi
fails=0
save_state
