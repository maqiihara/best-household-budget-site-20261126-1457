// Page renderers for the Marigold budget site.
//
// One function per hash route. Each returns the page's HTML; main.js
// injects it into #page and calls bindPage() once, which wires every
// control on the page through a single delegated listener so no inline
// handlers are needed. All figures come from the store, so an edit on
// any page shows up everywhere on the next render.

import { CATEGORIES, INCOME_CATEGORIES, TIPS } from "./data.js";
import { donutChart, miniBar, trendChart } from "./charts.js";
import { esc, money, money0, pct, shortDate, store } from "./store.js";

function categoryOptions(selected) {
  return CATEGORIES.map(
    (c) => `<option value="${c.id}"${c.id === selected ? " selected" : ""}>${c.label}</option>`,
  ).join("");
}

function incomeOptions(selected) {
  return INCOME_CATEGORIES.map(
    (c) => `<option value="${c.id}"${c.id === selected ? " selected" : ""}>${c.label}</option>`,
  ).join("");
}

function progressBar(p, color) {
  const clamped = Math.min(1, Math.max(0, p));
  const over = p > 1 ? " over" : "";
  return `<div class="bar" role="progressbar" aria-valuenow="${Math.round(p * 100)}" aria-valuemin="0" aria-valuemax="100"><span class="bar-fill${over}" style="width:${Math.round(clamped * 100)}%;background:${color}"></span></div>`;
}

function txRow(t, withActions = true) {
  const cat = store.category(t.category);
  const sign = t.kind === "income" ? "+" : "−";
  const cls = t.kind === "income" ? "amt-in" : "amt-out";
  const actions = withActions
    ? `<td class="row-actions">
      <button type="button" class="btn btn-small" data-action="edit-tx" data-id="${t.id}">Edit</button>
      <button type="button" class="btn btn-small btn-danger" data-action="delete-tx" data-id="${t.id}">Delete</button>
    </td>`
    : "";
  return `<tr>
    <td>${shortDate(t.date)}</td>
    <td>${esc(t.note)}</td>
    <td><span class="chip" style="--chip:${cat.color}">${cat.label}</span></td>
    <td class="num ${cls}">${sign}${money(t.amount)}</td>
    ${actions}
  </tr>`;
}

// --- Dashboard ---------------------------------------------------------

