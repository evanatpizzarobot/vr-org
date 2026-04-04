# CLAUDE.md - VR.org

## Project Overview

VR.org is a real-time VR/AR/XR news aggregator combined with an original editorial publication. The site pulls headlines from 11 RSS sources, categorizes them across hub pages, and features VR.org Original articles written by the editorial team. Co-founded by Evan Marcus (Pizza Robot Studios LLC) and Mark Mahle (NetActuate).

**Live site:** https://vr.org
**Repo:** github.com/evanatpizzarobot/vr-org
**Owner:** Evan Marcus, evan@pizzarobotstudios.com

## Infrastructure

- **VPS:** NetActuate (Mark's company, netactuate.com), Ubuntu 24.04 LTS
- **IP:** 104.225.12.76
- **Location:** DFW2, Dallas, TX
- **Specs:** 2GB RAM, 1 CPU, 25GB Disk
- **SSH user:** ubuntu
- **SSH key:** ~/.ssh/vr-org (desktop), ~/.ssh/id_ed25519 (laptop)

## Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Server:** Nginx (reverse proxy, SSL termination, gzip, HTTP/2, HSTS)
- **Runtime:** Docker container (via docker-compose), NOT PM2
- **Next.js config:** `output: "standalone"` (REQUIRED by Docker build, do NOT remove)
- **RSS cron:** node-cron (every 15 minutes, runs inside Next.js process)
- **RSS parser:** rss-parser
- **Data storage:** Local JSON files in data/ directory (no database)
- **Data mounting:** `./data` is volume-mounted into the container at `/app/data` (changes to data/ on host are instant, no rebuild needed)
- **SSL:** Let's Encrypt via Certbot (auto-renewing)
- **DNS:** Managed by NetActuate (Mark handles DNS)
- **Theme:** Light default with dark mode toggle

## Auto-Deploy

GitHub webhook listener at `/home/ubuntu/deploy-listener.js` on port 9000, managed by PM2 as "deploy-hook". Push to master branch triggers:
1. `git fetch origin master && git reset --hard origin/master`
2. `docker compose up -d --build`

Logs to /home/ubuntu/deploy.log. Builds take ~3 minutes.

**CRITICAL:** PM2 only manages the deploy-hook listener. The app itself runs in Docker. Do NOT create a PM2 process for "vr-org". Do NOT remove `output: "standalone"` from next.config.ts. Both will break the deploy pipeline.

### Adding articles does NOT require a Docker rebuild
Since `./data` is volume-mounted, updating `data/articles.json` and pushing to git is enough. The `git reset --hard` in the deploy updates the host file, and the running container reads it immediately via the mount. The Docker rebuild that follows is for code changes only.

## Project Structure

```
vr-org/
  src/
    app/
      layout.tsx          # Root layout, fonts, theme, meta, AdSense, JSON-LD
      page.tsx             # Homepage feed
      globals.css          # CSS variables, light/dark themes
      about/page.tsx
      privacy/page.tsx
      hardware/page.tsx
      gaming/page.tsx
      software/page.tsx
      enterprise/page.tsx
      ar/page.tsx
      xr/page.tsx
      originals/page.tsx
      what-is-vr/page.tsx
      best-vr-headsets/page.tsx
      best-vr-games/page.tsx
      best-vr-games-2026/page.tsx
      best-vr-apps/page.tsx
      articles/[slug]/page.tsx   # Dynamic article pages
      api/
        feed/route.ts
        trending/route.ts
        sources/route.ts
        health/route.ts
      sitemap.xml/route.ts
      robots.txt (or route)
      ads.txt (public/)
    components/
      Header.tsx           # Logo, nav, live indicator, theme toggle
      Ticker.tsx           # Scrolling headline ticker
      FilterBar.tsx        # Category + company filter pills
      ArticleCard.tsx      # Individual article card
      Feed.tsx             # Feed column with cards + inline ads
      Sidebar.tsx          # Sources, NetActuate banner, widgets, trending, ads
      SourceStats.tsx
      TrendingTopics.tsx
      TopListWidget.tsx    # Top VR Games / Top VR Apps sidebar widgets
      SponsorBanner.tsx    # NetActuate banner (permanent)
      AdSlot.tsx
      ThemeToggle.tsx
      ThemeScript.tsx
      LoadingSkeleton.tsx
      Footer.tsx
      JsonLd.tsx           # Reusable JSON-LD structured data component
    hooks/
      useFeed.ts
      useTheme.ts
      useFilters.ts
    lib/
      constants.ts         # Source configs, colors, categories
      api.ts               # API client
      feed-service.ts      # RSS fetch, parse, categorize, cache
      cache.ts             # JSON file read/write
      init-cron.ts         # 15-min RSS cron scheduler
      top-lists.ts         # Top 10 games/apps data (or data/top-lists.json)
    types/
      index.ts
  data/                    # Runtime data, NOT in git, read dynamically
    feed.json              # Cached RSS articles
    trending.json          # Trending topics
    sources.json           # Source stats
    meta.json              # Feed metadata
    featured.json          # Auto-rotating featured articles (30-day cycle)
    articles.json          # VR.org Original editorial articles
  public/
    favicon.ico
    apple-touch-icon.png
    site.webmanifest
    og-image.png
    ads.txt                # Google AdSense authorization
    logo.png
  deploy.sh
```

## RSS Sources (11)

1. Road to VR - roadtovr.com/feed/
2. UploadVR - uploadvr.com/feed/
3. TechCrunch VR - techcrunch.com/tag/virtual-reality/feed/
4. XR Today - xrtoday.com/feed/
5. Mixed News - mixed-news.com/en/feed/
6. The Ghost Howls - skarredghost.com/feed/
7. Hypergrid Business - hypergridbusiness.com/feed/
8. Extended Reality News - extendedreality.news/feed/
9. The Verge (manual/filtered)
10. Ars Technica (manual/filtered)
11. VentureBeat (manual/filtered)

## Category Pages

| Route | Category | Key Topics |
|-------|----------|------------|
| /hardware | hardware | Headsets, controllers, displays, specs, teardowns |
| /gaming | gaming | Games, launches, trailers, studios, mods |
| /software | software | Platforms, SDKs, apps, social VR, tools |
| /enterprise | enterprise | Business, training, healthcare, investment |
| /ar | ar | AR glasses, spatial computing, overlays |
| /xr | xr | Extended reality, mixed reality, Android XR, WebXR |

## Featured Article System

- Each category page shows up to 3 VR.org Original articles pinned at top
- RSS featured articles auto-selected (one per source), rotate every 30 days
- Stored in data/featured.json, auto-fills empty slots every 15 minutes
- Original articles tagged across multiple categories auto-distribute to all matching pages
- Originals display with cyan "VR.org Original" badge

## Editorial Article System

- Articles stored in data/articles.json
- Dynamic route at /articles/[slug]
- Each article has: id, slug, title, author, authorRole, publishDate, category, tags, snippet, featured, body (HTML)
- Adding/editing articles: SSH into VPS, edit data/articles.json, no rebuild needed
- All articles must have full Article schema JSON-LD
- Author: "Evan Marcus", authorRole: "Co-Founder, VR.org"
- /originals page lists all editorial articles

## Pillar Pages

| Route | Topic | Priority |
|-------|-------|----------|
| /what-is-vr | What is Virtual Reality explainer | 0.85 |
| /best-vr-headsets | VR headset buyer's guide 2026 | 0.85 |
| /best-vr-games | Top 10 VR games of all time | 0.85 |
| /best-vr-games-2026 | Best VR games of 2026 | 0.85 |
| /best-vr-apps | Best VR apps and utilities | 0.85 |

## SEO Infrastructure

- JSON-LD: Organization, WebSite, CollectionPage (per category), Article (per article), BreadcrumbList
- Unique title + meta description on every page
- Canonical URLs on every page
- Open Graph + Twitter Card meta on every page
- Dynamic sitemap.xml (27+ URLs, auto-includes new articles)
- robots.txt allowing all crawlers
- Google Search Console verified
- Favicons + web app manifest
- ads.txt for AdSense (pub-7224757913262984)

## AdSense

- Publisher ID: pub-7224757913262984 (same account as TerminalFeed)
- ads.txt at /ads.txt
- Ad slots: sidebar (1 slot below trending), inline feed (every 6 articles)
- Currently in "Getting ready" status, pending approval
- AdSense script in layout.tsx head

## Sidebar Layout (top to bottom)

1. Sources card (with VR.org included)
2. NetActuate sponsor banner (permanent, links to netactuate.com)
3. Top VR Games 2026 widget (numbered list, links to /best-vr-games-2026)
4. Top VR Apps & Utilities widget (links to /best-vr-apps)
5. AdSense ad slot
6. Trending Topics card

## NetActuate Sponsor

- Permanent sidebar banner, not a rotating ad
- Links to https://netactuate.com
- Uses official NetActuate logo
- Dark theme logo: netactuate.com/docs/img/NA-White-Logo-H.png
- Tagline: "Global Edge Infrastructure" / "45+ locations worldwide"
- Mark Mahle is co-founder and owns the vr.org domain

## Performance & Security

- Nginx gzip compression (HTML, CSS, JS, JSON, XML)
- HTTP/2 enabled
- HSTS (Strict-Transport-Security)
- Security headers: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy
- Static asset caching: 1 year for /_next/static, 7 days for public assets
- www.vr.org redirects to vr.org (non-www canonical)

## Writing Rules (CRITICAL)

- **NO EM DASHES anywhere.** Never use -- or the em dash character. Use commas, periods, or restructure sentences instead. This is the #1 anti-AI-detection rule across all Pizza Robot Studios projects.
- Article body content stored as HTML in JSON (p tags, h2 tags)
- Vary article lengths. Not every article should be the same word count. Short takes: 400-600 words. Medium: 800-1,200 words. Long-form: 1,500-2,500 words. Match length to subject matter.
- Vary article structure. Not every article needs the same H2-H2-H2-H2 pattern. Some conversational, some list-driven, some flowing narrative.
- Distribute articles across the writing team by topic (see Editorial Writers below)
- Spread publish dates naturally. Never publish many articles on the same date.

## Data Files (read dynamically, no rebuild needed)

These files in data/ are read at request time, NOT at build time. Editing them on the VPS takes effect immediately without rebuilding:
- data/articles.json
- data/featured.json
- data/feed.json
- data/trending.json
- data/sources.json
- data/meta.json

If any code imports from data/ statically (like top-lists.ts in src/lib/), that DOES require a rebuild. Prefer JSON files in data/ over TypeScript files in src/lib/ for content that should update without rebuilds.

## Deploy Commands

### Auto-deploy (preferred)
Push to master branch on GitHub. Webhook auto-deploys via Docker (~3 min).

### Manual deploy (if needed)
```bash
ssh -i ~/.ssh/vr-org ubuntu@104.225.12.76
cd ~/vr-org
git fetch origin master && git reset --hard origin/master
docker compose up -d --build
```

### Quick deploy script
```bash
ssh -i ~/.ssh/vr-org ubuntu@104.225.12.76 "cd ~/vr-org && git fetch origin master && git reset --hard origin/master && docker compose up -d --build"
```

### Check status
```bash
ssh -i ~/.ssh/vr-org ubuntu@104.225.12.76 "docker ps && docker logs vr-org --tail 20 && tail -5 ~/deploy.log"
```

### Data-only changes (articles, featured, etc.)
No Docker rebuild needed. The data/ directory is volume-mounted.
```bash
ssh -i ~/.ssh/vr-org ubuntu@104.225.12.76 "cd ~/vr-org && git fetch origin master && git reset --hard origin/master"
```

## Adding a New Article (workflow)

1. Add article object to data/articles.json in the LOCAL REPO
2. New articles go at the TOP of the array (newest first in file order)
3. Set "featured": true to pin to category pages
4. Tag with relevant categories (article appears on all matching pages)
5. Add 2-4 inline images using `<figure>` tags in the body HTML (see Article Images below)
6. Commit and push. Deploy webhook syncs data/ via volume mount (no Docker rebuild needed for data-only changes, but the webhook rebuilds anyway)
7. The "From Our Editors" homepage section auto-shows the 4 newest articles by publishDate
8. Request indexing in Google Search Console for /articles/[slug]

**This is a 2-minute task: edit JSON, commit, push. Do not touch infrastructure, Docker, PM2, or next.config.ts when adding articles.**

## Article Images (REQUIRED for every article)

Every original article MUST include inline images. This is not optional. Images make articles visually appealing and are a core part of the editorial standard. Add 2-4 images per article minimum, more if the article covers multiple products/games (e.g., one image per item in a roundup). CSS styling lives in globals.css under `.article-body figure/img/figcaption`.

**Image format in article body HTML:**
```html
<figure><img src="URL" alt="Descriptive alt text" loading="lazy" /><figcaption>Image: Source / License</figcaption></figure>
```

**Preferred image sources (most stable to least):**
1. Wikimedia Commons (upload.wikimedia.org) - permanent, public domain or CC
2. Apple Newsroom (apple.com/newsroom/images/) - official press kit, long-lived
3. Google Storage (storage.googleapis.com/gweb-uniblog-publish-prod/) - official blog assets
4. Steam CDN (shared.akamai.steamstatic.com/store_item_assets/) - persists as long as game exists on Steam

**Rules:**
- Always use `loading="lazy"` on images
- Always include descriptive alt text for accessibility
- Always credit the source in figcaption
- Use press kit images, official promotional art, Wikimedia Commons, or self-captured screenshots
- Do not hotlink from social CDNs (Facebook, Instagram, Oculus CDN) as those URLs expire
- Place images after the first paragraph (hero image) and after key section H2s
- For games: use Steam store headers or gameplay screenshots
- For hardware: use Wikimedia Commons hardware photos or official press images
- For roundup/listicle articles: include one image per item, not just 2 random images
- YouTube thumbnails (img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg) are stable and good fallbacks
- Use `class="half-width"` on `<figure>` if an image is too large at full width
- Wrap image in `<a href="FULL_URL" target="_blank">` for click-to-enlarge when useful

## Adding a New Category Page (workflow)

1. Create src/app/[category]/page.tsx
2. Add category to constants.ts (CATEGORIES array)
3. Add nav link in Header.tsx
4. Add RSS keyword matching rules in categorizer
5. Add SEO meta (unique title + description)
6. Add JSON-LD CollectionPage schema
7. Add to sitemap
8. Deploy (requires rebuild)

## Social Links

- Twitter/X: @vrdotorg
- Instagram: @vrdotorg
- YouTube: youtube.com/channel/UCTKqC49lw-HF1NxlquRoc0Q
- Facebook: VRorg-760203404165583

## Team

- Evan Marcus (evan@vr.org) - Co-Founder, editorial, development
- Mark Mahle (mark@vr.org) - Co-Founder, infrastructure, domain owner
- Sandy (sandy@vr.org) - Team member

## Editorial Writers (pen names for VR.org contributors)

| Writer | Role | authorRole value | Focus Areas |
|--------|------|-----------------|-------------|
| Evan Marcus | Co-Founder | "Co-Founder, VR.org" | Gaming opinion, personal retrospectives, big news reactions (~50% of articles) |
| Alex Reeves | Staff Writer | "Staff Writer, VR.org" | Hardware, Meta/platform business news |
| Jordan Kuo | Staff Writer | "Staff Writer, VR.org" | AR, XR, Google/Android XR, developer ecosystem |
| Nina Castillo | Staff Writer | "Staff Writer, VR.org" | Software, WebXR, developer tools, open source |
| Sam Whitfield | Contributing Writer | "Contributing Writer, VR.org" | Enterprise, training, industry analysis, Apple |

When writing new articles, assign the author based on topic. Evan gets ~50%, the rest split across the staff writers by their focus areas. No @vr.org emails for staff writers.

## Contact Emails

- General: contact@vr.org
- Advertising: advertise@vr.org
- Press: press@vr.org

## Related Projects (Pizza Robot Studios)

This CLAUDE.md is specific to VR.org. See the global CLAUDE.md at ~/.claude/CLAUDE.md for Pizza Robot Studios defaults that apply across all projects (permissions, no em dashes rule, code style, stack preferences).

## NetActuate AI Provisioning

For future VPS needs, NetActuate repos include AGENTS.md files for AI-assisted provisioning. CC can deploy VMs and BGP clusters from plain English prompts. Key repos:
- netactuate-ansible-compute (VMs)
- netactuate-ansible-bgp-bird2 (anycast)
- netactuate-terraform-bgp
Docs: netactuate.com/docs/guides/ai-assisted-provisioning
Requires: API key + contract ID from NetActuate portal (Account > API Access)

## Editorial Rotation Schedule

VR.org publishes one original article per day, rotating writers by topic area. When Evan says "let's write today's article," check the day of the week and assign the appropriate writer.

### Weekly Schedule

| Day | Writer | Beat | Article Style |
|-----|--------|------|---------------|
| Monday | Jordan Kuo | AR, XR, spatial computing, Google, Android XR | Industry analysis, platform coverage, developer ecosystem. Medium length (800-1000 words). |
| Tuesday | Evan Marcus | Gaming, opinion, personal takes | Opinionated, personal voice, first-person perspective. Any length, tends longer on passion topics. |
| Wednesday | Nina Castillo | Software, WebXR, developer tools, open source | Technical but accessible, covers platforms and tools. Short to medium (500-900 words). |
| Thursday | Alex Reeves | Hardware, Meta/platform business, headset news | Factual with analysis, covers launches and business moves. Medium length (700-1000 words). |
| Friday | Sam Whitfield | Enterprise, training, industry reports, Apple | Business-focused, data-driven, covers enterprise adoption. Medium length (700-1000 words). |
| Saturday | Evan Marcus | Big features, retrospectives, deep dives | Long-form, in-depth, personal. These are the signature pieces. (1200-2500 words). |
| Sunday | Rotating (whoever fits the best story) | Best story of the weekend | Any writer, any length. Pick the most interesting weekend news and assign to the writer whose beat matches. |

### Writer Voice Guidelines

**Evan Marcus** — First person, opinionated, genuine enthusiasm. References personal gaming history. Uses "I" freely. Writes like a gamer talking to other gamers. The primary editorial voice of VR.org.

**Alex Reeves** — Straightforward, analytical. Focuses on facts and implications. Less personal, more "here's what happened and here's what it means." Occasionally dry humor.

**Jordan Kuo** — Tech-forward, developer-aware. Understands platforms and ecosystems. Writes about AR and XR with genuine knowledge of the developer side. Slightly more technical vocabulary.

**Nina Castillo** — Accessible technical writing. Makes complex software topics approachable. Enthusiastic about open source and developer tools. Explains things clearly without being condescending.

**Sam Whitfield** — Business-minded, data-aware. References market reports and industry trends. Writes for an audience that includes enterprise decision-makers. Professional but not stiff.

### Daily Article Workflow

1. Evan opens a conversation and says something like "let's write today's article" or "what should we cover today"
2. Claude checks the day of the week to determine the assigned writer
3. Claude searches for the latest VR/AR/XR news relevant to that writer's beat
4. Claude presents 2-3 topic options for Evan to choose from
5. Evan picks a topic (or suggests their own)
6. Claude writes the article in the assigned writer's voice
7. Claude outputs the article as a CC-ready spec with the JSON metadata and body content
8. Evan hands it to CC to add to data/articles.json and deploy

### Article Metadata Template

Every article follows this structure in data/articles.json:

```json
{
  "id": "slug-matching-the-title",
  "slug": "slug-matching-the-title",
  "title": "Article Title Here",
  "author": "Writer Name",
  "authorRole": "Role, VR.org",
  "publishDate": "YYYY-MM-DD",
  "updatedDate": null,
  "category": "primary-category",
  "tags": ["category1", "category2"],
  "snippet": "1-2 sentence summary for cards and SEO description.",
  "featured": true,
  "body": "<p>HTML content here</p>"
}
```

### Rules

- No em dashes in any article, ever
- Vary article lengths based on writer and topic (see schedule above)
- Vary structure (not every article needs the same H2 pattern)
- Spread topics across categories so no single category gets all the attention
- If a major story breaks that doesn't match the day's assigned writer, assign it to whoever's beat it falls under regardless of the schedule
- Evan can always override the schedule and write any article himself
- publishDate should always be the actual date the article is written
- Images should be sourced from Wikimedia Commons, Steam CDN, official press kits, or Google Storage (stable sources only)
