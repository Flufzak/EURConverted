---
name: project-styling-guidelines
description: Styling guidance for the EURConverted project. Use when Codex is asked to add, review, or change UI styling, CSS, Vue markup classes, Tailwind classes, layout spacing, colors, typography, buttons, forms, error states, or visual design in this project.
---

# Project Styling Guidelines

Use these instructions when working on styling in the EURConverted project.

## Required CSS Context

Before making styling decisions, inspect:

- `src/styling/base.css` for base design tokens, including colors, surfaces, text colors, radius values, shadows, and font family.
- `src/styling/main.css` for global element styling, common utility classes, page spacing, form styling, headings, status states, and project-wide defaults.

Treat `base.css` as the source of truth for visual tokens. Reuse its CSS variables instead of hardcoding colors, shadows, radii, or font choices.

Treat `main.css` as the source of truth for global HTML tag styling and shared reusable classes.

## Editing Rules

Do not change `src/styling/base.css` or `src/styling/main.css` unless the user explicitly asks to update those files.

When implementing component or page styling:

- Prefer existing CSS variables from `base.css`.
- Prefer existing global styles and utility classes from `main.css`.
- Add local component classes only when the styling is specific to that component.
- Avoid duplicating global rules already handled in `main.css`.
- Keep Tailwind classes consistent with the project tokens and existing global CSS.

If a requested styling change would be best handled by updating `base.css` or `main.css`, explain that and only edit those files if the user confirms or has already asked for a global styling change.
