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

For each of the 3 calendar days before today, check whether `ai-brew-YYYY-MM-DD.md`
exists at the repo root and `Read` it if it does. Skip any missing date silently
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

Write the completed issue to `ai-brew-YYYY-MM-DD.md` at the repo root
(substitute today's actual date). This is now the only markdown copy — there
is no separate stockfilter folder to duplicate it into.

## STEP 7 — Write the HTML version

Write a polished HTML version to `index.html` at the repo root. This is the
public-facing website for stockfilter.app; overwrite it with today's content
every run.

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

SUBSCRIBE: Below the header block's horizontal rule, before the Snapshot card, a
light card (background #F8FAFC, border 1px solid #E2E8F0, border-radius 8px,
padding 16px 20px, margin 24px 0, flex layout wrapping on mobile) containing a
short line of text ("Get this in your inbox every morning.") next to a
Buttondown subscribe form. This block is fixed — reproduce it byte-for-byte
every run, do not regenerate or rephrase it:

```html
<div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:16px 20px; margin:24px 0; display:flex; flex-wrap:wrap; align-items:center; gap:12px; justify-content:space-between;">
  <div style="font-size:14px; color:#334155;">Get this in your inbox every morning.</div>
  <form action="https://buttondown.com/api/emails/embed-subscribe/navpreet" method="post" target="popupwindow" onsubmit="window.open('https://buttondown.com/navpreet', 'popupwindow')" style="display:flex; gap:8px; flex-wrap:wrap;">
    <input type="email" name="email" placeholder="you@example.com" required style="font-family:Georgia, serif; font-size:14px; padding:8px 12px; border:1px solid #E2E8F0; border-radius:6px; min-width:200px;">
    <input type="hidden" value="1" name="embed">
    <input type="submit" value="Subscribe" style="font-family:Georgia, serif; font-size:14px; font-weight:bold; padding:8px 16px; background:#0F172A; color:#FFFFFF; border:none; border-radius:6px; cursor:pointer;">
  </form>
</div>
```

The `action`/`onsubmit` URLs (including the Buttondown username) are fixed and
must not be altered.

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
`ai-brew-YYYY-MM-DD.md` (relative path, same directory). Pills:
display:inline-block, border-radius 20px, padding 4px 14px, 12px font,
margin 4px, text-decoration:none. Footer also shows small centered text:
"© 2026 The AI Brew · stockfilter.app" in #9CA3AF.

Generate all six archive dates dynamically from today's actual date. Do not
hardcode specific past dates. It's fine if some of those dates' `.md` files
don't exist yet (early in the archive's life) — link to them anyway per the
naming convention.

## STEP 8 — Commit and push

From the repo root, run:

```
git config user.name "AI Brew Bot"
git config user.email "actions@users.noreply.github.com"
git add ai-brew-*.md index.html
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

## STEP 9 — Send today's issue via Buttondown

Send today's issue to subscribers by creating an email through Buttondown's
API. As of API version 2026-04-01 (the current default for new keys), POST
requests to `/v1/emails` create a **draft** unless `status` is explicitly set
— so the request must set `"status": "about_to_send"` to send immediately,
and the first-ever send from a given API key must also include the
`X-Buttondown-Live-Dangerously: true` header (a one-time "yes, I know what
I'm doing" confirmation; harmless to include on every run).

```
curl -s -X POST https://api.buttondown.com/v1/emails \
  -H "Authorization: Token $BUTTONDOWN_API_KEY" \
  -H "Content-Type: application/json" \
  -H "X-Buttondown-Live-Dangerously: true" \
  -d '{"subject": "<today'"'"'s headline>", "body": "<today'"'"'s markdown content>", "status": "about_to_send"}'
```

`$BUTTONDOWN_API_KEY` is available in the environment. `body` accepts
Markdown by default — pass the content of today's `ai-brew-YYYY-MM-DD.md`
as-is (escaped for JSON). If the response body doesn't show the email
transitioning out of `draft`/`about_to_send` as expected, check Buttondown's
current API docs before assuming the send worked.

This step should not block or fail the run: the site (STEP 8) has already
published successfully by this point, and a missed email is recoverable
(resend manually) while a missed site publish is not. If the API call fails,
print the exact error to the job log and continue to STEP 10 rather than
exiting non-zero.

## STEP 10 — Summarize

Print a short final summary to the job log: today's date, the top story
headline, confirmation that the commit was pushed (with the commit SHA), and
whether the Buttondown send succeeded.
