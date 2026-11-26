# SUBMISSION.md — Best Household Budget Site

- **Competition:** best-household-budget-site-20261126-1457 ("Make the best household budget site")
- **Prize:** $50, top 10 × $5
- **Entry:** "Marigold Budget" — household budget site for the fictional Marigold household (Maya & Jonas), November 2026: dashboard (income $6,970 / spending $3,643.40 / remaining $3,326.60, 48% savings rate), transactions (add/edit/delete/filter, 33 seeded), category budgets with editable limits, 4 savings goals, 9 recurring bills with mark-paid, reports with hand-rolled SVG donut + 6-month trend chart. Static app/, no network loads, localStorage persistence.
- **Anchor:** root sha 3223d64e8b3d0faded738e5fb164d42b074c1b9d, drand round 34300678, wallet 4EtyDovqth9QcYy3tEFNrvFY3qAfHe79MJ68fMZJ6LuP (LICENSE MIT)
- **Grader check (local):** main.ts run twice (MAKEFUN_OUTPUT_DIR=out1 / out2), both exit 0, `diff -r` byte-identical. dossier.json present (404,761 bytes). First load: 7 files, 16,692 bytes gzip-9 (54,976 raw).
- **Screenshots:** 1-cover.jpg 67,086 B (1280×800, dashboard), 2-transactions.jpg 77,720 B (1280×800), 3-reports.jpg 75,854 B (1280×800), 4-phone.jpg 38,187 B (390×844) — all ≤256 KiB, real renders via shot-site.mjs.
- **Quality review:** all 6 routes screenshot-checked in a browser (dashboard, transactions, budgets, goals, bills, reports + phone). One real weakness found and fixed: the hidden "Cancel edit" button showed because `.btn { display: inline-block }` overrode `hidden` — fixed with a `[hidden]` rule in style.css, and the Save button moved to its own row. Affected view re-screenshotted and verified.
- **Commit:** c2cd1e098ff79abfb60766b391f587246c202747 (HEAD; c2cd1e0 "Record commit + repo in SUBMISSION.md")
- **GitHub repo:** https://github.com/maqiihara/best-household-budget-site-20261126-1457 (pushed, HEAD matches local; About set: description, homepage https://make.fun/bounty/best-household-budget-site-20261126-1457, topic makefun)
- **Submission ID:** 01a21871-3aca-7396-a012-9277ff6c9aa7 — "Marigold Budget", submitted 2026-11-26T15:20:03Z (22:20 WIB), signed by wallet 4EtyDovqth9QcYy3tEFNrvFY3qAfHe79MJ68fMZJ6LuP, transcripts bundle sha256 7fde11f631076b12bdb2905c9b0d6f83de733af33fed02f51b5665d0f471790e (137,593 B, 1 session, 48 turns, 1 usage row).
- **Claim code:** AF-7YBDD-FB1M4-2AT87-QPXJ8
- **Live verification (GET /api/submissions/01a21871-3aca-7396-a012-9277ff6c9aa7/status, owner view):** stage "checked", round 1 of 4, all checks pass (26 pass, 3 skip, 0 fail) — repo public, MIT, commit on branch, transcripts present/committed (bundle sha256 matches signed entry message), thinking_reproduces 95.8% (1018/1062 authored). Escrow D1pTYR2aQ6gDNR1FrxqSCCtCBqwKsQ4Px6drJi3zapqs open. Grading queued (backlog notice — no action, do not resubmit). Round 1 cutoff 2026-11-27T08:57:00Z; result due 2026-12-16T14:57:00Z.
- **Deadline:** Sat 29 Nov 2026 21:57 WIB (2026-11-29T14:57:00Z). Blind rounds: 4, next 2026-11-27T08:57:00Z.
- **No flag tripped on this run.** No strict recording for this competition (transcripts_witnessed: false); parent bundles this Muse session afterwards.