export function renderDashboard() {
  const t = store.totals();
  const spent = store.spentByCategory();
  const topCats = Object.entries(spent)
    .map(([id, v]) => ({ ...store.category(id), value: v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const maxTop = topCats.length ? topCats[0].value : 1;
  const bills = store.upcomingBills();
  const goals = store.state.goals;
  const recent = [...store.state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 7);
  const slices = Object.entries(spent).map(([id, v]) => ({ ...store.category(id), value: v }));

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${esc(store.state.household.month)} · ${esc(store.state.household.members)}</p>
      <h1>November is on track.</h1>
      <p class="lede">You have <strong>${money(t.remaining)}</strong> left after spending
      ${money(t.spending)} of ${money(t.income)} income — a ${pct(t.savingsRate)} savings rate.
      ${money(store.upcomingBillsTotal())} of bills are still due this month.</p>
    </div>
    <div class="hero-chart">${donutChart(slices, t.spending)}
      <p class="chart-caption">Where November's money went</p></div>
  </section>

  <section class="cards" aria-label="Month overview">
    <article class="card stat"><p class="stat-label">Income</p><p class="stat-value in">${money(t.income)}</p><p class="stat-note">${esc(store.state.household.paydayNote)}</p></article>
    <article class="card stat"><p class="stat-label">Spending</p><p class="stat-value out">${money(t.spending)}</p><p class="stat-note">${money(t.budgetTotal)} budgeted · ${money(t.budgetLeft)} left to spend</p></article>
    <article class="card stat"><p class="stat-label">Remaining</p><p class="stat-value">${money(t.remaining)}</p><p class="stat-note">${pct(t.savingsRate)} savings rate this month</p></article>
    <article class="card stat"><p class="stat-label">Bills still due</p><p class="stat-value">${money(store.upcomingBillsTotal())}</p><p class="stat-note">${bills.length} bill${bills.length === 1 ? "" : "s"} left · next: ${bills.length ? esc(bills[0].name) + " on the " + bills[0].day + "th" : "none"}</p></article>
  </section>

  <div class="grid-2">
    <section class="card">
      <h2>Biggest spending</h2>
      <ul class="top-list">${topCats.map((c) => `<li><span class="top-name">${c.icon} ${c.label}</span>${miniBar(c.value, maxTop, c.color)}<span class="num">${money(c.value)}</span></li>`).join("")}</ul>
      <p><a class="btn" href="#/reports">See the full breakdown →</a></p>
    </section>

    <section class="card">
      <h2>Coming up</h2>
      <ul class="bill-list">${bills.slice(0, 4).map((b) => `<li><span><strong>${esc(b.name)}</strong> · due ${b.day} Nov</span><span class="num">${money(b.amount)}</span> <button type="button" class="btn btn-small" data-action="pay-bill" data-id="${b.id}">Mark paid</button></li>`).join("") || "<li>Nothing due — every bill is paid.</li>"}</ul>
      <p><a class="btn" href="#/bills">All recurring bills →</a></p>
    </section>
  </div>

  <div class="grid-2">
    <section class="card">
      <h2>Recent transactions</h2>
      <table class="tx-table"><tbody>${recent.map((t) => txRow(t, false)).join("")}</tbody></table>
      <p><a class="btn" href="#/transactions">All transactions →</a></p>
    </section>

    <section class="card">
      <h2>Savings goals</h2>
      <ul class="goal-list">${goals.map((g) => `<li><div class="goal-head"><strong>${esc(g.name)}</strong><span>${money(g.saved)} of ${money(g.target)}</span></div>${progressBar(g.saved / g.target, "#2f6f5e")}<p class="muted">${pct(g.saved / g.target)} there · ${money(g.target - g.saved)} to go</p></li>`).join("")}</ul>
      <p><a class="btn" href="#/goals">Manage goals →</a></p>
      <h2 class="tips-head">Three things worth knowing</h2>
      <ul class="tips">${TIPS.map((tip) => `<li>${esc(tip)}</li>`).join("")}</ul>
    </section>
  </div>`;
}

// --- Transactions ------------------------------------------------------

export function renderTransactions(filter) {
  const f = filter || { kind: "all", category: "all", q: "" };
  let txs = [...store.state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (f.kind !== "all") txs = txs.filter((t) => t.kind === f.kind);
  if (f.category !== "all") txs = txs.filter((t) => t.category === f.category);
  if (f.q) {
    const q = f.q.toLowerCase();
    txs = txs.filter((t) => t.note.toLowerCase().includes(q));
  }
  const shownSpent = txs.filter((t) => t.kind === "expense").reduce((s, t) => s + t.amount, 0);
  const shownIncome = txs.filter((t) => t.kind === "income").reduce((s, t) => s + t.amount, 0);

  return `
  <header class="page-head"><div><h1>Transactions</h1><p class="lede">Every dollar in and out for November 2026. Add, edit or delete — the dashboard, budgets and charts update at once.</p></div></header>

  <section class="card">
    <h2>Add a transaction</h2>
    <form id="tx-form" class="form-grid">
      <input type="hidden" name="id" value="">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>Kind
        <select name="kind" id="tx-kind">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select></label>
      <label>Category <select name="category" id="tx-category">${categoryOptions("groceries")}</select></label>
      <label>Note <input type="text" name="note" placeholder="What was it for?" maxlength="80" required></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Save transaction</button>
      <button type="button" class="btn" id="tx-cancel" hidden>Cancel edit</button></div>
    </form>
    <p class="muted" id="tx-form-hint">Tip: pick “Income” and the category list switches to salary, freelance and other income.</p>
  </section>

  <section class="card">
    <form id="tx-filter" class="filter-row">
      <label>Show
        <select name="kind">
          <option value="all"${f.kind === "all" ? " selected" : ""}>All</option>
          <option value="expense"${f.kind === "expense" ? " selected" : ""}>Expenses</option>
          <option value="income"${f.kind === "income" ? " selected" : ""}>Income</option>
        </select></label>
      <label>Category
        <select name="category">
          <option value="all">All categories</option>
          ${categoryOptions(f.category === "all" ? "" : f.category)}
        </select></label>
      <label>Search <input type="search" name="q" value="${esc(f.q)}" placeholder="e.g. GreenMart"></label>
      <button type="submit" class="btn">Filter</button>
    </form>
    <p class="muted">${txs.length} shown · ${money(shownIncome)} in · ${money(shownSpent)} out</p>
    <div class="table-wrap"><table class="tx-table">
      <thead><tr><th>Date</th><th>Note</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${txs.map(txRow).join("") || `<tr><td colspan="5">No transactions match — try clearing the filter.</td></tr>`}</tbody>
    </table></div>
  </section>`;
}

// --- Budgets -----------------------------------------------------------

export function renderBudgets() {
  const rows = store.budgetRows();
  const t = store.totals();
  return `
  <header class="page-head"><div><h1>Budgets</h1><p class="lede">November limits by category. ${money(t.spending)} spent of ${money(t.budgetTotal)} budgeted — ${money(t.budgetLeft)} still in the envelope.</p></div></header>
  <section class="card">
    <ul class="budget-list">
      ${rows.map((r) => `<li class="budget-row">
        <div class="budget-head"><span><span class="dot" style="background:${r.color}"></span> <strong>${r.label}</strong></span>
        <span class="num">${money(r.spent)} of ${money(r.limit)}</span></div>
        ${progressBar(r.pct, r.color)}
        <div class="budget-foot"><span class="${r.left < 0 ? "over-text" : "muted"}">${r.left < 0 ? money(-r.left) + " over budget" : money(r.left) + " left · " + pct(r.pct) + " used"}</span>
        <form class="limit-form" data-category="${r.category}"><label>Monthly limit $ <input type="number" name="limit" min="0" step="5" value="${r.limit}" required></label><button type="submit" class="btn btn-small">Save limit</button></form></div>
      </li>`).join("")}
    </ul>
  </section>
  <section class="card">
    <h2>How the Marigolds set limits</h2>
    <p>Limits come from the last three months' average spending, rounded up a little for groceries and down a little for dining out. Housing is rent plus insurance; subscriptions are checked every quarter and anything unused gets cancelled. Change a limit above and the dashboard's “left to spend” updates immediately.</p>
  </section>`;
}

// --- Goals -------------------------------------------------------------

export function renderGoals() {
  const goals = store.state.goals;
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  return `
  <header class="page-head"><div><h1>Savings goals</h1><p class="lede">${money(totalSaved)} saved toward ${money(totalTarget)} of goals. Add money whenever there's room — even $25 moves a goal.</p></div></header>
  <section class="goals-grid">
    ${goals.map((g) => `<article class="card goal-card">
      <h2>${esc(g.name)}</h2>
      <p class="goal-big">${money(g.saved)} <span class="muted">of ${money(g.target)}</span></p>
      ${progressBar(g.saved / g.target, "#2f6f5e")}
      <p>${esc(g.note)}</p>
      <p class="muted">${pct(g.saved / g.target)} there · ${money(g.target - g.saved)} to go</p>
      <form class="add-funds" data-goal="${g.id}"><label>Add $ <input type="number" name="amount" min="1" step="1" placeholder="50" required></label><button type="submit" class="btn btn-small btn-primary">Add funds</button></form>
      <button type="button" class="btn btn-small btn-danger" data-action="delete-goal" data-id="${g.id}">Remove goal</button>
    </article>`).join("")}
  </section>
  <section class="card">
    <h2>Start a new goal</h2>
    <form id="goal-form" class="form-grid">
      <label>Goal name <input type="text" name="name" placeholder="e.g. New bikes" maxlength="60" required></label>
      <label>Target ($) <input type="number" name="target" min="1" step="10" placeholder="500" required></label>
      <label>Why it matters <input type="text" name="note" placeholder="One line about this goal" maxlength="120"></label>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Create goal</button></div>
    </form>
  </section>`;
}

// --- Bills -------------------------------------------------------------

export function renderBills() {
  const bills = [...store.state.bills].sort((a, b) => a.day - b.day);
  const due = store.upcomingBillsTotal();
  const paid = bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  return `
  <header class="page-head"><div><h1>Recurring bills</h1><p class="lede">The fixed costs that repeat every month. ${money(due)} still due in November; ${money(paid)} already paid.</p></div></header>
  <section class="card">
    <ul class="bill-list big">
      ${bills.map((b) => `<li class="${b.paid ? "paid" : ""}"><span><strong>${esc(b.name)}</strong> · ${store.category(b.category).label} · due ${b.day} Nov</span>
      <span class="num">${money(b.amount)}</span>
      <span class="bill-state">${b.paid ? "Paid ✓" : "Due"}</span>
      <button type="button" class="btn btn-small" data-action="pay-bill" data-id="${b.id}">${b.paid ? "Undo" : "Mark paid"}</button>
      <button type="button" class="btn btn-small btn-danger" data-action="delete-bill" data-id="${b.id}">Delete</button></li>`).join("")}
    </ul>
  </section>
  <section class="card">
    <h2>Add a recurring bill</h2>
    <form id="bill-form" class="form-grid">
      <label>Bill name <input type="text" name="name" placeholder="e.g. Water" maxlength="60" required></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Day of month <input type="number" name="day" min="1" max="28" value="1" required></label>
      <label>Category <select name="category">${categoryOptions("utilities")}</select></label>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Add bill</button></div>
    </form>
  </section>`;
}

// --- Reports -----------------------------------------------------------

export function renderReports() {
  const t = store.totals();
  const spent = store.spentByCategory();
  const slices = Object.entries(spent).map(([id, v]) => ({ ...store.category(id), value: v }));
  const rows = store.budgetRows().sort((a, b) => b.spent - a.spent);
  const history = store.state.history;
  const avgSpending = history.reduce((s, h) => s + h.spending, 0) / history.length;
  const avgIncome = history.reduce((s, h) => s + h.income, 0) / history.length;
  const bestMonth = [...history].sort((a, b) => (a.income - a.spending) - (b.income - b.spending)).pop();

  return `
  <header class="page-head"><div><h1>Reports</h1><p class="lede">Six months of income against spending, and where November's money actually went.</p></div></header>

  <section class="cards" aria-label="Six-month averages">
    <article class="card stat"><p class="stat-label">Average income / month</p><p class="stat-value in">${money(avgIncome)}</p><p class="stat-note">June – November 2026</p></article>
    <article class="card stat"><p class="stat-label">Average spending / month</p><p class="stat-value out">${money(avgSpending)}</p><p class="stat-note">June – November 2026</p></article>
    <article class="card stat"><p class="stat-label">Best saving month</p><p class="stat-value">${bestMonth.month}</p><p class="stat-note">${money(bestMonth.income - bestMonth.spending)} kept that month</p></article>
    <article class="card stat"><p class="stat-label">November savings rate</p><p class="stat-value">${pct(t.savingsRate)}</p><p class="stat-note">${money(t.remaining)} of ${money(t.income)} kept</p></article>
  </section>

  <div class="grid-2">
    <section class="card">
      <h2>Income vs spending — six months</h2>
      ${trendChart(history)}
      <p class="legend"><span class="swatch" style="background:#2f6f5e"></span> Income <span class="swatch" style="background:#c06a2e"></span> Spending</p>
      <p class="muted">Spending stays near $3,400–$3,800 while income has crept up — the gap is what funds the goals.</p>
    </section>

    <section class="card">
      <h2>Spending by category — November</h2>
      <div class="donut-wrap">${donutChart(slices, t.spending)}</div>
      <ul class="legend-list">${slices.sort((a, b) => b.value - a.value).map((s) => `<li><span class="swatch" style="background:${s.color}"></span> ${s.label} <span class="num">${money(s.value)} · ${pct(s.value / t.spending)}</span></li>`).join("")}</ul>
    </section>
  </div>

  <section class="card">
    <h2>Category table — November</h2>
    <div class="table-wrap"><table class="tx-table">
      <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Budget</th><th class="num">Left</th><th>Share</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td><span class="dot" style="background:${r.color}"></span> ${r.label}</td><td class="num">${money(r.spent)}</td><td class="num">${money(r.limit)}</td><td class="num">${money(r.left)}</td><td>${pct(r.spent / t.spending)}</td></tr>`).join("")}</tbody>
    </table></div>
    <p class="muted">Housing is half of all spending — normal for a renting household. Groceries are the biggest flexible cost, which is why the weekly list matters.</p>
  </section>`;
}

// --- Event wiring --------------------------------------------------------
// One delegated listener per page render. `rerender` re-runs the router.

export function bindPage(root, route, rerender) {
  root.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === "pay-bill" || action === "toggle-bill") {
      store.toggleBillPaid(id);
      rerender();
    } else if (action === "delete-tx") {
      if (window.confirm("Delete this transaction?")) {
        store.deleteTransaction(id);
        rerender();
      }
    } else if (action === "delete-goal") {
      if (window.confirm("Remove this savings goal?")) {
        store.deleteGoal(id);
        rerender();
      }
    } else if (action === "delete-bill") {
      if (window.confirm("Delete this recurring bill?")) {
        store.deleteBill(id);
        rerender();
      }
    } else if (action === "edit-tx") {
      const tx = store.state.transactions.find((x) => x.id === id);
      const form = root.querySelector("#tx-form");
      if (!tx || !form) return;
      form.elements.id.value = tx.id;
      form.elements.date.value = tx.date;
      form.elements.kind.value = tx.kind;
      syncTxCategories(form);
      form.elements.category.value = tx.category;
      form.elements.note.value = tx.note;
      form.elements.amount.value = tx.amount.toFixed(2);
      root.querySelector("#tx-cancel").hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      form.elements.note.focus();
    }
  });

  // Transaction form: kind switch swaps the category list.
  const txForm = root.querySelector("#tx-form");
  if (txForm) {
    txForm.addEventListener("change", (ev) => {
      if (ev.target.id === "tx-kind") syncTxCategories(txForm);
    });
    txForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const f = new FormData(txForm);
      const tx = {
        date: String(f.get("date")),
        kind: String(f.get("kind")),
        category: String(f.get("category")),
        note: String(f.get("note")).trim(),
        amount: Math.round(Number(f.get("amount")) * 100) / 100,
      };
      if (!tx.note || !(tx.amount > 0)) return;
      const id = String(f.get("id") || "");
      if (id) store.updateTransaction(id, tx);
      else store.addTransaction(tx);
      rerender();
    });
    const cancel = root.querySelector("#tx-cancel");
    if (cancel) cancel.addEventListener("click", () => rerender());
  }

  const filterForm = root.querySelector("#tx-filter");
  if (filterForm) {
    filterForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const f = new FormData(filterForm);
      const params = new URLSearchParams();
      params.set("kind", String(f.get("kind")));
      params.set("category", String(f.get("category")));
      params.set("q", String(f.get("q") || ""));
      window.location.hash = "#/transactions?" + params.toString();
    });
  }

  // Budget limit forms, one per row.
  for (const form of root.querySelectorAll(".limit-form")) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const limit = Number(new FormData(form).get("limit"));
      if (limit >= 0) store.setBudgetLimit(form.dataset.category, limit);
      rerender();
    });
  }

  // Goal funding + creation.
  for (const form of root.querySelectorAll(".add-funds")) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const amount = Number(new FormData(form).get("amount"));
      if (amount > 0) store.addToGoal(form.dataset.goal, amount);
      rerender();
    });
  }
  const goalForm = root.querySelector("#goal-form");
  if (goalForm) {
    goalForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const f = new FormData(goalForm);
      const target = Number(f.get("target"));
      if (!String(f.get("name")).trim() || !(target > 0)) return;
      store.addGoal({
        name: String(f.get("name")).trim(),
        target,
        note: String(f.get("note") || "").trim() || "A new goal for the household.",
      });
      rerender();
    });
  }

  // Bill creation.
  const billForm = root.querySelector("#bill-form");
  if (billForm) {
    billForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const f = new FormData(billForm);
      const amount = Number(f.get("amount"));
      const day = Number(f.get("day"));
      if (!String(f.get("name")).trim() || !(amount > 0) || day < 1 || day > 28) return;
      store.addBill({
        name: String(f.get("name")).trim(),
        amount,
        day,
        category: String(f.get("category")),
      });
      rerender();
    });
  }
}

function syncTxCategories(form) {
  const kind = form.elements.kind.value;
  const select = form.elements.category;
  const current = select.value;
  select.innerHTML = kind === "income" ? incomeOptions(current) : categoryOptions(current);
  if (![...select.options].some((o) => o.value === current)) select.value = select.options[0].value;
}
