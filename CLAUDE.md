# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Not a software project — it's the content store and publishing pipeline for "The AI Brew," a
daily AI-news newsletter. There is no build system and no tests. The `package.json` that exists
only pins the `wrangler` CLI version for deploy (see Stage 2 below) — it is not an application.
The entire "application" is a GitHub Actions workflow that invokes Claude Code itself to
research, write, and publish each day's issue.

## How publishing works (two stages)

**Stage 1 — content generation (GitHub Actions).** `.github/workflows/daily-ai-brew.yml` runs on
a schedule (07:00 IST / 01:30 UTC daily, plus manual `workflow_dispatch`) on `ubuntu-latest`. It
checks out the repo and runs `anthropics/claude-code-action@v1` with a prompt that tells Claude
Code to follow `.github/ai-brew-task-prompt.md` step by step, autonomously, and push the result
to `main`. Auth is via `CLAUDE_CODE_OAUTH_TOKEN` (a Pro/Max subscription token from
`claude setup-token`), not a metered API key. Allowed tools for that run:
`WebSearch,Bash,Read,Write,Edit,Glob,Grep`.

**Stage 2 — site deploy (Cloudflare Workers Build).** The `main` branch is Git-connected to a
Cloudflare Workers project named `daily-ai-brew`. Every push (including the automated commit from
Stage 1) triggers a Cloudflare build that runs `npx wrangler deploy`, which publishes the repo
root as static assets (per `wrangler.jsonc`'s `assets.directory: "."`) to stockfilter.app. This
deploy is config-driven: `wrangler.jsonc` and the pinned `wrangler` version in `package.json`
exist specifically so the deploy targets the existing `daily-ai-brew` Worker deterministically —
without a committed config file, `wrangler deploy` falls back to its "autoconfig" flow (regenerate
config from scratch every run), which cannot prove ownership of an already-existing Worker of the
same name and aborts the deploy as a safety measure. Do not delete `wrangler.jsonc` or unpin
`wrangler` in `package.json` without understanding this failure mode.

Because `package.json` exists, Cloudflare's build system auto-runs a package install (`bun
install`), which creates `node_modules` inside the repo root before the deploy command runs.
Since `assets.directory` is `"."`, Wrangler would otherwise try to upload `node_modules`
(including its own ~120 MB `workerd` binary) as public site assets and fail with "Asset too
large" (Workers caps individual asset files at 25 MiB). `.assetsignore` (same syntax as
`.gitignore`) excludes `node_modules/`, `package.json`, lockfiles, `wrangler.jsonc`, and repo
tooling files from the asset upload — keep it in sync if new non-content tooling files are added
to the repo root.

If you are invoked as that workflow's agent (or asked to manually produce a day's issue), the
full operational spec is `.github/ai-brew-task-prompt.md` — read it in full and follow every
step in order:

1. Read the style/voice spec at `ai-brew-newsletter-prompt.md` (this is the "constitution" —
   see below).
2. Get today's UTC date (`date -u +%Y-%m-%d`).
3. Read recent context: `Read` each of the last 3 days' `archive/ai-brew-YYYY-MM-DD.md` files
   that exist (skip missing dates silently) to catch developing storylines and avoid re-reporting
   already-resolved stories. See STORYLINE CONTINUITY in `ai-brew-newsletter-prompt.md`.
4. Use `WebSearch` to find real AI news from the last 24 hours only, spanning models/products,
   funding, chips/hardware, and policy/geopolitics. Never fabricate figures, quotes, or events;
   hedge unconfirmed claims ("reportedly", "claims"). Attribute every story to its source.
5. Write the issue following the fixed structure (see below), weaving in any storyline
   continuity from step 3 naturally — no explicit "Day 3 of..." labels.
6. Save markdown to `archive/ai-brew-YYYY-MM-DD.md`.
7. Write/overwrite `index.html` at repo root — a single self-contained HTML file (no external
   CSS/JS/fonts) that is the live public page for stockfilter.app, styled per the detailed spec
   in `ai-brew-task-prompt.md` (colors, spacing, section markup all specified exactly there).
   The archive footer must link to the current date + 5 preceding calendar dates, generated
   dynamically — never hardcode past dates.
8. Commit (`git add archive/ai-brew-*.md index.html`) and push directly to `main`. Skip the commit only
   if nothing is staged. If the push fails, surface the exact git error and exit non-zero —
   there's no human present to fix it mid-run.
9. Print a short summary (date, top headline, commit SHA) to the job log.

## The two prompt files — different jobs, keep them separate

- **`ai-brew-newsletter-prompt.md`** — the voice/content constitution. Defines the emotional
  target (caught up, smarter-with-a-take, entertained, respected, calm, a little inside), the
  Morning-Brew-style voice rules, the coverage mandate (serve students/professionals/investors/
  startups/policy readers *without* labeling sections by audience), accuracy/sourcing rules, and
  the required section order. This is reusable outside GitHub Actions too (it's written as a
  copy-paste prompt template with `{{DATE}}` / `{{NEWSLETTER_NAME}}` / `{{SOURCES}}`
  placeholders).
- **`.github/ai-brew-task-prompt.md`** — the mechanical operational spec for the automated CI
  run: file paths, exact HTML styling (colors, px values, layout), git commands, and the
  step-by-step sequence above. Assumes the newsletter-prompt spec has already been read.

When editing either, keep concerns separated: content/voice rules belong in
`ai-brew-newsletter-prompt.md`; file layout, HTML markup/CSS, and git mechanics belong in
`.github/ai-brew-task-prompt.md`.

## Content structure (every issue, both `.md` and `.html`)

Header line → **The Snapshot** (4-6 number+quip signals plus one mood line) → Editor's Open →
3-4 **Lead Stories** (punny subhead, 90-160 words, bolded "Bottom line:") → **Quick Hits**
(5-7 one-line emoji items) → **The Big Picture** (zoom-out take) → **One More Thing** (light
closer) → **Sources** (numbered links). The `.md` and `.html` versions carry identical content;
`.html` additionally has fixed inline styling and an archive-pill footer.

## File conventions

- Daily issues: `archive/ai-brew-YYYY-MM-DD.md` — one per day, never overwritten, never deleted.
  `index.html` is the only file that gets overwritten each run (always reflects *today's* issue).
- Commit messages for daily runs follow the pattern `Daily AI Brew YYYY-MM-DD`.
