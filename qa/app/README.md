# AceUp Console (assessment build)

A small web app that simulates part of the AceUp product: an AI coach chat and live
coaching session scheduling. It is a static site — no backend, no build step. Data is
stored in the browser (`localStorage`).

## Running it

From the bundle root (one level up), with Docker:

```bash
make start SEED=YOUR_SEED
```

It prints the URL, e.g. <http://localhost:4173/index.html?seed=YOUR_SEED>.

It **must** be served over HTTP — opening the HTML files directly (`file://`) leaves the
coach list and slot grid empty, because browsers block the JSON `fetch`. Any static server
works if you would rather not use Docker:

```bash
# from this directory
python3 -m http.server 4173
# or
npx --yes serve -l 4173 .
```

## Your build seed

You were given a **seed** in your assignment email. Always browse with
`?seed=YOUR_SEED` on the URL. The seed is remembered for the rest of the session and
kept across in-app navigation.

Behaviour is **deterministic** for a given seed: same seed, same data, same app
behaviour, every time. If you report something, we must be able to reproduce it with
your seed — so always state it.

## Screens

| Screen | Path |
|---|---|
| Dashboard | `index.html` |
| Coach directory | `coaches.html` |
| Booking | `booking.html?coach=c1` |
| My sessions | `sessions.html` |
| AI coach chat | `chat.html` |

## Resetting your data

Booked sessions live in `localStorage` under `aceup.state.<seed>`. To start from a
clean slate:

```js
// browser console
Object.keys(localStorage)
  .filter(k => k.startsWith('aceup.'))
  .forEach(k => localStorage.removeItem(k));
```

## Known constraints of this build (not defects)

- Requests are simulated with artificial latency (~200–900 ms).
- Only the flows listed above exist; other links/areas are static.
- There is no login; you are always "Alex Rivera".
- Dates are limited to the next 7 days.
