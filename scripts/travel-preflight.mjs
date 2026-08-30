#!/usr/bin/env node
/**
 * Travel mode preflight.
 *
 * Run before drafting anything in an unattended session. It answers one
 * question: is this repository in a state I understand well enough to safely
 * add articles to it?
 *
 * It also answers a second question the 2026-08-29 run had to discover the
 * expensive way: can this session reach the open internet at all? That run
 * passed preflight, then spent an entire session finding out that every host
 * except api.github.com was refused by the environment's egress proxy, and
 * stopped at Step 2 with nothing published. The cause was the cloud
 * environment's Network access level, not anything in this repo. Probing four
 * representative hosts here costs a few seconds and turns that into a Step 1
 * stop with the fix named in the output.
 *
 * Five ways the answer is no:
 *   1. HEAD is not on master. Travel mode publishes from master. Drafting on
 *      any other branch, or in a detached HEAD, would commit articles to a
 *      branch nothing deploys from, and an unattended run would report
 *      success while nothing reached production.
 *   2. Uncommitted changes in the working tree. Something else is mid-edit.
 *   3. Local master is behind origin. Drafting would build on a stale archive
 *      and the duplicate check would miss recently published pieces.
 *   4. Unpushed local commits. Another tool committed without pushing, which
 *      has happened five times between 2026-06-09 and 2026-08-10, and on
 *      2026-06-25 produced a near duplicate caught only by this check.
 *   5. No outbound network. Every source, image, store page and the deploy
 *      verification in Step 7 needs it, so a run without it cannot produce a
 *      publishable article and should never start drafting.
 *
 * Every git call this script makes is individually wrapped. A stale
 * index.lock, or a checkout with no local master ref, previously made a
 * later git() call throw a raw Node stack trace instead of a house FAIL
 * line: this script is meant to fail closed, but it also has to fail
 * legibly, since an unattended run has nothing but this output to act on.
 *
 * Exit 0 means safe to draft. Exit 1 means stop and notify Evan.
 *
 * Usage:
 *   node scripts/travel-preflight.mjs
 *   node scripts/travel-preflight.mjs --no-network   # git checks only
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(here, "..");

class GitCommandError extends Error {
  constructor(label, cmd, reason) {
    super(`${label} (\`${cmd}\`) failed: ${reason}`);
    this.name = "GitCommandError";
  }
}

/**
 * Runs one git command and returns its trimmed stdout. Any failure, a
 * nonzero exit, a missing ref, a lock file blocking the operation, is
 * converted into a GitCommandError naming which command failed and why,
 * rather than letting execFileSync's raw error (and stack trace) escape.
 *
 * @param {string[]} args
 * @param {string} label human-readable description of what this call is for
 * @returns {string}
 */
