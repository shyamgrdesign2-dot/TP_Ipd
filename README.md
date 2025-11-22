# Pm-Doctor-Portal
Doctor portal website React

## Build tweaks
- Production builds ship without source maps to speed up webpack; set `GENERATE_SOURCEMAP=true` if you need them.
- The ESLint webpack plugin is disabled for all builds to speed up dev/prod (`DISABLE_ESLINT_PLUGIN=true` is set in env, scripts, and Dockerfile); set `DISABLE_ESLINT_PLUGIN=false` when you explicitly want linting.
- For a private map (not referenced in bundle) use `npm run build:release`, which sets `PROD_SOURCEMAP_MODE=hidden` so you can upload maps to Sentry without exposing them publicly.

## Debugging production issues without source maps
- By default prod builds skip source maps; if you need them for a one-off investigation run `npm run build:debug` (enables maps and linting) or set `GENERATE_SOURCEMAP=true` before `npm run build`.
- Keep debuggable bundles off the public CDN once you’re done; they expose original source. Prefer downloading the debug build locally or uploading maps to your error tracker (e.g., sentry-cli in `npm run eject`).
- In production, browser stack traces will point to minified files; reproduce locally with the same env vars, run the debug build, and map stack traces there.
- For Module Federation/remote errors, enable hidden source maps and upload them for both the host and each remote build; otherwise stack traces will only show runtime shims like `__federation__` chunks. Hidden maps keep the public bundle small yet let Sentry symbolize the stacks by release.
