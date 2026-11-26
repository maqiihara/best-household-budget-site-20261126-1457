// Hand-rolled SVG charts — no library, no network.
// Two charts the budget site needs: a donut of spending by category and
// grouped bars of income vs spending over six months. Both return an SVG
// string the views drop into the page, with a text fallback beside them
// so the numbers are readable even without the picture.

import { money0 } from "./store.js";

// Donut: one arc per category, biggest first, with a centre total.
export function donutChart(slices, total) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 84;
  const inner = 58;
  const sorted = [...slices].sort((a, b) => b.value - a.value);
  let angle = -Math.PI / 2;
  const paths = [];
  for (const s of sorted) {
    if (s.value <= 0) continue;
    const frac = s.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    paths.push(
      `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}"><title>${s.label}: ${money0(s.value)}</title></path>`,
    );
    angle = a1;
  }
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, total ${money0(total)}" class="chart-svg">${paths.join("")}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-centre-top">Spent</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-centre">${money0(total)}</text></svg>`;
}

// Grouped bars: income (green) vs spending (terracotta) per month.
export function trendChart(months) {
  const w = 640;
  const h = 260;
  const padL = 52;
  const padB = 28;
  const padT = 14;
  const plotW = w - padL - 12;
  const plotH = h - padT - padB;
  const max = Math.max(...months.flatMap((m) => [m.income, m.spending])) * 1.08;
  const groupW = plotW / months.length;
  const barW = Math.min(34, groupW * 0.28);
  const bars = [];
  const labels = [];
  months.forEach((m, i) => {
    const x = padL + i * groupW + groupW / 2;
    const ih = (m.income / max) * plotH;
    const sh = (m.spending / max) * plotH;
    bars.push(
      `<rect x="${(x - barW - 3).toFixed(1)}" y="${(padT + plotH - ih).toFixed(1)}" width="${barW}" height="${ih.toFixed(1)}" rx="3" fill="#2f6f5e"><title>${m.month} income ${money0(m.income)}</title></rect>`,
      `<rect x="${(x + 3).toFixed(1)}" y="${(padT + plotH - sh).toFixed(1)}" width="${barW}" height="${sh.toFixed(1)}" rx="3" fill="#c06a2e"><title>${m.month} spending ${money0(m.spending)}</title></rect>`,
    );
    labels.push(`<text x="${x.toFixed(1)}" y="${h - 8}" text-anchor="middle" class="chart-label">${m.month}</text>`);
  });
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + plotH * (1 - f);
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w - 12}" y2="${y.toFixed(1)}" class="chart-grid"/><text x="${padL - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="chart-label">${money0(max * f)}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Monthly income versus spending, June to November 2026" class="chart-svg">${grid.join("")}<line x1="${padL}" y1="${padT + plotH}" x2="${w - 12}" y2="${padT + plotH}" class="chart-axis"/>${bars.join("")}${labels.join("")}</svg>`;
}

// Compact horizontal bars for the dashboard's top-spending list.
export function miniBar(value, max, color) {
  const w = 120;
  const filled = max > 0 ? Math.max(4, (value / max) * w) : 4;
  return `<svg viewBox="0 0 ${w} 10" class="mini-bar" aria-hidden="true"><rect x="0" y="0" width="${w}" height="10" rx="5" fill="#e9e4d8"/><rect x="0" y="0" width="${filled.toFixed(1)}" height="10" rx="5" fill="${color}"/></svg>`;
}
