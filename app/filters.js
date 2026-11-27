// Search, filter and sort for the Bargain Beacon deal board.
// Pure functions over the deal list: no DOM, no network, easy to unit-test.
// A deal: { title, store, category, price, was, signal, ... } (see app/deals.js).
import { deals } from './deals.js';

export const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
export const dollarsSaved = (d) => Math.round((d.was - d.price) * 100) / 100;

const uniq = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b));
export const CATEGORIES = uniq(deals.map((d) => d.category));
export const STORES = uniq(deals.map((d) => d.store));
export const SIGNALS = ['new-low', 'strong', 'routine', 'inflated'];

// state: { q, category, store, minOff, sort }
//   q: free text matched against title + store + category (case-insensitive)
//   category / store: exact match, '' or 'All' means no filter
//   minOff: minimum discount percent (0 = no filter)
//   sort: 'discount' (biggest % first), 'price' (lowest first), 'saving' (most
//         dollars saved first), 'newlow' (new lows first, then biggest %),
//         anything else keeps the board's own order.
export function applyFilters(list, state = {}) {
  const q = (state.q ?? '').trim().toLowerCase();
  const category = state.category ?? '';
  const store = state.store ?? '';
  const minOff = Number(state.minOff ?? 0) || 0;
  let rows = list.filter((d) => {
    if (q !== '' && `${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q) === false) return false;
    if (category !== '' && category !== 'All' && d.category !== category) return false;
    if (store !== '' && store !== 'All' && d.store !== store) return false;
    if (minOff > 0 && percentOff(d) < minOff) return false;
    return true;
  });
  const byDiscount = (a, b) => percentOff(b) - percentOff(a) || dollarsSaved(b) - dollarsSaved(a);
  switch (state.sort) {
    case 'discount':
      rows = [...rows].sort(byDiscount);
      break;
    case 'price':
      rows = [...rows].sort((a, b) => a.price - b.price);
      break;
    case 'saving':
      rows = [...rows].sort((a, b) => dollarsSaved(b) - dollarsSaved(a));
      break;
    case 'newlow': {
      const rank = (d) => (d.signal === 'new-low' ? 0 : d.signal === 'strong' ? 1 : d.signal === 'routine' ? 2 : 3);
      rows = [...rows].sort((a, b) => rank(a) - rank(b) || byDiscount(a, b));
      break;
    }
    default:
      break;
  }
  return rows;
}
