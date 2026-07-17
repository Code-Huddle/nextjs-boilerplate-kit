# Changelog

Notable changes are documented here. This project follows Semantic Versioning
for the public CLI and generated-template contract.

## [Unreleased]

No user-facing changes yet.

## [2.3.2] - 2026-07-16

### Changed

- Clarified in the generated Supabase RBAC UI that new accounts receive the
  `user` role, that admins must be promoted through trusted
  `app_metadata.role`, and that refreshed sign-in routes admins to `/admin` and
  other users to `/user`.

## [2.3.1] - 2026-07-16

### Changed

- Made Supabase browser navigation tolerate missing local configuration during
  builds and initial setup while preserving real credentials as a requirement
  for authentication.

## [2.3.0] - 2026-07-16

### Added

- Added session-aware authentication navigation and sign-out behavior for
  NextAuth, Supabase, Supabase RBAC, and no-auth output.
- Added deterministic post-auth redirects: `/dashboard` when the dashboard
  module is selected and `/` otherwise.

### Changed

- Configured GitHub consent and Google account-selection prompts for Auth.js.
- Sent Supabase RBAC users to `/admin` or `/user` according to their trusted
  role claim.
- Improved Prisma 7 connections to managed PostgreSQL providers.
- Updated generated application authorship from the placeholder `Your Team` to
  `Code Huddle`.

## [2.2.1] - 2026-07-16

### Changed

- Removed remaining auth assumptions from generic Stripe client examples and
  aligned the main README with the anonymous demo-API boundary.

## [2.2.0] - 2026-07-16

### Changed

- Made ORM CRUD and email examples generic and anonymous instead of implying
  product-specific authentication or record ownership.
- Simplified example ORM schemas and removed generated demo-only server-auth
  helpers.
- Kept payment trust decisions on the server while leaving application-level
  payment authorization to the generated project's team.

## [2.1.2] - 2026-07-16

### Fixed

- Pinned Nodemailer to the tested `7.0.7` line for generated-project
  compatibility.
- Restored the repository quality-workflow badge.

## [2.1.1] - 2026-07-16

### Changed

- Improved generation-matrix directory handling.

## [2.1.0] - 2026-07-16

### Changed

- Updated interactive authentication, ORM, and payment prompts to Inquirer 14
  `select` prompts.

## [2.0.0] - 2026-07-15

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

- Required Node.js 24 and npm 11.
- Upgraded the generated baseline to Next.js 16, React 19.2, Storybook 10,
  Prisma 7, `@supabase/ssr` 0.12.3, and the tested Stripe SDK line.
- Replaced Supabase role cookies with server-validated `app_metadata` claims.
- Updated GitHub Actions to the Node.js 24 action runtime.

### Removed

- Hard-coded external credentials authentication backend.
- Browser-controlled Stripe customer IDs, amounts, prices, and return URLs.
- Unsupported Supabase auth helpers and cookie-based RBAC.
- Internal-only editor rules and unused integration configuration from generated
  output.

## [1.0.4] - previous documented npm release

Historical release predating the open-source hardening and reproducible matrix.

[Unreleased]: https://github.com/Code-Huddle/nextjs-boilerplate-kit/compare/03da9d8...HEAD
[2.3.2]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/2.3.2
[2.3.1]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/2.3.1
[2.3.0]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/2.3.0
[2.2.1]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/2.2.1
[2.2.0]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/2.2.0
[2.1.2]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/2.1.2
[2.1.1]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/2.1.1
[2.1.0]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/2.1.0
[2.0.0]: https://github.com/Code-Huddle/nextjs-boilerplate-kit/releases/tag/v2.0.0
[1.0.4]: https://www.npmjs.com/package/nextjs-boilerplate-kit/v/1.0.4
