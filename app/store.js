// State and persistence for the Marigold budget site.
//
// The seed in data.js is the starting point. On first visit the store
// copies it into localStorage under one key; after that every add, edit
// and delete writes the whole state back, so the household's changes
// survive a reload. A "Reset sample data" button restores the seed.

import {
  BUDGETS,
  BILLS,
  CATEGORIES,
  GOALS,
  HOUSEHOLD,
  MONTHLY_HISTORY,
  TRANSACTIONS,
} from "./data.js";

const STORAGE_KEY = "marigold-budget-v1";

function seedState() {
  return {
    household: { ...HOUSEHOLD },
    budgets: BUDGETS.map((b) => ({ ...b })),
    transactions: TRANSACTIONS.map((t) => ({ ...t })),
    goals: GOALS.map((g) => ({ ...g })),
    bills: BILLS.map((b) => ({ ...b })),
    history: MONTHLY_HISTORY.map((h) => ({ ...h })),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

export const store = {
  state: loadState(),

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Private browsing or a full store: the site still works in memory.
    }
  },

  reset() {
    this.state = seedState();
    this.save();
  },

  // --- lookups -------------------------------------------------------
  category(id) {
    return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: "#8c8c8c", icon: "•" };
  },

  // --- totals for the current month ----------------------------------
  totals() {
    const txs = this.state.transactions;
    let income = 0;
    let spending = 0;
    for (const t of txs) {
      if (t.kind === "income") income += t.amount;
      else spending += t.amount;
    }
    const budgetTotal = this.state.budgets.reduce((s, b) => s + b.limit, 0);
    return {
      income,
      spending,
      remaining: income - spending,
      budgetTotal,
      budgetLeft: budgetTotal - spending,
      savingsRate: income > 0 ? (income - spending) / income : 0,
    };
  },

  spentByCategory() {
    const spent = {};
    for (const t of this.state.transactions) {
      if (t.kind !== "expense") continue;
      spent[t.category] = (spent[t.category] || 0) + t.amount;
    }
    return spent;
  },

  budgetRows() {
    const spent = this.spentByCategory();
    return this.state.budgets.map((b) => {
      const used = spent[b.category] || 0;
      return {
        ...b,
        label: this.category(b.category).label,
        color: this.category(b.category).color,
        spent: used,
        left: b.limit - used,
        pct: b.limit > 0 ? used / b.limit : 0,
      };
    });
  },

  upcomingBills() {
    return this.state.bills.filter((b) => !b.paid);
  },

  upcomingBillsTotal() {
    return this.upcomingBills().reduce((s, b) => s + b.amount, 0);
  },

  // --- mutations -----------------------------------------------------
  addTransaction(tx) {
    const id = "u" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
    this.state.transactions.unshift({ id, ...tx });
    this.save();
    return id;
  },

  updateTransaction(id, patch) {
    const t = this.state.transactions.find((x) => x.id === id);
    if (!t) return false;
    Object.assign(t, patch);
    this.save();
    return true;
  },

  deleteTransaction(id) {
    this.state.transactions = this.state.transactions.filter((x) => x.id !== id);
    this.save();
  },

  setBudgetLimit(category, limit) {
    const b = this.state.budgets.find((x) => x.category === category);
    if (b) b.limit = limit;
    this.save();
  },

  addToGoal(id, amount) {
    const g = this.state.goals.find((x) => x.id === id);
    if (!g) return;
    g.saved = Math.min(g.target, Math.max(0, g.saved + amount));
    this.save();
  },

  addGoal(goal) {
    const id = "g" + Date.now().toString(36);
    this.state.goals.push({ id, saved: 0, ...goal });
    this.save();
    return id;
  },

  deleteGoal(id) {
    this.state.goals = this.state.goals.filter((x) => x.id !== id);
    this.save();
  },

  toggleBillPaid(id) {
    const b = this.state.bills.find((x) => x.id === id);
    if (b) b.paid = !b.paid;
    this.save();
  },

  addBill(bill) {
    const id = "b" + Date.now().toString(36);
    this.state.bills.push({ id, paid: false, ...bill });
    this.save();
    return id;
  },

  deleteBill(id) {
    this.state.bills = this.state.bills.filter((x) => x.id !== id);
    this.save();
  },
};

// --- formatting helpers, shared by every view -------------------------

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function pct(n) {
  return Math.round(n * 100) + "%";
}

export function shortDate(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
