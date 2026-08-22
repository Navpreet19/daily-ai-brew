# AI Brew — Daily Publishing Task (GitHub Actions version)

This is the operational spec for the daily GitHub Actions run of "The AI Brew."
It replaces the old Claude Cowork scheduled task. You are running inside a
fresh checkout of the `daily-ai-brew` repo on a GitHub-hosted runner, with
`Bash`, `Read`, `Write`, `Edit`, `Glob`, `Grep`, and `WebSearch` available.
Work entirely within this repository's root directory (no other folders
exist on this machine, and there is no local "stockfilter" copy anymore —
this repo is the only place the newsletter lives).

## STEP 1 — Read the style spec

Open and follow the full prompt saved at `ai-brew-newsletter-prompt.md`
(repo root). That file defines the required FEELING (caught up,
smarter-with-a-take, entertained, respected, calm, a little inside), the
voice, the accuracy rules, and the structure. Follow it exactly.

## STEP 2 — Determine today's date

Run `date -u +%Y-%m-%d` (or equivalent) to get today's date. The workflow is
scheduled for 07:00 IST, which is 01:30 UTC the same calendar day, so the UTC
date matches the intended issue date.

## STEP 3 — Read recent context

For each of the 3 calendar days before today, check whether `archive/ai-brew-YYYY-MM-DD.md`
exists and `Read` it if it does. Skip any missing date silently
(e.g. early in the archive's life, or a day the workflow didn't run) — do not treat
a missing file as an error. From whatever you read, note:

- Storylines still in motion (an unresolved funding round, an ongoing policy
  fight, a "part 2" product rollout, a running bit) that today's news might
  continue.
- Stories that are already fully covered and resolved, so you don't report them
  again as if new.

Carry this forward into STEP 5 per the continuity guidance in
`ai-brew-newsletter-prompt.md`.

## STEP 4 — Pull the news

Use the `WebSearch` tool to find REAL artificial-intelligence news from the
last 24 hours, spanning: new models/products, funding & valuations,
chips/hardware, and policy/geopolitics — so the slate naturally serves
students, professionals, investors, startups, and nations. Do NOT add
per-audience tags or sections; weave relevance into the writing. Verify
recency and accuracy. Never fabricate figures, quotes, dates, or events;
separate fact from spin (say "claims"/"reportedly" when unconfirmed). If
you're unsure a story is real and from the last ~24 hours, leave it out.
Attribute each story to its source.

## STEP 5 — Write the complete issue

Follow the spec's structure: a witty header line → "The Snapshot" (a compact
data box of 4–6 signals, each a number + a quip, then a one-line mood) → a
short witty editor's open → 3–4 lead stories, each with a punny subhead and
ending in a bold "Bottom line:" → emoji "Quick Hits" (5–7 one-liners) →
"The Big Picture" zoom-out → a light "One More Thing" closer → a "Sources"
list with links. Keep it to roughly a 5-minute read. Match the FEELING above
all else. Use the context gathered in STEP 3 per the STORYLINE CONTINUITY
guidance in `ai-brew-newsletter-prompt.md`: don't re-report a resolved story
as new, and weave any developing storyline in naturally, the way a beat
reporter would — no "Day 3 of..." or "Following up:" labels.

## STEP 6 — Save the markdown issue

Write the completed issue to `archive/ai-brew-YYYY-MM-DD.md` (substitute
today's actual date; create the `archive/` directory if it doesn't already
exist, though it should). This is now the only markdown copy — there is no
separate stockfilter folder to duplicate it into.

## STEP 7 — Write the HTML version

