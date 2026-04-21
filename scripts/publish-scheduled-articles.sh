#!/bin/bash
#
# publish-scheduled-articles.sh
# Runs daily on the VPS. For every data/article-draft-*.json whose
# publishDate equals today's date (TZ=America/Los_Angeles), prepend it
# into data/articles.json, archive the draft to data/drafts-published/,
# commit, and push. The deploy-listener webhook on the VPS handles the
# Docker rebuild after the push.
#
# Requires: jq, git, a writable checkout at /home/ubuntu/vr-org with
# push access to origin master.

set -euo pipefail

REPO_DIR="/home/ubuntu/vr-org"
cd "$REPO_DIR"

TODAY=$(TZ=America/Los_Angeles date +%Y-%m-%d)
LOG_PREFIX="[publish-scheduled $TODAY]"

echo "$LOG_PREFIX starting scan"

git fetch origin master
git reset --hard origin/master

PUBLISHED=0
mkdir -p data/drafts-published

shopt -s nullglob
for draft in data/article-draft-*.json; do
  if ! jq empty "$draft" 2>/dev/null; then
    echo "$LOG_PREFIX SKIP $draft (invalid JSON)"
    continue
  fi

  PUB_DATE=$(jq -r '.publishDate // empty' "$draft")
  SLUG=$(jq -r '.slug // empty' "$draft")

  if [ -z "$PUB_DATE" ] || [ -z "$SLUG" ]; then
    echo "$LOG_PREFIX SKIP $draft (missing publishDate or slug)"
    continue
  fi

  if [ "$PUB_DATE" != "$TODAY" ]; then
    continue
  fi

  echo "$LOG_PREFIX publishing $SLUG (publishDate $PUB_DATE)"

  if jq -e --arg slug "$SLUG" 'any(.[]; .slug == $slug)' data/articles.json > /dev/null; then
    echo "$LOG_PREFIX SKIP $SLUG already in articles.json, archiving draft"
    mv "$draft" "data/drafts-published/"
    continue
  fi

  jq --slurpfile new "$draft" '[$new[0]] + .' data/articles.json > data/articles.json.tmp
  jq empty data/articles.json.tmp
  mv data/articles.json.tmp data/articles.json

  mv "$draft" "data/drafts-published/"

  PUBLISHED=$((PUBLISHED + 1))
done
shopt -u nullglob

if [ "$PUBLISHED" -gt 0 ]; then
  echo "$LOG_PREFIX committing $PUBLISHED article(s)"

  git add -A data/articles.json data/drafts-published data/

  git -c user.name="VR.org Publisher" -c user.email="publisher@vr.org" \
    commit -m "Publish $PUBLISHED scheduled article(s) for $TODAY"
  git push origin master
  echo "$LOG_PREFIX push complete, deploy webhook will rebuild"
else
  echo "$LOG_PREFIX no articles scheduled for today"
fi
