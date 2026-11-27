// HTML for the Bargain Beacon deal board. Every value is escaped before it reaches
// the page. Views: the board (list), one deal (deal), and the not-found page.
// The board's own order is the deals file order; sorting happens in filters.js.
import { applyFilters, dollarsSaved, percentOff, CATEGORIES, STORES } from './filters.js';

export const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
export const usd = (n) => `$${Number.isInteger(n) ? String(n) : n.toFixed(2)}`;
const checkedDay = (iso) =>
  `${new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC`;

const SIGNAL_LABEL = {
  'new-low': 'NEW LOW',
  strong: 'STRONG DEAL',
  routine: 'ROUTINE SALE',
  inflated: 'INFLATED PRICE',
};

export function signalBadge(d) {
  return `<span class="signal ${d.signal}">${SIGNAL_LABEL[d.signal] ?? d.signal}</span>`;
}

export function card(d) {
  const pct = percentOff(d);
  const also =
    d.alsoAt !== undefined
      ? `<p class="also">Also at ${escape(d.alsoAt.store)} ${usd(d.alsoAt.price)} — ${d.price < d.alsoAt.price ? 'cheaper here.' : 'cheaper there.'}</p>`
      : '';
  return `<article class="card">
  <p class="card-top"><span class="cat">${escape(d.category)}</span>${signalBadge(d)}</p>
  <h2><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h2>
  <p class="store">${escape(d.store)}</p>
  <p class="price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="pct">${pct}% off</span></p>
  <p class="save">Save ${usd(dollarsSaved(d))}</p>
  ${also}
  <p class="evidence">${escape(d.evidence)}</p>
  <p class="meta">Checked ${checkedDay(d.checked)} · ${escape(d.source)}</p>
  <p><a class="go" href="${escape(d.url)}" rel="noopener">View at ${escape(d.store)}</a></p>
</article>`;
}

export function rows(deals, query) {
  const state = typeof query === 'string' ? { q: query } : (query ?? {});
  const shown = applyFilters(deals, state);
  if (shown.length === 0) return '<li class="none">No deal matches. Try a different search or filter.</li>';
  return shown.map((d) => `<li>${card(d)}</li>`).join('');
}

export function statsLine(deals, shown) {
  // Best cut counts only genuine deals: the inflated example's nominal 90% is not a real cut.
  const genuine = deals.filter((d) => d.signal !== 'inflated');
  const best = Math.max(...genuine.map(percentOff));
  const saved = deals.reduce((sum, d) => sum + dollarsSaved(d), 0);
  return `<p class="stats"><strong>${shown} of ${deals.length} deals</strong> · ${STORES.length} stores · ${CATEGORIES.length} categories · best cut ${best}% off · ${usd(Math.round(saved))} total savings on this board</p>`;
}

export function list(deals, state = {}) {
  const shown = applyFilters(deals, state);
  return `<h1>Black Friday deals</h1>
${statsLine(deals, shown.length)}
<ul class="deals">${rows(deals, state)}</ul>`;
}

export function deal(d) {
  const pct = percentOff(d);
  const also =
    d.alsoAt !== undefined
      ? `<tr><th>Same product elsewhere</th><td>${escape(d.alsoAt.store)} — ${usd(d.alsoAt.price)} (${d.price < d.alsoAt.price ? `this listing is cheaper by ${usd(Math.round((d.alsoAt.price - d.price) * 100) / 100)}` : `${escape(d.alsoAt.store)} is cheaper by ${usd(Math.round((d.price - d.alsoAt.price) * 100) / 100)}`})</td></tr>`
      : `<tr><th>Same product elsewhere</th><td>No second store price checked for this one.</td></tr>`;
  return `<p><a href="#/">&larr; All deals</a></p>
<h1>${escape(d.title)}</h1>
<p>${signalBadge(d)} <span class="cat">${escape(d.category)}</span></p>
<table class="facts">
  <tr><th>Store</th><td>${escape(d.store)}</td></tr>
  <tr><th>Sale price</th><td><strong>${usd(d.price)}</strong></td></tr>
  <tr><th>Usual price</th><td><s>${usd(d.was)}</s> (${pct}% off, save ${usd(dollarsSaved(d))})</td></tr>
  ${also}
  <tr><th>Is it really a deal?</th><td>${escape(d.evidence)}</td></tr>
  <tr><th>Price checked</th><td>${checkedDay(d.checked)}</td></tr>
  <tr><th>Read in</th><td>${escape(d.source)}</td></tr>
</table>
<p><a class="go" href="${escape(d.url)}" rel="noopener">View at ${escape(d.store)}</a></p>
<p class="note">Prices can change and stock can run out — check the store page before you buy.</p>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