Write a polished HTML version, then save the exact same content to two
places: `index.html` at the repo root (this is the public-facing website for
stockfilter.app; overwrite it with today's content every run) and
`archive/ai-brew-YYYY-MM-DD.html` (today's permanent snapshot — like the
`.md` file, this one is never overwritten once written). Build the HTML once
and write it to both paths unchanged — do not vary the content between them.

DESIGN: Single self-contained HTML file, no external CSS or JS, no fonts from
Google Fonts (use system stacks). Mobile-responsive, max-width 680px
centered. Body font: Georgia, serif. Background: #FAFAF8. Text: #1a1a1a.

TOPBAR: Full-width dark navy (#0F172A) strip, 14px centered text in #94A3B8,
content: "☕ The AI Brew · stockfilter.app"

HEADER BLOCK: Below topbar, white background, padding 32px 24px 24px. Small
eyebrow label showing the date (e.g. "SATURDAY, JUNE 28, 2026") in 11px
uppercase letter-spaced #6B7280. Then the issue tagline as an h1 in 28px bold
#0F172A. Below the h1, a small "Updated" timestamp line in 12px #9CA3AF (not
uppercase) reading "Updated <today's date>, HH:MM UTC" — use the actual UTC
time the run executes STEP 7 (i.e. run `date -u +"%H:%M"` alongside the date
lookup in STEP 2; do not hardcode 01:30, since manual `workflow_dispatch`
runs can happen at other times). Below that, a subtle horizontal rule.

SNAPSHOT CARD: Dark navy (#0F172A) background card with 20px padding,
border-radius 8px, margin-bottom 24px. White heading "The Snapshot" in 13px
uppercase. Each signal on its own line: bold white metric, then colored quip
in #94A3B8. End with a single italic #64748B mood line, border-top
separating it from the signals.

LEAD STORIES: Each has an h2 in 20px #0F172A, body paragraphs in 16px/1.7
line-height. Bottom line callout: a div with left border 3px solid #0F172A,
background #F1F5F9, padding 12px 16px, the text "Bottom line:" in bold
followed by the callout text.

QUICK HITS: Section heading "Quick Hits" in 13px uppercase #6B7280, then an
unstyled ul with each emoji item as a plain li (no bullets), 14px, line-height
1.8.

BIG PICTURE: Light gray (#F8FAFC) card, border 1px solid #E2E8F0,
border-radius 8px, padding 20px 24px. Heading "The Big Picture" in 13px
uppercase. Body text in 15px italic.

ONE MORE THING: Heading "One More Thing" 13px uppercase, body paragraph in
15px, border-top separating from above.

SOURCES: Heading "Sources" 13px uppercase #6B7280. List of numbered links
styled in 13px #4B5563 with href attributes matching the source URLs. Each
link: color #0F172A, no underline on rest, underline on hover (use inline
style).

ARCHIVE FOOTER: Centered pill links for the current date (bold, dark navy
background, white text) plus the 5 preceding calendar dates (light gray
background, dark text). Each pill is an `<a>` tag linking to
`/archive/ai-brew-YYYY-MM-DD.html` — an absolute, root-relative path (leading
slash), not a relative one. This matters because the exact same HTML is
saved to two different directories in STEP 7 (repo root and `archive/`); an
absolute path resolves identically from either location, whereas a relative
path would only work from one of them. Pills: display:inline-block,
border-radius 20px, padding 4px 14px, 12px font, margin 4px,
text-decoration:none. Footer also shows small centered text: "© 2026 The AI
Brew · stockfilter.app" in #9CA3AF.

Generate all six archive dates dynamically from today's actual date. Do not
hardcode specific past dates. For each of the 5 preceding dates, check
whether `archive/ai-brew-YYYY-MM-DD.html` exists (e.g. `ls archive/`) — if it
does, link to it; if only the `.md` file exists (pre-2026-08-22 dates that
predate the HTML-archive convention), link to
`/archive/ai-brew-YYYY-MM-DD.md` instead. It's fine if neither file exists
yet for a date (early in the archive's life) — link to the `.html` path
anyway per the naming convention, since today's run onward always produces
one.

## STEP 8 — Commit and push

From the repo root, run:

```
git config user.name "AI Brew Bot"
git config user.email "actions@users.noreply.github.com"
git add archive/ai-brew-*.md archive/ai-brew-*.html index.html
git commit -m "Daily AI Brew <today's date>"
git push origin main
```

(Substitute today's actual date in the commit message. Skip the commit only
if `git diff --cached --quiet` shows nothing staged — but there should always
be at least the new day's markdown file.) The runner's checkout already has
push credentials via the default `GITHUB_TOKEN` (repo permissions are set to
`contents: write` in the workflow), so this should push directly to `main`
without further authentication setup. If the push fails, print the exact
git error to the job log and exit non-zero so the run shows as failed in the
Actions tab — there's no one to relay a chat message to today.

## STEP 9 — Summarize

Print a short final summary to the job log: today's date, the top story
headline, and confirmation that the commit was pushed (with the commit SHA).
