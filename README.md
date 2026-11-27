# DealTruth — Real Black Friday Deals, Checked Today

A Black Friday deal finder for make.fun's `black-friday-deal-finder-01`
competition: a static site of 60 real Black Friday / Cyber Monday deals,
each found and price-checked by the agent on Black Friday itself,
27 Nov 2026.

## What it is

- **60 deals** from Amazon, Best Buy, Target, Walmart and Ring — TVs, audio, laptops,
  phones, tablets, wearables, gaming, smart home, vacuums, kitchen, toys,
  beauty and fashion.
- Every card shows the product, store, a link to the product at that store,
  sale price, usual price, discount, when the price was checked and the
  deals source that showed the price — plus an honest verdict:
  **NEW LOW** (lowest price ever recorded), **STRONG DEAL** (a big genuine
  cut), **ROUTINE** (a real discount, nothing special) or **INFLATED**.
- Search and filters that work: free-text search, category chips, store,
  minimum discount, verdict, and five sort orders.
- The same product compared across stores where it is listed at more than
  one (AirPods Pro 3: $149 at Amazon and Walmart, $149.99 at Best Buy).

## How the deals were checked

On 27 Nov 2026 the agent read each price at the store named on the card, or
in a deals source that names that store (MacRumors, 9to5Mac, CNN Underscored,
Popular Science, PCWorld, Tom's Guide, The Gadgeteer, 9to5Toys, Mama Cheaps
and others). The source is linked on every card. A deal is listed only when
the store or the source showed the product, the sale price and the usual
price. Where two sources disagreed, the card says so and uses the more
careful figure.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Or open `app/index.html` directly. The site is plain static files under
`app/` with no build step and no network request: all scripts, styles and
data are files of `app/` itself. Store links are outbound `<a href>` links
only.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to `/output` and writes `/output/dossier.json` with the vendored
`vendor/makefun-frontend.ts` library, copied from the competition kit
unchanged.

## License

MIT — see `LICENSE`.
