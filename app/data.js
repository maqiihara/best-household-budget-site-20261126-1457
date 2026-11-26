// Seed figures for the Marigold household budget site.
//
// Everything here is invented sample data for one fictional household —
// the Marigolds, two earners and a dog, keeping their November 2026
// budget in this site. Amounts are US dollars. The store (store.js)
// loads this seed on first visit and then keeps the household's own
// edits in localStorage, so the seed is only the starting point.

export const HOUSEHOLD = {
  name: "The Marigold Household",
  members: "Maya & Jonas Marigold",
  month: "November 2026",
  monthKey: "2026-11",
  currency: "USD",
  paydayNote: "Paydays: Maya 1st, Jonas 15th",
};

export const CATEGORIES = [
  { id: "housing", label: "Housing", color: "#2f6f5e", icon: "⌂" },
  { id: "groceries", label: "Groceries", color: "#7a9a3b", icon: "◉" },
  { id: "transport", label: "Transport", color: "#3e7ca8", icon: "➤" },
  { id: "dining", label: "Dining out", color: "#c06a2e", icon: "✦" },
  { id: "utilities", label: "Utilities", color: "#6a5f9e", icon: "⚡" },
  { id: "entertainment", label: "Entertainment", color: "#b84a6e", icon: "♪" },
  { id: "health", label: "Health", color: "#3d8f7a", icon: "+" },
  { id: "clothing", label: "Clothing", color: "#8a6d3b", icon: "✂" },
  { id: "subscriptions", label: "Subscriptions", color: "#5b7a8a", icon: "↻" },
  { id: "misc", label: "Everything else", color: "#8c8c8c", icon: "•" },
];

export const INCOME_CATEGORIES = [
  { id: "salary", label: "Salary" },
  { id: "freelance", label: "Freelance" },
  { id: "other-income", label: "Other income" },
];

// Monthly budget limits per spending category, November 2026.
export const BUDGETS = [
  { category: "housing", limit: 1950 },
  { category: "groceries", limit: 700 },
  { category: "transport", limit: 320 },
  { category: "dining", limit: 240 },
  { category: "utilities", limit: 280 },
  { category: "entertainment", limit: 150 },
  { category: "health", limit: 200 },
  { category: "clothing", limit: 120 },
  { category: "subscriptions", limit: 85 },
  { category: "misc", limit: 150 },
];

// One transaction per row. `kind` is "expense" or "income".
// November 2026, newest first in the list the site shows.
export const TRANSACTIONS = [
  { id: "t01", date: "2026-11-26", kind: "expense", category: "groceries", note: "Weekly shop — GreenMart", amount: 63.15 },
  { id: "t02", date: "2026-11-25", kind: "expense", category: "dining", note: "Lunch with Maya's sister", amount: 44.20 },
  { id: "t03", date: "2026-11-24", kind: "expense", category: "transport", note: "Fuel — Route 9 station", amount: 42.00 },
  { id: "t04", date: "2026-11-23", kind: "expense", category: "misc", note: "Birthday gift for Aunt Rosa", amount: 35.00 },
  { id: "t05", date: "2026-11-22", kind: "expense", category: "groceries", note: "Weekly shop — GreenMart", amount: 154.60 },
  { id: "t06", date: "2026-11-21", kind: "expense", category: "entertainment", note: "Cinema — two tickets", amount: 32.00 },
  { id: "t07", date: "2026-11-20", kind: "expense", category: "health", note: "Dentist check-up — Jonas", amount: 120.00 },
  { id: "t08", date: "2026-11-19", kind: "expense", category: "clothing", note: "Winter coat — Maya", amount: 64.99 },
  { id: "t09", date: "2026-11-18", kind: "expense", category: "groceries", note: "Top-up shop — corner store", amount: 87.20 },
  { id: "t10", date: "2026-11-17", kind: "expense", category: "dining", note: "Pizza night", amount: 18.90 },
  { id: "t11", date: "2026-11-16", kind: "expense", category: "transport", note: "Monthly transit pass", amount: 85.00 },
  { id: "t12", date: "2026-11-15", kind: "income", category: "salary", note: "Jonas — November salary", amount: 3150.00 },
  { id: "t13", date: "2026-11-15", kind: "expense", category: "utilities", note: "Electricity bill", amount: 112.40 },
  { id: "t14", date: "2026-11-14", kind: "expense", category: "groceries", note: "Weekly shop — GreenMart", amount: 118.40 },
  { id: "t15", date: "2026-11-13", kind: "expense", category: "misc", note: "Dog food & vet treats — Biscuit", amount: 48.60 },
  { id: "t16", date: "2026-11-12", kind: "expense", category: "entertainment", note: "Concert tickets — folk night", amount: 65.00 },
  { id: "t17", date: "2026-11-11", kind: "expense", category: "dining", note: "Takeaway Thai", amount: 52.00 },
  { id: "t18", date: "2026-11-10", kind: "expense", category: "utilities", note: "Internet — monthly", amount: 59.99 },
  { id: "t19", date: "2026-11-09", kind: "expense", category: "groceries", note: "Weekly shop — GreenMart", amount: 96.75 },
  { id: "t20", date: "2026-11-08", kind: "expense", category: "transport", note: "Fuel — Route 9 station", amount: 38.50 },
  { id: "t21", date: "2026-11-07", kind: "income", category: "freelance", note: "Maya — weekend design work", amount: 420.00 },
  { id: "t22", date: "2026-11-07", kind: "expense", category: "health", note: "Pharmacy — cold medicine", amount: 28.40 },
  { id: "t23", date: "2026-11-06", kind: "expense", category: "dining", note: "Coffee & pastries", amount: 24.75 },
  { id: "t24", date: "2026-11-05", kind: "expense", category: "clothing", note: "Kids' shoes — nephew", amount: 42.00 },
  { id: "t25", date: "2026-11-04", kind: "expense", category: "groceries", note: "Weekly shop — GreenMart", amount: 142.30 },
  { id: "t26", date: "2026-11-03", kind: "expense", category: "housing", note: "Home insurance — monthly", amount: 95.00 },
  { id: "t27", date: "2026-11-03", kind: "expense", category: "subscriptions", note: "Music + cloud + news", amount: 25.98 },
  { id: "t28", date: "2026-11-02", kind: "expense", category: "transport", note: "Fuel — Route 9 station", amount: 45.00 },
  { id: "t29", date: "2026-11-02", kind: "expense", category: "utilities", note: "Water bill", amount: 46.80 },
  { id: "t30", date: "2026-11-01", kind: "expense", category: "housing", note: "Rent — November", amount: 1800.00 },
  { id: "t31", date: "2026-11-01", kind: "income", category: "salary", note: "Maya — November salary", amount: 3400.00 },
  { id: "t32", date: "2026-11-01", kind: "expense", category: "dining", note: "Sunday brunch", amount: 38.50 },
  { id: "t33", date: "2026-11-01", kind: "expense", category: "entertainment", note: "Streaming movie rental", amount: 15.99 },
];

