// DealTruth filters: search text, category, store, minimum discount,
// verdict, and sorting. Pure functions over the deal list — no network,
// no storage, nothing leaves the page.
import { DEALS } from "./data.js";

export const state = {
  query: "",
  category: "All",
  store: "All",
  minDiscount: 0,
  verdict: "All",
  sort: "discount"
};

export function discountOf(deal) {
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

export function applyFilters() {
  const q = state.query.trim().toLowerCase();
  let list = DEALS.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (state.verdict !== "All" && d.verdict !== state.verdict) return false;
    if (discountOf(d) < state.minDiscount) return false;
    if (q) {
      const hay = (d.name + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (state.sort === "discount") {
    list.sort((a, b) => discountOf(b) - discountOf(a) || a.sale - b.sale);
  } else if (state.sort === "saving") {
    list.sort((a, b) => (b.usual - b.sale) - (a.usual - a.sale));
  } else if (state.sort === "price-asc") {
    list.sort((a, b) => a.sale - b.sale);
  } else if (state.sort === "price-desc") {
    list.sort((a, b) => b.sale - a.sale);
  } else if (state.sort === "verdict") {
    const rank = { "new-low": 0, strong: 1, routine: 2, inflated: 3 };
    list.sort((a, b) => rank[a.verdict] - rank[b.verdict] || discountOf(b) - discountOf(a));
  }
  return list;
}

export function countByVerdict(list) {
  const out = { "new-low": 0, strong: 0, routine: 0, inflated: 0 };
  for (const d of list) out[d.verdict] += 1;
  return out;
}

export function totalSaving(list) {
  return list.reduce((sum, d) => sum + (d.usual - d.sale), 0);
}