function git(args, label) {
  try {
    // stdio is explicit so a failing git command's own stderr (a raw "fatal:
    // ..." line) is captured into err.stderr for the FAIL message below
    // rather than also leaking straight to this process's terminal, which
    // would otherwise interleave git's diagnostic text ahead of the one line
    // an unattended run actually needs to read.
    return execFileSync("git", args, { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (err) {
    const cmd = `git ${args.join(" ")}`;
    const reason = err.stderr ? String(err.stderr).trim() : err.message;
    throw new GitCommandError(label, cmd, reason);
  }
}

/**
 * Four hosts that together stand in for everything a travel mode run needs
 * from the open internet. They are not an exhaustive list of what the run
 * touches, they are the four whose absence makes the run pointless:
 *
 *   vr.org                  Step 7 confirms a deploy by reading the live site
 *                           over public HTTP. Without it a push is unverifiable.
 *   store.steampowered.com  Tier 2 confirms a store link's developers or
 *                           publishers match who the article says made the thing.
 *   commons.wikimedia.org   Every article carries 2-4 images and each one has to
 *                           be fetched and actually looked at, not just 200-checked.
 *   www.youtube.com         Trailer IDs are confirmed against the oEmbed title,
 *                           because a valid-but-mislabeled ID returns 200 too.
 *
 * Reachability is the question, not correctness, so any HTTP status counts as a
 * pass. A 404 still proves the request left the box. Only a thrown fetch (DNS
 * refusal, a proxy answering 403 to CONNECT, a timeout) counts as blocked.
 * vr.org is the one exception: it is our own site, a non-OK status there is a
 * real signal, and publishing into a site that is down is not something an
 * unattended run should decide to do.
 */
const EGRESS_PROBES = [
  { host: "vr.org", url: "https://vr.org/api/health", requireOk: true },
  { host: "store.steampowered.com", url: "https://store.steampowered.com/api/appdetails?appids=620980" },
  { host: "commons.wikimedia.org", url: "https://commons.wikimedia.org/w/api.php?action=query&format=json&meta=siteinfo" },
  { host: "www.youtube.com", url: "https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&format=json" },
];

const PROBE_TIMEOUT_MS = 10_000;

/**
 * Issues one probe request. Never throws: the caller wants a verdict per host,
 * not an exception that hides the other three results.
 *
 * @param {{host: string, url: string, requireOk?: boolean}} probe
 * @returns {Promise<{host: string, ok: boolean, detail: string}>}
 */
async function probe({ host, url, requireOk }) {
  try {
    const res = await fetch(url, {
      // Wikimedia rate-limits default agents and Steam varies its response by
      // agent, so identify ourselves the same way the image checks do.
      headers: { "User-Agent": "VRorgBot/1.0 (https://vr.org; evan@pizzarobotstudios.com)" },
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
      redirect: "follow",
    });
    if (requireOk && !res.ok) {
      return { host, ok: false, detail: `reachable but answered HTTP ${res.status}` };
    }
    return { host, ok: true, detail: `HTTP ${res.status}` };
  } catch (err) {
    const reason = err?.name === "TimeoutError" ? `no response in ${PROBE_TIMEOUT_MS / 1000}s` : (err?.cause?.message || err?.message || String(err));
    return { host, ok: false, detail: reason };
  }
}

/**
 * Probes all four hosts in parallel and returns the failures. An empty array
 * means the run can reach what it needs.
 *
 * @returns {Promise<{host: string, ok: boolean, detail: string}[]>}
 */
async function checkEgress() {
  const results = await Promise.all(EGRESS_PROBES.map(probe));
  return results.filter((r) => !r.ok);
}

/**
 * Can this session actually push?
 *
 * Reachability is not authorization, and the two fail at opposite ends of the
 * run. On 2026-08-30 a cloud run passed preflight, sourced, drafted, cleared a
 * full verification gate, committed, and only then discovered that GitHub
 * refuses it write access:
 *
 *   remote: Claude doesn't have GitHub access to evanatpizzarobot/vr-org for
 *   your organization.
 *   fatal: unable to access '...': The requested URL returned error: 403
 *
 * Every write path was shut (push to master, push to a side branch, the GitHub
 * MCP file API) while GitHub READ worked fine, which is exactly why nothing
 * upstream of the push noticed. The container was ephemeral, so the commit and
 * the whole morning's work went with it.
 *
 * `git push --dry-run` negotiates refs against git-receive-pack, which is the
 * authenticated endpoint, so a permissions denial surfaces here in about a
 * second. It writes nothing: on an already-synced branch it prints
 * "Everything up-to-date" and exits 0.
 *
 * @returns {{ok: boolean, detail: string}}
 */
function checkPushAccess() {
  try {
    git(["push", "--dry-run", "origin", "master"], "dry-run push to origin/master");
    return { ok: true, detail: "" };
  } catch (err) {
    return { ok: false, detail: err instanceof GitCommandError ? err.message : String(err) };
  }
}

async function main() {
  try {
    const problems = [];

    git(["fetch", "origin", "master"], "fetch origin/master");

    // Checked first and pushed first: if HEAD is on the wrong branch (or
    // detached), that fact explains any other anomaly this run might report,
    // so it should lead the problems list rather than get buried under it.
    //
    // A detached HEAD returns the literal string "HEAD" from this command,
    // which never equals "master", so the equality check below already
    // catches it. Do not loosen this to something like checking for a null
    // or empty branch name; "HEAD" is the correct, intentional non-match.
    const branch = git(["rev-parse", "--abbrev-ref", "HEAD"], "determine the current branch");
    if (branch !== "master") {
      problems.push(`not on master (currently on ${branch}). Travel mode publishes from master; drafting here would commit to the wrong branch.`);
    }

    const dirty = git(["status", "--porcelain"], "read working tree status");
    if (dirty) {
      problems.push(`working tree is not clean:\n${dirty.split("\n").map((l) => `      ${l}`).join("\n")}`);
    }

    const unpushed = git(["log", "origin/master..master", "--oneline"], "list commits not yet pushed to origin/master");
    if (unpushed) {
      problems.push(`unpushed local commits:\n${unpushed.split("\n").map((l) => `      ${l}`).join("\n")}`);
    }

    const unpulled = git(["log", "master..origin/master", "--oneline"], "list commits on origin/master not yet pulled");
    if (unpulled) {
      problems.push(`local master is behind origin:\n${unpulled.split("\n").map((l) => `      ${l}`).join("\n")}`);
    }

    if (problems.length > 0) {
      console.error("travel:preflight  FAIL  repository is not in a known-good state:");
      console.error("");
      for (const p of problems) console.error(`  - ${p}`);
      console.error("");
      console.error("Do NOT draft. Notify Evan with this output and stop.");
      process.exitCode = 1;
      return;
    }

    const head = git(["rev-parse", "--short", "HEAD"], "resolve the short HEAD sha");

    // Network last: the git checks are local and instant, so a repo problem
    // should surface without waiting on four HTTP round trips first.
    if (!process.argv.includes("--no-network")) {
      const unreachable = await checkEgress();
      if (unreachable.length > 0) {
        const total = EGRESS_PROBES.length;
        console.error(`travel:preflight  FAIL  ${unreachable.length} of ${total} required hosts unreachable:`);
        console.error("");
        for (const u of unreachable) console.error(`  - ${u.host}: ${u.detail}`);
        console.error("");
        if (unreachable.length === total) {
          // Every probe failing at once is not four coincident outages. It is
          // one policy, applied at the egress proxy, and no amount of retrying
          // or degrading inside the run will get around it.
          console.error("  All of them failing together means outbound HTTPS is blocked for this");
          console.error("  environment, not that four sites are down. If this is a cloud session,");
          console.error("  the fix is on the environment, not in this repo: open the routine at");
          console.error("  claude.ai/code/routines, click the pencil, select the cloud icon below");
          console.error("  Instructions, open that environment's settings, and set Network access");
          console.error("  to Full (or Custom with the news, store and image hosts listed). GitHub");
          console.error("  reaches api.github.com through a separate proxy, so github working is");
          console.error("  not evidence that the rest of the network does.");
          console.error("");
        }
        console.error("  Sourcing, image verification, store checks and the Step 7 deploy check all");
        console.error("  need these. Do NOT draft. Notify Evan with this output and stop.");
        process.exitCode = 1;
        return;
      }

      // Authorization, not reachability. Last of the network checks because it
      // is the one whose failure is least about this repo and most about the
      // session's GitHub grant.
      const push = checkPushAccess();
      if (!push.ok) {
        console.error("travel:preflight  FAIL  this session cannot push to origin/master:");
        console.error("");
        console.error(`  ${push.detail}`);
        console.error("");
        console.error("  Reaching GitHub is not the same as being allowed to write to it, and a");
        console.error("  403 here is an authorization denial, not a network fault. Do not try to");
        console.error("  route around it with a side branch or the GitHub file API; on 2026-08-30");
        console.error("  a run found every write path equally shut and lost a finished, gated");
        console.error("  article when its container went away.");
        console.error("");
        console.error("  The fix is on GitHub, not in this repo: install the Claude GitHub App for");
        console.error("  the account at github.com/apps/claude/installations/select_target, or");
        console.error("  reconnect GitHub from claude.ai settings under Connectors.");
        console.error("");
        console.error("  Do NOT draft; the article could not be published. Notify Evan and stop.");
        process.exitCode = 1;
        return;
      }
    }

    console.log(`travel:preflight  OK  clean tree, synced with origin at ${head}`);
    process.exitCode = 0;
    return;
  } catch (err) {
    const detail = err instanceof GitCommandError ? err.message : `unexpected error: ${err.message}`;
    console.error(`travel:preflight  FAIL  could not determine repository state: ${detail}`);
    console.error("Do NOT draft. Notify Evan with this output and stop.");
    process.exitCode = 1;
    return;
  }
}

await main();
