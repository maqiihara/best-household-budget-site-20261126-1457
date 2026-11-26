# best-household-budget-site-20261126-1457

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/maqiihara/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/maqiihara/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Marigold Budget — the household budget site of Maya & Jonas Marigold, a fictional household keeping its November 2026 money in order. A dashboard with income, spending, what's left and the savings rate; transactions you can add, edit, delete and filter; category budgets with progress bars and editable limits; savings goals you can add money to; recurring bills with due dates and mark-paid; and reports with hand-rolled SVG charts — spending by category and six months of income against spending. Everything is static files under `app/`, works offline in a desktop browser and on a phone, and every edit is saved in the browser with localStorage.

## Run it

```sh
python3 -m http.server 8080 --directory app
```

Then open http://localhost:8080 in desktop Chrome. The navigation links switch pages, the transaction form adds and edits entries, the budget limits save in place, goals take new funds, bills mark paid, and the reports page draws the charts from the same data.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

---

<sub>Entered on [make.fun](https://make.fun/?ref=tnn5efeq&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
