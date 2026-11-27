// Bargain Beacon boot: hash routes, control wiring, render.
//   #/                       the board, filters read from the hash query
//   #/?q=…&category=…&store=…&min=…&sort=…   the board with filters applied
//   #/deal/<id>              one deal
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.
import { deals } from './deals.js';
import { deal, list, missing } from './views.js';
import { CATEGORIES, STORES } from './filters.js';

const app = document.getElementById('app');
const search = document.getElementById('q');
const category = document.getElementById('category');
const store = document.getElementById('store');
const minOff = document.getElementById('min');
const sort = document.getElementById('sort');

function fillSelect(el, values) {
  for (const v of values) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    el.appendChild(opt);
  }
}
fillSelect(category, CATEGORIES);
fillSelect(store, STORES);

function stateFromHash() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [path, query] = hash.split('?');
  const params = new URLSearchParams(query ?? '');
  return {
    path: path ?? '',
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    store: params.get('store') ?? '',
    minOff: params.get('min') ?? '',
    sort: params.get('sort') ?? 'newlow',
  };
}

function stateToHash(state) {
  const params = new URLSearchParams();
  if (state.q !== '') params.set('q', state.q);
  if (state.category !== '') params.set('category', state.category);
  if (state.store !== '') params.set('store', state.store);
  if (state.minOff !== '' && state.minOff !== '0') params.set('min', state.minOff);
  if (state.sort !== '' && state.sort !== 'newlow') params.set('sort', state.sort);
  const query = params.toString();
  return `#/${query === '' ? '' : `?${query}`}`;
}

function render() {
  window.__shotReady = false;
  const state = stateFromHash();
  search.value = state.q;
  category.value = state.category === '' ? 'All' : state.category;
  store.value = state.store === '' ? 'All' : state.store;
  minOff.value = state.minOff === '' ? '0' : state.minOff;
  sort.value = state.sort;
  const match = state.path.match(/^deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : 'Not found'} | Bargain Beacon`;
    app.innerHTML = found ? deal(found) : missing();
  } else {
    document.title = 'Bargain Beacon — Black Friday deals';
    app.innerHTML = list(deals, {
      q: state.q,
      category: state.category,
      store: state.store,
      minOff: state.minOff,
      sort: state.sort,
    });
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function readControls() {
  return {
    q: search.value,
    category: category.value === 'All' ? '' : category.value,
    store: store.value === 'All' ? '' : store.value,
    minOff: minOff.value,
    sort: sort.value,
  };
}

for (const el of [search, category, store, minOff, sort]) {
  el.addEventListener('input', () => {
    history.replaceState(null, '', stateToHash(readControls()));
    render();
  });
}

window.addEventListener('hashchange', render);
render();
