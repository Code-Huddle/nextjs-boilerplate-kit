# Changelog

Notable changes are documented here. This project follows Semantic Versioning
for the public CLI and generated-template contract.

## [Unreleased]

### Added

- Open-source governance, contribution, conduct, support, security, and release
  documentation.
- Deterministic generator flags and a 12-sample auth-by-ORM quality matrix.
- Verified Stripe webhook routes and server-owned checkout configuration.
- Generated SEO metadata, social images, sitemap, robots rules, web manifest,
  JSON-LD, and `llms.txt` discovery baseline.
- npm trusted-publishing release workflow with provenance.
- Strict, version-pinned npm dependency lifecycle-script approvals.
- Publish-safe restoration of generated `.gitignore` and `.npmrc` files.

### Changed

- Requires Node.js 24 and npm 11.
- Updated the current Supabase SSR package line to `0.12.3`.
- Upgraded the generated baseline to Next.js 16, React 19.2, Storybook 10,
  Prisma 7, current Supabase SSR architecture, and the current tested Stripe
  SDK line.
- Replaced Supabase role cookies with server-validated `app_metadata` claims.
- Scoped generated ORM examples to the authenticated owner.
- Updated GitHub Actions to the current Node 24 action runtime.

### Removed

- Hard-coded external credentials authentication backend.
- Browser-controlled Stripe customer IDs, amounts, prices, and return URLs.
- Unsupported Supabase auth helpers and cookie-based RBAC.
- Internal-only editor rules and unused integration configuration from generated
  output.

## [1.0.4] - previous npm release

Historical release predating the open-source hardening and reproducible matrix.

[Unreleased]: https://github.com/Code-Huddle/nextjs-boilerplate-kit/compare/v1.0.4...HEAD
[1.0.4]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/1.0.4
