// Router and boot for the Marigold budget site.
//
// Hash routes, one per section of the household's budget:
//   #/             dashboard — month overview
//   #/transactions transactions — add, edit, delete, filter
//   #/budgets      category budgets with limits
//   #/goals       savings goals
//   #/bills       recurring bills
//   #/reports     charts and the category table
// The nav highlights the current route, and the footer carries the
// "Reset sample data" button that restores the seed from data.js.

import { bindPage, renderBills, renderBudgets, renderDashboard, renderGoals, renderReports, renderTransactions } from "./views.js";
import { store } from "./store.js";

const page = document.getElementById("page");
const navLinks = [...document.querySelectorAll(".site-nav a")];

const ROUTES = {
  "": renderDashboard,
  transactions: renderTransactions,
  budgets: renderBudgets,
  goals: renderGoals,
  bills: renderBills,
  reports: renderReports,
};

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [path, query] = raw.split("?");
  const params = new URLSearchParams(query || "");
  return {
    route: path || "",
    filter: {
      kind: params.get("kind") || "all",
      category: params.get("category") || "all",
      q: params.get("q") || "",
    },
  };
}

function render() {
  const { route, filter } = parseHash();
  const fn = ROUTES[route] || renderDashboard;
  page.innerHTML = route === "transactions" ? fn(filter) : fn();
  for (const a of navLinks) {
    const href = a.getAttribute("href");
    const r = href.replace(/^#\/?/, "");
    a.classList.toggle("active", r === route || (r === "" && route === ""));
    if (r === route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
  bindPage(page, route, render);
  window.scrollTo(0, 0);
}

document.getElementById("reset-data").addEventListener("click", () => {
  if (window.confirm("Reset everything back to the sample November data? Your edits will be lost.")) {
    store.reset();
    render();
  }
});

window.addEventListener("hashchange", render);
render();
