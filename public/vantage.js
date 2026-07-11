/* Vantage live console for /console. Reads /api/stats + /api/ai-stats (already public).
   Generated from the validated dashboard design; no secrets, safe to serve publicly. */
(function(){
"use strict";
const CSS = `
  :root {
    --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --font-mono: ui-monospace, "JetBrains Mono", "SFMono-Regular", "SF Mono", "Cascadia Code", Menlo, Consolas, monospace;

    /* cool-biased neutrals, dark-first VR.org identity */
    --plane: #0a0e13;
    --surface: #111820;
    --surface-2: #161f2a;
    --ink: #eaf1f5;
    --ink-2: #93a1ad;
    --muted: #5f6b76;
    --border: rgba(255,255,255,0.09);
    --grid: #1b2530;
    --axis: #2b3946;

    --accent: #22d3ee;          /* UI cyan (chrome, interactive, single-series marks) */
    --accent-soft: rgba(34,211,238,0.14);
    --accent-line: #34c6dd;

    --series-cyan: #1fa3bc;     /* validated 2-series pair (dark) */
    --series-violet: #9085e9;

    --good: #0ca30c;
    --warn: #fab219;
    --serious: #ec835a;
    --crit: #d03b3b;

    --shadow: 0 1px 0 rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.35);
  }

  @media (prefers-color-scheme: light) {
    :root {
      --plane: #eef2f6;
      --surface: #ffffff;
      --surface-2: #f5f8fb;
      --ink: #0c141b;
      --ink-2: #4a5761;
      --muted: #7a8791;
      --border: rgba(11,20,28,0.11);
      --grid: #e6ebf1;
      --axis: #c9d3dc;

      --accent: #0891b2;
      --accent-soft: rgba(8,145,178,0.12);
      --accent-line: #0891b2;

      --series-cyan: #0891b2;
      --series-violet: #4a3aa7;

      --shadow: 0 1px 2px rgba(16,32,48,0.06), 0 8px 22px rgba(16,32,48,0.08);
    }
  }
  /* explicit toggle wins in both directions */
  :root[data-theme="dark"] {
    --plane:#0a0e13;--surface:#111820;--surface-2:#161f2a;--ink:#eaf1f5;--ink-2:#93a1ad;--muted:#5f6b76;
    --border:rgba(255,255,255,0.09);--grid:#1b2530;--axis:#2b3946;
    --accent:#22d3ee;--accent-soft:rgba(34,211,238,0.14);--accent-line:#34c6dd;
    --series-cyan:#1fa3bc;--series-violet:#9085e9;
    --shadow:0 1px 0 rgba(255,255,255,0.03),0 8px 24px rgba(0,0,0,0.35);
  }
  :root[data-theme="light"] {
    --plane:#eef2f6;--surface:#ffffff;--surface-2:#f5f8fb;--ink:#0c141b;--ink-2:#4a5761;--muted:#7a8791;
    --border:rgba(11,20,28,0.11);--grid:#e6ebf1;--axis:#c9d3dc;
    --accent:#0891b2;--accent-soft:rgba(8,145,178,0.12);--accent-line:#0891b2;
    --series-cyan:#0891b2;--series-violet:#4a3aa7;
    --shadow:0 1px 2px rgba(16,32,48,0.06),0 8px 22px rgba(16,32,48,0.08);
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    background: var(--plane);
    color: var(--ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    line-height: 1.45;
    overflow-x: clip;
  }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 20px 64px; }

  /* ---------- topbar ---------- */
  .topbar {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    padding: 18px 0 14px;
  }
  .brand { display: flex; align-items: baseline; gap: 10px; }
  .brand .mark {
    font-family: var(--font-mono); font-weight: 700; letter-spacing: 0.14em;
    font-size: 15px; color: var(--ink);
  }
  .brand .mark b { color: var(--accent); font-weight: 700; }
  .brand .sub { font-size: 12.5px; color: var(--muted); }
  .spacer { flex: 1 1 auto; }

  .prop {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 12px; color: var(--ink-2);
    background: var(--surface); border: 1px solid var(--border);
    padding: 6px 10px; border-radius: 8px;
  }
  .prop .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .prop .soon { color: var(--muted); opacity: 0.6; }
  .prop .sep { color: var(--muted); opacity: 0.4; }

  .updated { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11.5px; color: var(--muted); }
  .live { width: 7px; height: 7px; border-radius: 50%; background: var(--good); box-shadow: 0 0 0 3px rgba(12,163,12,0.18); }

  .tbtn {
    font: inherit; font-size: 12px; color: var(--ink-2);
    background: var(--surface); border: 1px solid var(--border);
    padding: 6px 10px; border-radius: 8px; cursor: pointer;
  }
  .tbtn:hover { color: var(--ink); border-color: var(--accent); }

  .snap {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    font-size: 12px; color: var(--ink-2);
    background: linear-gradient(0deg, var(--accent-soft), var(--accent-soft)), var(--surface);
    border: 1px solid var(--border); border-radius: 10px;
    padding: 9px 13px; margin-bottom: 18px;
  }
  .snap b { color: var(--ink); font-weight: 600; }
  .snap .k { font-family: var(--font-mono); color: var(--accent-line); }

  /* ---------- tabs ---------- */
  .tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 22px; }
  .tab-btn {
    font: inherit; font-size: 14px; font-weight: 600; color: var(--muted);
    background: none; border: none; border-bottom: 2px solid transparent;
    padding: 10px 14px; margin-bottom: -1px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
  }
  .tab-btn:hover { color: var(--ink-2); }
  .tab-btn[aria-selected="true"] { color: var(--ink); border-bottom-color: var(--accent); }
  .tab-btn .cnt { font-family: var(--font-mono); font-size: 11px; color: var(--muted); background: var(--surface-2); padding: 1px 6px; border-radius: 20px; }
  .tab-btn[aria-selected="true"] .cnt { color: var(--accent-line); }

  .tab { display: none; }
  .tab.active { display: block; animation: fade .25s ease; }
  @keyframes fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

  /* ---------- kpi ---------- */
  .kpis { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 20px; }
  .kpi {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 13px 14px 14px; box-shadow: var(--shadow); min-width: 0;
  }
  .kpi .lab { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 6px; }
  .kpi .val { font-size: 27px; font-weight: 650; letter-spacing: -0.02em; margin-top: 7px; font-variant-numeric: tabular-nums; }
  .kpi .val small { font-size: 14px; font-weight: 600; color: var(--ink-2); letter-spacing: 0; }
  .kpi .ctx { margin-top: 5px; font-size: 11.5px; color: var(--ink-2); display: flex; align-items: center; gap: 6px; font-variant-numeric: tabular-nums; }
  .pill { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 20px; font-variant-numeric: tabular-nums; }
  .pill.good { color: var(--good); background: rgba(12,163,12,0.13); }
  .pill.down { color: var(--serious); background: rgba(236,131,90,0.13); }
  .pill.up { color: var(--good); background: rgba(12,163,12,0.13); }
  .pill.flat { color: var(--ink-2); background: var(--surface-2); }
  .kpi.hot { background: linear-gradient(0deg, var(--accent-soft), var(--accent-soft)), var(--surface); }

  /* ---------- panels ---------- */
  .grid { display: grid; gap: 14px; }
  .g2 { grid-template-columns: 1fr 1fr; }
  .g3 { grid-template-columns: 1.4fr 1fr; }
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow); overflow: hidden; }
  .panel-h { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 15px 16px 4px; }
  .panel-h h3 { margin: 0; font-size: 14px; font-weight: 650; letter-spacing: -0.01em; }
  .panel-h .note { font-size: 11.5px; color: var(--muted); font-family: var(--font-mono); }
  .panel-b { padding: 8px 16px 16px; }
  .lead { padding: 0 16px 14px; font-size: 12.5px; color: var(--ink-2); }

  /* ---------- bar list ---------- */
  .bars { display: flex; flex-direction: column; gap: 9px; margin-top: 6px; }
  .bar { display: grid; grid-template-columns: 130px 1fr 62px; align-items: center; gap: 10px; }
  .bar .bl { font-size: 12.5px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar .bl code { font-family: var(--font-mono); font-size: 11.5px; color: var(--ink); }
  .bar .bl .tag { font-family: var(--font-mono); font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); border: 1px solid var(--border); border-radius: 4px; padding: 0 4px; margin-left: 6px; }
  .bar .track { height: 9px; background: var(--surface-2); border-radius: 5px; overflow: hidden; }
  .bar .fill { height: 100%; border-radius: 5px; background: var(--accent); min-width: 3px; transition: width .6s cubic-bezier(.2,.7,.2,1); }
  .bar .fill.violet { background: var(--series-violet); }
  .bar .bv { text-align: right; font-family: var(--font-mono); font-size: 12px; color: var(--ink); font-variant-numeric: tabular-nums; }
  .bar .bv i { color: var(--muted); font-style: normal; font-size: 10.5px; }

  /* ---------- status stack ---------- */
  .stack { display: flex; height: 30px; border-radius: 8px; overflow: hidden; margin: 8px 0 14px; border: 1px solid var(--border); }
  .stack span { display: block; height: 100%; }
  .legend { display: flex; flex-wrap: wrap; gap: 6px 18px; }
  .lg { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--ink-2); }
  .lg .sw { width: 10px; height: 10px; border-radius: 3px; }
  .lg b { color: var(--ink); font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
  .lg .pc { color: var(--muted); font-family: var(--font-mono); font-size: 11px; }

  /* ---------- charts ---------- */
  .chart { width: 100%; position: relative; }
  .chart svg { display: block; width: 100%; }
  .chart text { font-family: var(--font-mono); fill: var(--muted); }
  .tip {
    position: fixed; z-index: 50; pointer-events: none; opacity: 0; transform: translateY(-4px);
    background: var(--surface-2); color: var(--ink); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 9px; font-size: 12px; box-shadow: var(--shadow);
    font-variant-numeric: tabular-nums; transition: opacity .12s; white-space: nowrap;
  }
  .tip .tt { font-family: var(--font-mono); font-size: 10.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
  .tip .tr { display: flex; align-items: center; gap: 7px; }
  .tip .tr .sw { width: 9px; height: 9px; border-radius: 2px; }
  .tip b { font-weight: 650; }

  .chartlegend { display: flex; gap: 16px; padding: 2px 16px 0; }
  .chartlegend .lg { font-size: 12px; }

  /* ---------- callout ---------- */
  .callout {
    display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: center;
    background: linear-gradient(0deg, var(--accent-soft), var(--accent-soft)), var(--surface);
    border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px;
  }
  .callout .big { font-size: 40px; font-weight: 700; letter-spacing: -0.03em; color: var(--accent-line); font-variant-numeric: tabular-nums; line-height: 1; }
  .callout .txt { font-size: 13px; color: var(--ink-2); }
  .callout .txt b { color: var(--ink); }
  .cmp { display: flex; gap: 20px; margin-top: 10px; flex-wrap: wrap; }
  .cmp .cb { min-width: 150px; }
  .cmp .cb .cl { font-size: 11.5px; color: var(--muted); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em; }
  .cmp .cb .cv { font-size: 18px; font-weight: 650; font-variant-numeric: tabular-nums; }
  .cmp .cb .ct { height: 7px; border-radius: 4px; margin-top: 5px; }

  /* ---------- empty / roadmap ---------- */
  .empty { display: flex; gap: 10px; align-items: flex-start; font-size: 12.5px; color: var(--muted); background: var(--surface-2); border: 1px dashed var(--border); border-radius: 10px; padding: 12px 14px; }
  .empty .ic { color: var(--ink-2); font-size: 14px; line-height: 1.3; }

  footer { margin-top: 30px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 11.5px; color: var(--muted); font-family: var(--font-mono); line-height: 1.7; }
  footer b { color: var(--ink-2); }

  a { color: var(--accent-line); }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }

  @media (max-width: 900px) {
    .kpis { grid-template-columns: repeat(3, 1fr); }
    .g2, .g3 { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .kpis { grid-template-columns: repeat(2, 1fr); }
    .bar { grid-template-columns: 100px 1fr 54px; }
    .callout { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }

  /* ---------- color-coded tabs (Overview / Regular / AI) ---------- */
  .tab-btn[data-tab="overview"] { --tc: #22d3ee; }
  .tab-btn[data-tab="regular"]  { --tc: #22c55e; }
  .tab-btn[data-tab="ai"]       { --tc: #a78bfa; }
  @media (prefers-color-scheme: light) {
    .tab-btn[data-tab="overview"] { --tc: #0891b2; }
    .tab-btn[data-tab="regular"]  { --tc: #15803d; }
    .tab-btn[data-tab="ai"]       { --tc: #7c3aed; }
  }
  :root[data-theme="dark"] .tab-btn[data-tab="overview"] { --tc: #22d3ee; }
  :root[data-theme="dark"] .tab-btn[data-tab="regular"]  { --tc: #22c55e; }
  :root[data-theme="dark"] .tab-btn[data-tab="ai"]       { --tc: #a78bfa; }
  :root[data-theme="light"] .tab-btn[data-tab="overview"] { --tc: #0891b2; }
  :root[data-theme="light"] .tab-btn[data-tab="regular"]  { --tc: #15803d; }
  :root[data-theme="light"] .tab-btn[data-tab="ai"]       { --tc: #7c3aed; }
  .tab-btn::before {
    content: ""; width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto;
    background: var(--tc); opacity: 0.5; transition: opacity .15s, box-shadow .15s;
  }
  .tab-btn:hover::before { opacity: 0.85; }
  .tab-btn[aria-selected="true"]::before { opacity: 1; box-shadow: 0 0 0 3px color-mix(in srgb, var(--tc) 24%, transparent); }
  .tab-btn[aria-selected="true"] { color: var(--ink); border-bottom-color: var(--tc); }
  .tab-btn[aria-selected="true"] .cnt { color: var(--tc); }
`;
const MARKUP = `<div class="wrap">
  <header class="topbar">
    <div class="brand">
      <span class="mark">VAN<b>TAGE</b></span>
      <span class="sub">Traffic &amp; AI-visibility console</span>
    </div>
    <span class="spacer"></span>
    <span class="prop">
      <span class="dot"></span> vr.org
    </span>
    <span class="updated"><span class="live"></span> <span id="updated">updated …</span></span>
    <button class="tbtn" id="themeBtn" type="button">Theme</button>
      <a class="tbtn" href="/api/console/logout" style="text-decoration:none;">Sign out</a>
  </header>

  <div class="snap"><span>🟢 <b>Live</b> · reading <span class="k">/api/stats</span> + <span class="k">/api/ai-stats</span> from the VR.org VPS.</span><span>nginx logs, 60s server cache. Data as of <span class="k" id="snapDate">…</span>, refresh for the latest.</span></div>

  <nav class="tabs" role="tablist">
    <button class="tab-btn" role="tab" aria-selected="true" data-tab="overview">Overview <span class="cnt">general</span></button>
    <button class="tab-btn" role="tab" aria-selected="false" data-tab="regular">Regular Traffic</button>
    <button class="tab-btn" role="tab" aria-selected="false" data-tab="ai">AI Traffic <span class="cnt" id="aiCnt">…</span></button>
  </nav>

  <!-- ============ OVERVIEW ============ -->
  <section class="tab active" id="tab-overview">
    <div class="kpis" id="ovKpis"></div>

    <div class="grid g3" style="margin-bottom:14px;">
      <div class="panel">
        <div class="panel-h"><h3>Requests · last 24 hours</h3><span class="note">all HTTP, hourly</span></div>
        <div class="panel-b"><div class="chart" id="ovArea"></div></div>
      </div>
      <div class="panel">
        <div class="panel-h"><h3>Machines vs. search</h3><span class="note">24h reads</span></div>
        <div class="panel-b">
          <div class="callout" style="border:none;padding:0;background:none;">
            <div class="big" id="ovRatio">…</div>
            <div class="txt"><b>AI assistants now out-fetch every traditional search crawler combined.</b> Your content is being read into answers more than it is being indexed for links.</div>
          </div>
          <div class="cmp">
            <div class="cb"><div class="cl">AI assistants</div><div class="cv" id="ovAi">…</div><div class="ct" id="ovAiBar" style="background:var(--accent);"></div></div>
            <div class="cb"><div class="cl">Search crawlers</div><div class="cv" id="ovSearch">…</div><div class="ct" id="ovSearchBar" style="background:var(--muted);"></div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid g2">
      <div class="panel">
        <div class="panel-h"><h3>Where humans arrive from</h3><span class="note">referrer · pageviews</span></div>
        <div class="panel-b"><div class="bars" id="ovReferrers"></div></div>
      </div>
      <div class="panel">
        <div class="panel-h"><h3>Which AIs are reading you</h3><span class="note">by vendor · hits</span></div>
        <div class="panel-b"><div class="bars" id="ovVendors"></div></div>
      </div>
    </div>
  </section>

  <!-- ============ REGULAR TRAFFIC ============ -->
  <section class="tab" id="tab-regular">
    <div class="kpis" id="regKpis"></div>

    <div class="panel" style="margin-bottom:14px;">
      <div class="panel-h"><h3>Request volume · rolling 24 hours</h3><span class="note" id="regAreaNote">…</span></div>
      <div class="panel-b"><div class="chart" id="regArea"></div></div>
    </div>

    <div class="grid g2" style="margin-bottom:14px;">
      <div class="panel">
        <div class="panel-h"><h3>Response health</h3><span class="note">status codes · 24h</span></div>
        <div class="panel-b">
          <div class="stack" id="regStack"></div>
          <div class="legend" id="regStackLegend"></div>
          <div class="empty" style="margin-top:14px;"><span class="ic">✓</span><span id="regHealthNote">…</span></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-h"><h3>Top referrers</h3><span class="note">human pageviews · 24h</span></div>
        <div class="panel-b"><div class="bars" id="regReferrers"></div></div>
      </div>
    </div>

    <div class="grid g2">
      <div class="panel">
        <div class="panel-h"><h3>Search-engine crawlers</h3><span class="note">indexing bots · 24h</span></div>
        <div class="panel-b"><div class="bars" id="regCrawlers"></div></div>
      </div>
      <div class="panel">
        <div class="panel-h"><h3>Not wired yet</h3><span class="note">roadmap</span></div>
        <div class="panel-b">
          <div class="empty" style="margin-bottom:10px;"><span class="ic">◷</span><span><b style="color:var(--ink-2)">Geo / country breakdown.</b> Nginx access logs carry no geo data. Add the GeoIP module (or read Cloudflare's country header) and this becomes a live map.</span></div>
          <div class="empty"><span class="ic">◷</span><span><b style="color:var(--ink-2)">Cache hit ratio.</b> Not in the current log format. Add <code>$upstream_cache_status</code> to the nginx log and it reports here.</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ AI TRAFFIC ============ -->
  <section class="tab" id="tab-ai">
    <div class="kpis" id="aiKpis"></div>

    <div class="panel" style="margin-bottom:14px;">
      <div class="panel-h"><h3>AI reads · 7-day trend</h3><span class="note">daily, from rotated logs</span></div>
      <div class="chartlegend" id="aiTrendLegend"></div>
      <div class="panel-b"><div class="chart" id="aiTrend"></div></div>
    </div>

    <div class="grid g2" style="margin-bottom:14px;">
      <div class="panel">
        <div class="panel-h"><h3>By vendor</h3><span class="note">hits · 24h</span></div>
        <div class="panel-b"><div class="bars" id="aiVendors"></div></div>
      </div>
      <div class="panel">
        <div class="panel-h"><h3>By bot</h3><span class="note">user-agent · 24h</span></div>
        <div class="panel-b"><div class="bars" id="aiBots"></div></div>
      </div>
    </div>

    <div class="grid g3" style="margin-bottom:14px;">
      <div class="panel">
        <div class="panel-h"><h3>What ChatGPT reads most</h3><span class="note">live-answer fetches · 24h</span></div>
        <div class="panel-b"><div class="bars" id="aiPages"></div></div>
      </div>
      <div class="panel">
        <div class="panel-h"><h3>ChatGPT demand by hour</h3><span class="note">UTC · fetches</span></div>
        <div class="panel-b"><div class="chart" id="aiHourly"></div>
          <p class="lead" style="padding:12px 0 0;">Near-flat around the clock (<span id="aiHourlyRange">…</span>/hr). That is machine demand, not human day/night rhythm.</p>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-h"><h3>The read-to-click gap</h3><span class="note">the honest part</span></div>
      <div class="panel-b">
        <div class="callout" style="border:none;padding:0;background:none;">
          <div class="big" id="aiGap">…</div>
          <div class="txt"><b>ChatGPT reads vr.org roughly <span id="aiGapWord">…</span> times for every human it sends back.</b> Machines consume the content to answer people in-app; the click-through is the small tail. Great for visibility and authority, a real attribution challenge for measuring it.</div>
        </div>
        <div class="cmp">
          <div class="cb"><div class="cl">ChatGPT reads</div><div class="cv" id="aiReads">…</div><div class="ct" style="background:var(--accent);"></div></div>
          <div class="cb"><div class="cl">Human clicks from AI</div><div class="cv" id="aiClicks">…</div><div class="ct" id="aiClicksBar" style="background:var(--series-violet);"></div></div>
        </div>
        <div class="bars" id="aiReferralSrc" style="margin-top:16px;"></div>
      </div>
    </div>
  </section>

  <footer><div><b>Vantage</b> · live console for the VR.org team. Reads nginx access logs on the VPS: <b>/api/stats</b> (regular traffic) and <b>/api/ai-stats</b> (AI bots + referrals, <b>?trend=N</b>). 60-second server cache; refresh to update.</div></footer>
</div>`;
const st=document.createElement("style"); st.textContent=CSS; document.head.appendChild(st);
document.body.insertAdjacentHTML("afterbegin", MARKUP);
const tipEl=document.createElement("div"); tipEl.id="tip"; tipEl.className="tip"; document.body.appendChild(tipEl);

let STATS=null, AI=null, TREND=null;

/* ============================ HELPERS ============================ */
const $ = s => document.querySelector(s);
const el = (t,c,h) => { const e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; };
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const fmt = n => n.toLocaleString("en-US");
const fmtK = n => n>=1000 ? (n/1000).toFixed(n>=10000?0:1).replace(/\.0$/,'')+"k" : ""+n;
const pct = (a,b) => (100*a/b);
function gb(bytes){ return (bytes/1e9).toFixed(2)+" GB"; }


/* ============================ KPI TILES ============================ */
function kpi(lab, val, ctxHTML, opts={}) {
  const e = el("div","kpi"+(opts.hot?" hot":""));
  e.appendChild(el("div","lab",lab));
  e.appendChild(el("div","val",val));
  if(ctxHTML) e.appendChild(el("div","ctx",ctxHTML));
  return e;
}
function renderOverviewKpis(){
  const c=$("#ovKpis"); c.innerHTML="";
  const d = STATS.requests24h - STATS.requests24hPrev;
  const dp = (100*d/STATS.requests24hPrev);
  const delta = `<span class="pill ${d<0?'down':'up'}">${d<0?'▼':'▲'} ${Math.abs(dp).toFixed(1)}%</span> vs prev 24h`;
  c.appendChild(kpi("Requests · 24h", fmt(STATS.requests24h), delta));
  c.appendChild(kpi("Unique visitors", fmt(STATS.uniqueVisitors24h), "distinct IPs incl. crawlers"));
  c.appendChild(kpi("AI bot reads", fmt(AI.botsTotalHits), `<span class="pill good">${fmt(AI.chatgpt.uniqueIps)} ChatGPT sessions</span>`, {hot:true}));
  c.appendChild(kpi("Bandwidth · 24h", gb(STATS.bandwidth24h), "served to all clients"));
  c.appendChild(kpi("AI referral clicks", fmt(AI.referrals.total), "humans arriving from AI"));
  c.appendChild(kpi("Server errors", "0", `<span class="pill good">100% availability</span>`));
}
function renderRegularKpis(){
  const c=$("#regKpis"); c.innerHTML="";
  c.appendChild(kpi("Requests · 24h", fmt(STATS.requests24h), "all HTTP requests"));
  c.appendChild(kpi("Unique visitors", fmt(STATS.uniqueVisitors24h), "distinct IPs"));
  c.appendChild(kpi("Requests · last hour", fmt(STATS.requests1h), `≈ ${fmt(Math.round(STATS.requests24h/24))}/hr avg`));
  c.appendChild(kpi("Bandwidth · 24h", gb(STATS.bandwidth24h), "≈ "+ (STATS.bandwidth24h/STATS.requests24h/1024).toFixed(1) +" KB/req"));
  c.appendChild(kpi("Success rate", pct(STATS.status.s2,STATS.requests24h).toFixed(1)+"%", `<span class="pill good">2xx responses</span>`));
  c.appendChild(kpi("Client errors", fmt(STATS.status.s4), `<span class="pill flat">${pct(STATS.status.s4,STATS.requests24h).toFixed(1)}% · 4xx</span>`));
}
function renderAiKpis(){
  const c=$("#aiKpis"); c.innerHTML="";
  const ratio = (AI.referrals.chatgptClicks ? AI.chatgpt.hits/AI.referrals.chatgptClicks : AI.chatgpt.hits);
  c.appendChild(kpi("AI reads · 24h", fmt(AI.botsTotalHits), `across ${AI.bots.length} assistants`, {hot:true}));
  c.appendChild(kpi("ChatGPT sessions", fmt(AI.chatgpt.uniqueIps), "unique IPs, 24h"));
  c.appendChild(kpi("Pages ChatGPT read", fmt(AI.chatgpt.distinctPages), "distinct URLs"));
  c.appendChild(kpi("Read : click ratio", Math.round(ratio)+":1", "ChatGPT reads vs clicks"));
  c.appendChild(kpi("Fetch success", pct(AI.chatgpt.status2xx,AI.chatgpt.hits).toFixed(1)+"%", `<span class="pill good">${AI.chatgpt.statusOther} errors</span>`));
  c.appendChild(kpi("AI referral clicks", fmt(AI.referrals.total), `${fmt(AI.referrals.chatgptUniqueVisitors)} from ChatGPT`));
}

/* ============================ BAR LIST ============================ */
function barList(sel, items, opts={}){
  const host=$(sel); host.innerHTML="";
  const max = opts.max || Math.max(...items.map(i=>i.value));
  const violet = opts.violet;
  items.forEach(it=>{
    const row=el("div","bar");
    const lab = it.mono ? ("<code>"+esc(it.label)+"</code>") : esc(it.label);
    const tag = it.tag ? `<span class="tag">${it.tag}</span>` : "";
    row.appendChild(el("div","bl",lab+tag));
    const track=el("div","track");
    const fill=el("div","fill"+(violet?" violet":""));
    fill.style.width = Math.max(2, 100*it.value/max)+"%";
    track.appendChild(fill); row.appendChild(track);
    const sub = it.sub!=null ? ` <i>${it.sub}</i>` : "";
    row.appendChild(el("div","bv", fmt(it.value)+sub));
    host.appendChild(row);
  });
}

/* ============================ STATUS STACK ============================ */
function renderStatus(){
  const s=STATS.status, tot=STATS.requests24h;
  const segs=[
    ["2xx OK", s.s2, cssv("--good")],
    ["3xx redirect", s.s3, cssv("--muted")],
    ["4xx client", s.s4, cssv("--warn")],
    ["5xx server", s.s5, cssv("--crit")]
  ];
  const stack=$("#regStack"); stack.innerHTML="";
  const leg=$("#regStackLegend"); leg.innerHTML="";
  segs.forEach(([lab,v,col])=>{
    if(v>0){ const sp=document.createElement("span"); sp.style.width=(100*v/tot)+"%"; sp.style.background=col; sp.title=`${lab}: ${fmt(v)}`; stack.appendChild(sp); }
    const lg=el("div","lg",`<span class="sw" style="background:${col}"></span>${lab} <b>${fmt(v)}</b> <span class="pc">${pct(v,tot).toFixed(1)}%</span>`);
    leg.appendChild(lg);
  });
  $("#regHealthNote").innerHTML = `<b style="color:var(--good)">Zero 5xx errors in 24 hours.</b> ${pct(s.s2,tot).toFixed(1)}% of ${fmt(tot)} requests returned OK; the ${fmt(s.s4)} 4xx are mostly bots probing dead paths.`;
}

/* ============================ AREA / BAR CHART (single series) ============================ */
function areaChart(sel, data, opts={}){
  const host=$(sel); host.innerHTML="";
  const W=host.clientWidth||640, H=opts.h||190, padL=8, padR=8, padT=14, padB=22;
  const iw=W-padL-padR, ih=H-padT-padB;
  const max=Math.max(...data)*1.08, n=data.length;
  const X=i=> padL + (n===1?iw/2: iw*i/(n-1));
  const Y=v=> padT + ih - ih*(v/max);
  const asBars = opts.bars;
  const svgNS="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(svgNS,"svg"); svg.setAttribute("viewBox",`0 0 ${W} ${H}`); svg.setAttribute("height",H);
  // gridlines
  for(let g=0; g<=2; g++){ const y=padT+ih*g/2; const ln=document.createElementNS(svgNS,"line");
    ln.setAttribute("x1",padL); ln.setAttribute("x2",W-padR); ln.setAttribute("y1",y); ln.setAttribute("y2",y);
    ln.setAttribute("stroke",cssv("--grid")); ln.setAttribute("stroke-width","1"); svg.appendChild(ln);
    const tx=document.createElementNS(svgNS,"text"); tx.setAttribute("x",padL); tx.setAttribute("y",y-3); tx.setAttribute("font-size","9.5");
    tx.textContent=fmtK(Math.round(max*(1-g/2))); svg.appendChild(tx); }
  const acc=cssv("--accent-line"), accSoft=cssv("--accent");
  if(asBars){
    const bw = iw/n*0.62;
    data.forEach((v,i)=>{ const x=X(i)-bw/2, y=Y(v), h=padT+ih-y;
      const r=document.createElementNS(svgNS,"rect"); r.setAttribute("x",x); r.setAttribute("y",y);
      r.setAttribute("width",bw); r.setAttribute("height",Math.max(1,h)); r.setAttribute("rx","2.5");
      r.setAttribute("fill", i===opts.hi ? acc : accSoft); r.setAttribute("opacity", i===opts.hi?1:0.85); svg.appendChild(r); });
  } else {
    let dl=`M ${X(0)} ${Y(data[0])}`, dp=`M ${X(0)} ${padT+ih} L ${X(0)} ${Y(data[0])}`;
    for(let i=1;i<n;i++){ dl+=` L ${X(i)} ${Y(data[i])}`; dp+=` L ${X(i)} ${Y(data[i])}`; }
    dp+=` L ${X(n-1)} ${padT+ih} Z`;
    const grad=document.createElementNS(svgNS,"linearGradient"); const gid="g"+Math.random().toString(36).slice(2);
    grad.setAttribute("id",gid); grad.setAttribute("x1","0");grad.setAttribute("x2","0");grad.setAttribute("y1","0");grad.setAttribute("y2","1");
    grad.innerHTML=`<stop offset="0" stop-color="${acc}" stop-opacity="0.28"/><stop offset="1" stop-color="${acc}" stop-opacity="0.02"/>`;
    svg.appendChild(grad);
    const area=document.createElementNS(svgNS,"path"); area.setAttribute("d",dp); area.setAttribute("fill",`url(#${gid})`); svg.appendChild(area);
    const line=document.createElementNS(svgNS,"path"); line.setAttribute("d",dl); line.setAttribute("fill","none");
    line.setAttribute("stroke",acc); line.setAttribute("stroke-width","2"); line.setAttribute("stroke-linejoin","round"); svg.appendChild(line);
    const dot=document.createElementNS(svgNS,"circle"); dot.setAttribute("cx",X(n-1)); dot.setAttribute("cy",Y(data[n-1]));
    dot.setAttribute("r","3.5"); dot.setAttribute("fill",acc); dot.setAttribute("stroke",cssv("--surface")); dot.setAttribute("stroke-width","2"); svg.appendChild(dot);
  }
  // x labels
  (opts.xlabels||[]).forEach(([i,txt])=>{ const tx=document.createElementNS(svgNS,"text"); tx.setAttribute("x",X(i));
    tx.setAttribute("y",H-6); tx.setAttribute("font-size","9.5"); tx.setAttribute("text-anchor", i===0?"start":(i===n-1?"end":"middle")); tx.textContent=txt; svg.appendChild(tx); });
  // focus + hover
  const focus=document.createElementNS(svgNS,"line"); focus.setAttribute("stroke",cssv("--axis")); focus.setAttribute("stroke-width","1"); focus.setAttribute("y1",padT); focus.setAttribute("y2",padT+ih); focus.style.opacity=0; svg.appendChild(focus);
  const fdot=document.createElementNS(svgNS,"circle"); fdot.setAttribute("r","3.5"); fdot.setAttribute("fill",acc); fdot.setAttribute("stroke",cssv("--surface")); fdot.setAttribute("stroke-width","2"); fdot.style.opacity=0; svg.appendChild(fdot);
  host.appendChild(svg);
  const tip=$("#tip");
  svg.addEventListener("mousemove",e=>{
    const rect=svg.getBoundingClientRect(), rx=(e.clientX-rect.left)*(W/rect.width);
    let i=Math.round((rx-padL)/(iw/(n-1))); i=Math.max(0,Math.min(n-1,i));
    focus.setAttribute("x1",X(i)); focus.setAttribute("x2",X(i)); focus.style.opacity=1;
    fdot.setAttribute("cx",X(i)); fdot.setAttribute("cy",Y(data[i])); fdot.style.opacity=1;
    tip.innerHTML=`<div class="tt">${(opts.tiplabels&&opts.tiplabels[i])||(opts.name||"")}</div><div class="tr"><span class="sw" style="background:${acc}"></span><b>${fmt(data[i])}</b> ${opts.unit||""}</div>`;
    tip.style.opacity=1; tip.style.left=Math.min(e.clientX+14, window.innerWidth-140)+"px"; tip.style.top=(e.clientY-10)+"px";
  });
  svg.addEventListener("mouseleave",()=>{ tip.style.opacity=0; focus.style.opacity=0; fdot.style.opacity=0; });
}

/* ============================ TREND (two series) ============================ */
function trendChart(sel){
  const host=$(sel); host.innerHTML="";
  const W=host.clientWidth||900, H=210, padL=10, padR=48, padT=16, padB=24;
  const iw=W-padL-padR, ih=H-padT-padB, n=TREND.length;
  const all=TREND.flatMap(r=>[r[1],r[2]]); const max=Math.max(...all)*1.1;
  const X=i=> padL + iw*i/(n-1), Y=v=> padT+ih-ih*(v/max);
  const svgNS="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(svgNS,"svg"); svg.setAttribute("viewBox",`0 0 ${W} ${H}`); svg.setAttribute("height",H);
  for(let g=0; g<=3; g++){ const y=padT+ih*g/3; const ln=document.createElementNS(svgNS,"line");
    ln.setAttribute("x1",padL);ln.setAttribute("x2",W-padR);ln.setAttribute("y1",y);ln.setAttribute("y2",y);
    ln.setAttribute("stroke",cssv("--grid"));ln.setAttribute("stroke-width","1");svg.appendChild(ln);
    const tx=document.createElementNS(svgNS,"text");tx.setAttribute("x",padL);tx.setAttribute("y",y-3);tx.setAttribute("font-size","9.5");
    tx.textContent=fmtK(Math.round(max*(1-g/3)));svg.appendChild(tx);}
  const series=[ {name:"All AI reads", col:cssv("--series-cyan"), idx:1}, {name:"ChatGPT only", col:cssv("--series-violet"), idx:2} ];
  series.forEach(s=>{
    let d=`M ${X(0)} ${Y(TREND[0][s.idx])}`;
    for(let i=1;i<n;i++) d+=` L ${X(i)} ${Y(TREND[i][s.idx])}`;
    const line=document.createElementNS(svgNS,"path"); line.setAttribute("d",d); line.setAttribute("fill","none");
    line.setAttribute("stroke",s.col); line.setAttribute("stroke-width","2"); line.setAttribute("stroke-linejoin","round"); svg.appendChild(line);
    TREND.forEach((r,i)=>{ const c=document.createElementNS(svgNS,"circle"); c.setAttribute("cx",X(i)); c.setAttribute("cy",Y(r[s.idx]));
      c.setAttribute("r", i===n-1?"3.6":"2.4"); c.setAttribute("fill",s.col); svg.appendChild(c); });
    // direct end label
    const lb=document.createElementNS(svgNS,"text"); lb.setAttribute("x",X(n-1)+7); lb.setAttribute("y",Y(TREND[n-1][s.idx])+3);
    lb.setAttribute("font-size","10"); lb.setAttribute("fill",s.col); lb.textContent=fmtK(TREND[n-1][s.idx]); svg.appendChild(lb);
  });
  TREND.forEach((r,i)=>{ const tx=document.createElementNS(svgNS,"text"); tx.setAttribute("x",X(i)); tx.setAttribute("y",H-6);
    tx.setAttribute("font-size","9.5"); tx.setAttribute("text-anchor","middle"); tx.textContent=r[0]; svg.appendChild(tx); });
  const focus=document.createElementNS(svgNS,"line"); focus.setAttribute("stroke",cssv("--axis")); focus.setAttribute("stroke-width","1"); focus.setAttribute("y1",padT); focus.setAttribute("y2",padT+ih); focus.style.opacity=0; svg.appendChild(focus);
  host.appendChild(svg);
  const tip=$("#tip");
  svg.addEventListener("mousemove",e=>{
    const rect=svg.getBoundingClientRect(), rx=(e.clientX-rect.left)*(W/rect.width);
    let i=Math.round((rx-padL)/(iw/(n-1))); i=Math.max(0,Math.min(n-1,i));
    focus.setAttribute("x1",X(i)); focus.setAttribute("x2",X(i)); focus.style.opacity=1;
    tip.innerHTML=`<div class="tt">${TREND[i][0]}</div>`+
      `<div class="tr"><span class="sw" style="background:${series[0].col}"></span>All AI <b>${fmt(TREND[i][1])}</b></div>`+
      `<div class="tr"><span class="sw" style="background:${series[1].col}"></span>ChatGPT <b>${fmt(TREND[i][2])}</b></div>`;
    tip.style.opacity=1; tip.style.left=Math.min(e.clientX+14,window.innerWidth-150)+"px"; tip.style.top=(e.clientY-10)+"px";
  });
  svg.addEventListener("mouseleave",()=>{ tip.style.opacity=0; focus.style.opacity=0; });
  const leg=$("#aiTrendLegend"); leg.innerHTML="";
  series.forEach(s=> leg.appendChild(el("div","lg",`<span class="sw" style="background:${s.col}"></span>${s.name}`)));
}

/* ============================ RENDER ALL ============================ */
function classTag(t){ return t==="internal"?"internal": t==="other"?"other": ""; }
function renderStatic(){ if(!STATS||!AI||!TREND) return;
  const SEARCH_TOTAL = AI.search.reduce((s,x)=>s+x[1],0);
  // overview
  renderOverviewKpis();
  $("#ovRatio").textContent = (AI.botsTotalHits/SEARCH_TOTAL).toFixed(1)+"×";
  $("#ovAi").textContent = fmt(AI.botsTotalHits);
  $("#ovSearch").textContent = fmt(SEARCH_TOTAL);
  const mx=Math.max(AI.botsTotalHits,SEARCH_TOTAL);
  $("#ovAiBar").style.width=(100*AI.botsTotalHits/mx)+"%";
  $("#ovSearchBar").style.width=(100*SEARCH_TOTAL/mx)+"%";
  barList("#ovReferrers", AI.topReferrers.filter(r=>r[2]!=="internal").slice(0,7).map(r=>({label:r[0]==="(direct)"?"Direct":r[0], value:r[1], mono:r[0]!=="(direct)", tag:classTag(r[2])})));
  barList("#ovVendors", AI.vendors.slice(0,7).map(v=>({label:v[0], value:v[1], sub: v[0]==="OpenAI"?pct(v[1],AI.botsTotalHits).toFixed(0)+"%":null})));
  $("#aiCnt").textContent = fmt(AI.botsTotalHits);

  // regular
  renderRegularKpis();
  renderStatus();
  barList("#regReferrers", AI.topReferrers.slice(0,12).map(r=>({label:r[0]==="(direct)"?"Direct":r[0], value:r[1], mono:r[0]!=="(direct)", tag:classTag(r[2])})));
  barList("#regCrawlers", AI.search.map(s=>({label:s[0], value:s[1], mono:true})));

  // ai
  renderAiKpis();
  barList("#aiVendors", AI.vendors.map(v=>({label:v[0], value:v[1], sub: pct(v[1],AI.botsTotalHits).toFixed(0)+"%"})));
  barList("#aiBots", AI.bots.slice(0,12).map(b=>({label:b[0], value:b[1]})));
  barList("#aiPages", AI.chatgpt.topPages.map(p=>({label:p[0], value:p[1], mono:true})));
  const hmin=Math.min(...AI.chatgpt.hourlyUtc), hmax=Math.max(...AI.chatgpt.hourlyUtc);
  $("#aiHourlyRange").textContent = hmin+"-"+hmax;
  const gap = AI.referrals.chatgptClicks ? AI.chatgpt.hits/AI.referrals.chatgptClicks : AI.chatgpt.hits;
  $("#aiGap").textContent = Math.round(gap)+":1";
  $("#aiGapWord").textContent = Math.round(gap);
  $("#aiReads").textContent = fmt(AI.chatgpt.hits);
  $("#aiClicks").textContent = fmt(AI.referrals.chatgptClicks);
  $("#aiClicksBar")?.style && ($("#aiClicksBar").style.width="");
  barList("#aiReferralSrc", AI.referrals.bySource.map(s=>({label:s[0]+" → click-through", value:s[1]})), {violet:true, max:(AI.referrals.bySource[0]&&AI.referrals.bySource[0][1])||1});

  // timestamps
  const d=new Date(STATS.fetchedAt);
  const opt={month:"short",day:"numeric",year:"numeric"};
  $("#snapDate").textContent = d.toLocaleDateString("en-US",opt);
  const t=new Date(STATS.fetchedAt);
  $("#updated").textContent = "updated "+t.toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});
}
function renderCharts(){ if(!STATS||!AI||!TREND) return;
  areaChart("#ovArea", STATS.hourly, {h:180, name:"requests", unit:"requests", hi:STATS.hourly.length-1,
    xlabels:[[0,"-24h"],[12,"-12h"],[23,"now"]], tiplabels:STATS.hourly.map((_,i)=> i===STATS.hourly.length-1?"current hour":(STATS.hourly.length-1-i)+"h ago")});
  $("#regAreaNote").textContent = "peak "+fmt(Math.max(...STATS.hourly))+"/hr";
  areaChart("#regArea", STATS.hourly, {h:210, name:"requests", unit:"requests", hi:STATS.hourly.length-1,
    xlabels:[[0,"-24h"],[6,"-18h"],[12,"-12h"],[18,"-6h"],[23,"now"]], tiplabels:STATS.hourly.map((_,i)=> i===STATS.hourly.length-1?"current hour":(STATS.hourly.length-1-i)+"h ago")});
  trendChart("#aiTrend");
  areaChart("#aiHourly", AI.chatgpt.hourlyUtc, {h:170, bars:true, name:"ChatGPT fetches", unit:"fetches",
    xlabels:[[0,"00"],[6,"06"],[12,"12"],[18,"18"],[23,"23 UTC"]], tiplabels:AI.chatgpt.hourlyUtc.map((_,i)=> String(i).padStart(2,"0")+":00 UTC")});
}

