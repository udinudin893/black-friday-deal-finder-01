// DealTruth bootstrap: wires the search box, filter controls and sorting,
// then renders the deal grid and the stats bar. Runs entirely offline.
import { CATEGORIES, CHECKED_AT, CHECKED_NOTE, DEALS, STORES } from "./data.js";
import { applyFilters, countByVerdict, discountOf, state } from "./filters.js";
import { renderList, renderStats } from "./render.js";

const grid = document.getElementById("grid");
const stats = document.getElementById("stats");
const count = document.getElementById("count");
const search = document.getElementById("search");
const categoryBar = document.getElementById("categories");
const storeSel = document.getElementById("store");
const discountSel = document.getElementById("discount");
const verdictSel = document.getElementById("verdict");
const sortSel = document.getElementById("sort");
const clearBtn = document.getElementById("clear");

function buildChips() {
  categoryBar.innerHTML = CATEGORIES.map(
    (c) =>
      '<button type="button" class="chip' + (c === state.category ? " active" : "") +
      '" data-cat="' + c + '">' + c + "</button>"
  ).join("");
  categoryBar.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.getAttribute("data-cat");
      buildChips();
      draw();
    });
  });
}

function buildSelect(sel, options, current) {
  sel.innerHTML = options
    .map((o) => '<option value="' + o + '"' + (o === current ? " selected" : "") + ">" + o + "</option>")
    .join("");
}

function draw() {
  const list = applyFilters();
  renderList(list, grid);
  renderStats(list, stats);
  const verdicts = countByVerdict(list);
  count.textContent =
    list.length + " of " + DEALS.length + " deals · " +
    verdicts["new-low"] + " record lows · " +
    verdicts.strong + " strong · " +
    verdicts.routine + " routine";
  clearBtn.hidden = !(
    state.query || state.category !== "All" || state.store !== "All" ||
    state.minDiscount > 0 || state.verdict !== "All" || state.sort !== "discount"
  );
}

search.addEventListener("input", () => {
  state.query = search.value;
  draw();
});
storeSel.addEventListener("change", () => {
  state.store = storeSel.value;
  draw();
});
discountSel.addEventListener("change", () => {
  state.minDiscount = Number(discountSel.value);
  draw();
});
verdictSel.addEventListener("change", () => {
  state.verdict = verdictSel.value;
  draw();
});
sortSel.addEventListener("change", () => {
  state.sort = sortSel.value;
  draw();
});
clearBtn.addEventListener("click", () => {
  state.query = "";
  state.category = "All";
  state.store = "All";
  state.minDiscount = 0;
  state.verdict = "All";
  state.sort = "discount";
  search.value = "";
  storeSel.value = "All";
  discountSel.value = "0";
  verdictSel.value = "All";
  sortSel.value = "discount";
  buildChips();
  draw();
});

// A filter can be shared as a link: #verdict=new-low, #category=Audio,
// #store=Amazon, #discount=50, #sort=saving, #q=airpods. Read once on load.
// #grid alone jumps straight to the deal grid.
function readHash() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;
  if (hash === "grid") {
    requestAnimationFrame(() => {
      document.getElementById("grid").scrollIntoView();
    });
    return;
  }
  const params = new URLSearchParams(hash);
  const verdict = params.get("verdict");
  if (verdict && ["new-low", "strong", "routine", "inflated"].includes(verdict)) {
    state.verdict = verdict;
  }
  const category = params.get("category");
  if (category && CATEGORIES.includes(category)) state.category = category;
  const store = params.get("store");
  if (store && STORES.includes(store)) state.store = store;
  const discount = Number(params.get("discount"));
  if ([0, 20, 30, 40, 50].includes(discount)) state.minDiscount = discount;
  const sort = params.get("sort");
  if (["discount", "verdict", "saving", "price-asc", "price-desc"].includes(sort)) {
    state.sort = sort;
  }
  const q = params.get("q");
  if (q) state.query = q;
}

readHash();
search.value = state.query;
storeSel.value = state.store;
discountSel.value = String(state.minDiscount);
verdictSel.value = state.verdict;
sortSel.value = state.sort;

document.getElementById("checked-line").textContent =
  "All prices checked " + CHECKED_AT + ". " + CHECKED_NOTE;
document.getElementById("deal-total").textContent = String(DEALS.length);

buildChips();
buildSelect(storeSel, STORES, state.store);
buildSelect(verdictSel, ["All", "new-low", "strong", "routine", "inflated"], state.verdict);
draw();
