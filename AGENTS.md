# Repository Guidelines

## Project Structure & Module Organization

- `src/` application code
  - `src/main.tsx` app entry; mounts TanStack Router
  - `src/routes/` route components (`__root.tsx`, `index.tsx`)
  - `src/routes/-components/` route-local UI components (keep files small)
  - `src/api/` data fetchers and API adapters (fund/trending/base)
  - `src/libs/` shared utilities (request helpers, constants, small helpers)
  - `src/styles/` Tailwind entry stylesheet (`tailwind.css`)
- `public/` static assets copied as-is
- `dist/` build output (keep out of commits)
- `src/routeTree.gen.ts` generated route tree (treat as read-only)

Path alias: `#/*` maps to `src/*` (see `package.json#imports`).

## Build, Test, and Development Commands

Use Node `22` (see `.nvmrc`) and `pnpm`.

- `pnpm install` install dependencies
- `pnpm dev` run Vite dev server
- `pnpm build` create production build into `dist/`
- `pnpm lint` run ESLint checks
- `pnpm format` auto-fix formatting via ESLint

## Coding Style & Naming Conventions

- TypeScript + React (`.ts`, `.tsx`)
- Indentation: 2 spaces; quotes: single; semicolons required (see `eslint.config.mjs`)
- Imports are auto-sorted; keep groups clean (React, TanStack Router, externals, internals like `#/...`)
- Route files follow TanStack Router conventions (`src/routes/__root.tsx`, `src/routes/index.tsx`)
- Props rules (enforced by convention in this repo)
  - Declare props types as standalone `interface` (e.g. `interface ButtonProps { ... }`)
  - Pass `props` as a single param: `function Button(props: ButtonProps)`
  - Destructure inside the function body: `const { tone, className } = props`
- Tailwind first: prefer utility classnames and keep `className` strings short
- Reused colors live in `tailwind.config.ts` theme tokens

## Testing Guidelines

This repo currently ships without a configured test runner. Add a framework (e.g. Vitest) before adding tests, and keep tests close to modules (e.g. `src/libs/*.test.ts`) to match the import alias setup.

## Commit & Pull Request Guidelines

- Commit messages follow Conventional Commits style seen in history: `feat: ...`, `chore: ...`
- Keep PRs small and scoped; include a short description of user-visible changes and any API changes under `src/api/`
- For UI/route changes, include a screenshot or short clip
- Keep generated/build artifacts out of commits (`src/routeTree.gen.ts`, `dist/`, `node_modules/`)

## Configuration Tips

- Dark mode follows system settings (Tailwind `dark:` variants run via media query). Keep UI readable in both themes.
