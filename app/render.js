// DealTruth render: turns a filtered deal list into cards.
// Every card shows the product, store, sale price, usual price, discount,
// verdict with its evidence, when the price was checked and the source.
import { CHECKED_AT, VERDICTS } from "./data.js";
import { discountOf } from "./filters.js";

export function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function verdictChip(deal) {
  const v = VERDICTS[deal.verdict];
  return (
    '<span class="verdict verdict-' + deal.verdict + '" title="' + esc(v.blurb) + '">' +
    esc(v.label) +
    "</span>"
  );
}

export function dealCard(deal) {
  const off = discountOf(deal);
  const saved = deal.usual - deal.sale;
  return (
    '<article class="card" data-id="' + esc(deal.id) + '">' +
    '<div class="card-top">' +
    '<span class="store">' + esc(deal.store) + '</span>' +
    '<span class="cat">' + esc(deal.category) + '</span>' +
    "</div>" +
    '<h3 class="name">' + esc(deal.name) + "</h3>" +
    '<div class="prices">' +
    '<span class="sale">' + money(deal.sale) + "</span>" +
    '<span class="usual"><s>' + money(deal.usual) + "</s></span>" +
    '<span class="off">−' + off + "%</span>" +
    "</div>" +
    '<p class="saved">You save ' + money(saved) + "</p>" +
    '<div class="verdict-row">' + verdictChip(deal) + "</div>" +
    '<p class="evidence">' + esc(deal.evidence) + "</p>" +
    (deal.note ? '<p class="note">' + esc(deal.note) + "</p>" : "") +
    '<p class="checked">Checked ' + esc(deal.checked || CHECKED_AT) +
    " · Source: " + '<a href="' + esc(deal.sourceUrl) + '" target="_blank" rel="noopener">' + esc(deal.source) + "</a></p>" +
    '<a class="buy" href="' + esc(deal.url) + '" target="_blank" rel="noopener">View at ' + esc(deal.store) + " →</a>" +
    "</article>"
  );
}

export function renderList(list, mount) {
  if (!list.length) {
    mount.innerHTML =
      '<p class="empty">No deals match those filters. Loosen the search or pick another category, store or discount.</p>';
    return;
  }
  mount.innerHTML = list.map(dealCard).join("");
}

export function renderStats(list, mount) {
  const lows = list.filter((d) => d.verdict === "new-low").length;
  const best = list.length ? Math.max.apply(null, list.map(discountOf)) : 0;
  const saved = list.reduce((s, d) => s + (d.usual - d.sale), 0);
  mount.innerHTML =
    '<div class="stat"><strong>' + list.length + '</strong><span>deals listed</span></div>' +
    '<div class="stat"><strong>' + lows + '</strong><span>record lows</span></div>' +
    '<div class="stat"><strong>−' + best + '%</strong><span>biggest cut</span></div>' +
    '<div class="stat"><strong>' + money(saved) + '</strong><span>total savings</span></div>';
}