/* ============================ TABS + THEME ============================ */
document.querySelectorAll(".tab-btn").forEach(b=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll(".tab-btn").forEach(x=>x.setAttribute("aria-selected","false"));
    b.setAttribute("aria-selected","true");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    $("#tab-"+b.dataset.tab).classList.add("active");
    renderCharts();
  });
});
function applyTheme(t){ document.documentElement.setAttribute("data-theme",t); try{localStorage.setItem("vantage-theme",t);}catch(e){} }
$("#themeBtn").addEventListener("click",()=>{
  const cur=document.documentElement.getAttribute("data-theme")||"dark";
  applyTheme(cur==="dark"?"light":"dark"); renderStatic(); renderCharts();
});
(function initTheme(){ let t="dark"; try{ t=localStorage.getItem("vantage-theme")||"dark"; }catch(e){} document.documentElement.setAttribute("data-theme",t); })();

let rz; window.addEventListener("resize",()=>{ clearTimeout(rz); rz=setTimeout(renderCharts,150); });


/* ============================ LIVE DATA ADAPTER ============================ */
function esc(x){ x=String(x==null?"":x); var m={38:"&amp;",60:"&lt;",62:"&gt;",34:"&quot;",39:"&#39;"}; return x.replace(/[&<>"']/g,function(c){return m[c.charCodeAt(0)];}); }
function classifyHost(h){
  if(!h || h==="(direct)") return "direct";
  if(h.indexOf("vr.org")>=0 || h.indexOf("104.225.12.76")>=0) return "internal";
  if(/google|bing|duckduckgo|brave|baidu|ecosia|kagi|yandex/.test(h)) return "search";
  return "other";
}
const VLABEL={chatgpt:"ChatGPT",gemini:"Gemini",claude:"Claude",perplexity:"Perplexity",copilot:"Copilot"};
function adapt(stats, ai){
  STATS={ fetchedAt:stats.fetchedAt, requests1h:stats.requests1h, requests24h:stats.requests24h,
    uniqueVisitors24h:stats.uniqueVisitors24h, bandwidth24h:stats.bandwidth24h, requests24hPrev:stats.requests24hPrev,
    status:{s2:stats.status2xx,s3:stats.status3xx,s4:stats.status4xx,s5:stats.status5xx}, hourly:stats.hourly||[] };
  const bySource=Object.entries(ai.referrals&&ai.referrals.bySource||{}).map(([k,v])=>[VLABEL[k]||k,v]).sort((a,b)=>b[1]-a[1]);
  AI={ fetchedAt:ai.fetchedAt, botsTotalHits:ai.botsTotalHits||0,
    vendors:Object.entries(ai.vendorTotals||{}).sort((a,b)=>b[1]-a[1]),
    bots:(ai.bots||[]).map(b=>[b.label,b.hits,b.vendor]),
    chatgpt:{ hits:ai.chatgptUser.hits, uniqueIps:ai.chatgptUser.uniqueIps, distinctPages:ai.chatgptUser.distinctPages,
      status2xx:ai.chatgptUser.status2xx, statusOther:ai.chatgptUser.statusOther,
      topPages:(ai.chatgptUser.topPages||[]).map(p=>[p.path,p.hits]), hourlyUtc:ai.chatgptUser.hourlyUtc||[] },
    referrals:{ total:ai.referrals.total, chatgptUniqueVisitors:ai.referrals.chatgptUniqueVisitors,
      chatgptClicks:(ai.referrals.bySource&&ai.referrals.bySource.chatgpt)||0, bySource:bySource },
    topReferrers:(ai.topReferrers||[]).map(r=>[r.host,r.pageviews,classifyHost(r.host)]),
    search:Object.entries(ai.searchReference||{}).sort((a,b)=>b[1]-a[1]) };
  TREND=(ai.trend||[]).slice().reverse().map(d=>[d.date.slice(5).replace("-","/"), d.aiTotal, d.chatgptUser]);
}
async function initVantage(){
  const u=document.getElementById("updated"); if(u) u.textContent="loading live data…";
  try{
    const [stats, ai] = await Promise.all([
      fetch("/api/stats",{cache:"no-store"}).then(r=>{ if(!r.ok) throw new Error("stats "+r.status); return r.json(); }),
      fetch("/api/ai-stats?trend=7",{cache:"no-store"}).then(r=>{ if(!r.ok) throw new Error("ai-stats "+r.status); return r.json(); })
    ]);
    adapt(stats, ai);
    renderStatic();
    renderCharts();
  }catch(err){
    if(u) u.textContent="data unavailable";
    const wrap=document.querySelector(".wrap");
    if(wrap){
      const e=document.createElement("div"); e.className="snap"; e.style.borderColor="var(--crit)";
      e.innerHTML='<span>⚠ <b>Could not load live data.</b> '+String(err&&err.message||err)+'. The stats endpoints may be warming up after a deploy; refresh in a moment.</span>';
      const nav=wrap.querySelector(".tabs"); wrap.insertBefore(e, nav||wrap.firstChild);
    }
  }
}
initVantage();

})();
