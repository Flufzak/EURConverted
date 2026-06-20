# EURConverted

EURConverted is a small, mobile-first currency converter for everyday EUR, AMD, and USD checks. It is built as a Vue 3 PWA with TypeScript, Tailwind CSS, PrimeVue, and a warm pink design system.

The goal is simple: open the app, type an amount, swap currencies if needed, and get a clean answer without a banking-dashboard mood.

## What It Does

- Converts between EUR, AMD, and USD.
- Uses live exchange rates from Frankfurter when available.
- Stores the last successful rate in `localStorage`.
- Caches the app shell and successful API responses with a service worker.
- Falls back to the stored rate if a live request fails.
- Formats amounts in European style: `1.345,45`.
- Formats dates as `dd/mm/yyyy`.
- Keeps the UI compact and phone-friendly.

## Data Source

Live rates come from Frankfurter:

```txt
https://api.frankfurter.dev
```

The app first asks for a direct pair:

```txt
/v2/rate/{base}/{quote}
```

If that response is not usable, it tries the filtered rates endpoint:

```txt
/v2/rates?base={base}&quotes={quote}
```

Only rate data comes from the API. Currency labels and symbols for the three supported currencies live locally in `src/data/currencies.ts`, because the app only needs EUR, AMD, and USD.

## About `PRO FEATURE ONLY`

If you see a response like this:

```json
{
  "status": 200,
  "url": "https://api.frankfurter.dev/v2/rate/EUR/AMD",
  "method": "GET",
  "response": "PRO FEATURE ONLY"
}
```

that means the request returned HTTP 200, but the body was not the rate JSON the app needs. The app now treats that as an invalid response, tries the filtered Frankfurter endpoint, and then falls back to the last stored rate if needed.

So the converter should not silently break into `NaN`; it either uses a valid live rate, uses a stored rate, or shows that no stored rate is available.

## Offline Use

EURConverted includes a service worker in `public/sw.js`.

After the app has been opened once with internet:

- The app shell is cached for offline launches.
- Already loaded build assets are cached.
- Successful Frankfurter rate responses are cached.
- Parsed rates are also stored in `localStorage`.

That means the installed app can open without internet after it has been visited once. It can convert currency pairs that were already fetched successfully before. A pair that has never been fetched cannot be created offline, because there is no rate to use yet.

## Project Setup

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Project Shape

```txt
src/
  components/       UI components
  composables/      converter state and calculations
  data/             supported currency display data
  services/         Frankfurter API and localStorage cache
  styling/          global design tokens and styling
  types/            shared TypeScript types
```

## Design Notes

The app uses the existing design tokens in `src/styling/base.css` and shared global styles in `src/styling/main.css`.

Rules of thumb:

- Keep it soft, compact, and mobile-first.
- Use existing CSS variables instead of hardcoded colors.
- Use PrimeVue for reusable UI primitives when it fits.
- Use PrimeIcons for icons.
- Keep Vue refs explicitly typed.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- PrimeVue
- PrimeIcons
