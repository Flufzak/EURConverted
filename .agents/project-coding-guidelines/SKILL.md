---
name: project-coding-guidelines
description: Coding guidance for the EURConverted project. Use when Codex is asked to add, review, refactor, or change Vue, TypeScript, component structure, props, refs, emits, template markup, state handling, Frankfurter API integration, caching, formatting, or project code conventions in this project.
---

# Project Coding Guidelines

Use these instructions when working on code in the EURConverted project.

Before changing anything, inspect the relevant project files for the task. Do not rely on assumptions about current file contents.

## Vue And TypeScript Rules

- Use PrimeVue components for reusable UI primitives when they fit the task.
- Use PrimeIcons for icons instead of handwritten text glyphs or custom inline icons.
- When destructuring Vue props, use destructured `defineProps` syntax such as `const { foo, bar } = defineProps<Props>()`; do not keep a `props` object just to access `props.foo`.
- Always give Vue refs an explicit generic type, such as `ref<boolean>(false)` or `ref<string>('')`.
- Keep components small and focused.
- Prefer existing local patterns before introducing new abstractions.

## API And Data Rules

- Use Frankfurter only for exchange-rate data, not for static display metadata when the app supports a fixed small set of currencies.
- Fetch pair rates with `/v2/rate/{base}/{quote}` and keep `/v2/rates?base={base}&quotes={quote}` as a fallback shape when needed.
- Validate successful HTTP responses before trusting them. A `200` response can still contain an unusable body such as `PRO FEATURE ONLY`.
- Cache successful API rates in `localStorage` and fall back to cached rates when live requests fail.
- Keep service-worker API caching aligned with app-level cache behavior: cache only valid Frankfurter rate payloads and return cached API responses when offline.
- Keep the app shell installable/offline-capable through `public/sw.js`; update its cache name when cached asset behavior changes.
- Keep user-facing amounts formatted as `nl-BE` numbers with two decimals, such as `1.345,45`.
- Keep user-facing dates formatted as `dd/mm/yyyy`.

## Template Rules

- Do not use `span` elements in Vue templates. Use semantic elements, `div`, `p`, `small`, or other appropriate tags instead.
- Keep template markup readable and avoid unnecessary wrapper elements.
