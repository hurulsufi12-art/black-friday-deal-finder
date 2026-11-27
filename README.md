# Bargain Beacon — Black Friday deals

[![Black Friday deal finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/hurulsufi12-art/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/hurulsufi12-art/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A static Black Friday / Cyber Monday deal finder: 56 real deals across 9 stores
and 16 categories, each price-checked on 27 Nov 2026 at the store or in a deals
source that names the store. Every deal shows its product, store, sale price,
usual price, discount, a link to the product at the store, when the price was
checked, where it was read, and an honest call on whether it is really a deal
(new low, strong price, routine sale, or inflated price). Search and filters by
category, store, and discount all work, and the same product is compared across
stores where two prices were found.

## Run it

Serve `app/` with any static server and open `index.html`:

```sh
cd app && python3 -m http.server 8080   # then open http://localhost:8080
```

Or open `app/index.html` directly. The site loads nothing over the network;
all deals live in `app/deals.js`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored `makefun-frontend` library.

## Files

- `app/index.html` — page shell and filter controls
- `app/style.css` — all styling (system fonts, no network loads)
- `app/main.js` — hash routes and control wiring
- `app/views.js` — board, card, and deal-page markup
- `app/filters.js` — search, filter, and sort (pure functions)
- `app/deals.js` — the 56 checked deals
- `main.ts` — the hand-in program (Node 22, standard library only)
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