// Savings goals. `saved` grows when the household adds money.
export const GOALS = [
  { id: "g1", name: "Emergency fund", target: 10000, saved: 7250, note: "Six months of essentials, kept in a separate account." },
  { id: "g2", name: "Family holiday", target: 2400, saved: 1680, note: "A week by the coast next spring — flights booked in January." },
  { id: "g3", name: "New laptop", target: 1400, saved: 950, note: "Maya's work laptop is five years old and slowing down." },
  { id: "g4", name: "Home repairs", target: 3000, saved: 1100, note: "Roof patch and a new water heater before winter." },
];

// Recurring bills. `day` is the day of the month it is due.
export const BILLS = [
  { id: "b1", name: "Rent", amount: 1800.00, day: 1, category: "housing", paid: true },
  { id: "b2", name: "Home insurance", amount: 95.00, day: 3, category: "housing", paid: true },
  { id: "b3", name: "Internet", amount: 59.99, day: 10, category: "utilities", paid: true },
  { id: "b4", name: "Electricity", amount: 112.40, day: 15, category: "utilities", paid: true },
  { id: "b5", name: "Water", amount: 46.80, day: 18, category: "utilities", paid: true },
  { id: "b6", name: "Phone — Jonas", amount: 85.00, day: 20, category: "utilities", paid: false },
  { id: "b7", name: "Gym membership", amount: 39.00, day: 25, category: "health", paid: false },
  { id: "b8", name: "Streaming bundle", amount: 28.98, day: 28, category: "subscriptions", paid: false },
  { id: "b9", name: "Car insurance", amount: 132.00, day: 30, category: "transport", paid: false },
];

// Six-month history for the trend chart (income vs spending).
export const MONTHLY_HISTORY = [
  { month: "Jun", income: 6520, spending: 3410 },
  { month: "Jul", income: 6680, spending: 3580 },
  { month: "Aug", income: 6610, spending: 3720 },
  { month: "Sep", income: 6890, spending: 3590 },
  { month: "Oct", income: 6740, spending: 3810 },
  { month: "Nov", income: 6970, spending: 3643 },
];

// Short, plain-language budgeting tips shown on the dashboard.
export const TIPS = [
  "Groceries are 18% of spending this month — a weekly list keeps the top-up shops down.",
  "Two bills are still due before the 30th: phone ($85) and car insurance ($132).",
  "The emergency fund is 72% full. $250 a month finishes it by next summer.",
];
