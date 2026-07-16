# nextjs-boilerplate-kit

[![npm version](https://img.shields.io/npm/v/nextjs-boilerplate-kit.svg)](https://www.npmjs.com/package/nextjs-boilerplate-kit)
[![npm downloads](https://img.shields.io/npm/dm/nextjs-boilerplate-kit.svg)](https://www.npmjs.com/package/nextjs-boilerplate-kit)
[![Node.js 24](https://img.shields.io/badge/Node.js-24%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Generate a secure, modular Next.js 16 and React 19 application with the auth,
database, payments, email, PWA, observability, UI tooling, and deployment pieces
you actually select. Use the interactive wizard locally or deterministic flags
in CI and internal platform tooling.

The project is designed around visible source code and testable combinations.
It is a strong application baseline, not a substitute for product-specific
authorization, threat modeling, content strategy, or production operations.

## Contents

- [Why this generator](#why-this-generator)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [CLI reference](#cli-reference)
- [Common recipes](#common-recipes)
- [What gets generated](#what-gets-generated)
- [Platform baseline](#platform-baseline)
- [Security model](#security-model)
- [Authentication](#authentication)
- [ORM and data access](#orm-and-data-access)
- [Stripe payments](#stripe-payments)
- [Email](#email)
- [SEO and public discoverability](#seo-and-public-discoverability)
- [PWA, Storybook, Docker, and Sentry](#pwa-storybook-docker-and-sentry)
- [Environment variables](#environment-variables)
- [Generated project structure](#generated-project-structure)
- [Generated commands](#generated-commands)
- [Test matrix and quality gates](#test-matrix-and-quality-gates)
- [CI and dependency maintenance](#ci-and-dependency-maintenance)
- [Publishing and release integrity](#publishing-and-release-integrity)
- [Open-source project health](#open-source-project-health)
- [Customization checklist](#customization-checklist)
- [Production checklist](#production-checklist)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License and provenance](#license-and-provenance)

## Why this generator

Most boilerplates make one set of architectural choices and silently couple
features together. `nextjs-boilerplate-kit` composes explicit modules and keeps
authentication independent from database access. That means a team can test
the exact stack it intends to own instead of deleting half of a monolithic
starter after generation.

Core principles:

- **Deterministic:** every interactive decision has a non-interactive option.
- **Security-first:** generated API examples establish a server trust boundary.
- **Composable:** auth, ORM, payments, and optional features are selected
  independently where technically valid.
- **Inspectable:** generated integrations are application code, not a hidden
  hosted abstraction.
- **Tested:** the repository defines all 12 authentication-by-ORM pairs and
  distributes the other major features across that matrix.
- **Current:** the generated baseline targets Node.js 24, Next.js 16, and React
  19.2.
- **Open-source ready:** license, provenance, security reporting, contribution,
  support, governance, issue templates, CI, dependency updates, and provenance
  publishing are included in this repository.

## Requirements

- Node.js 24 or newer
- npm 11 or a compatible package manager
- Git for normal source-control workflows
- Credentials only for the integrations you select

Use the repository version files when contributing:

```bash
nvm use
node --version
npm --version
```

## Quick start

### Interactive wizard

```bash
npx nextjs-boilerplate-kit@latest my-app
cd my-app
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The wizard asks about authentication, role support, ORM, payments, email, dark
mode, dashboard, PWA, Storybook, Docker, and Sentry.

### Secure non-interactive defaults

```bash
npx nextjs-boilerplate-kit@latest my-app --yes
```

`--yes` defaults to NextAuth/Auth.js, no ORM, no payments, no email, dark mode
enabled, and the other optional modules disabled. Options you pass explicitly
override those defaults.

### Fully specified generation

```bash
npx nextjs-boilerplate-kit@latest my-saas --yes \
  --auth supabase \
  --roles true \
  --orm prisma \
  --payments subscriptions \
  --email true \
  --dark-mode true \
  --dashboard true \
  --pwa true \
  --storybook true \
  --docker true \
  --sentry true
```

Boolean flags accept `true`, `false`, `1`, `0`, `yes`, or `no`.

### Generate into the current directory

Run this only in an empty directory:

```bash
mkdir my-app
cd my-app
npx nextjs-boilerplate-kit@latest . --yes --auth none --orm none
```

The generator refuses to overwrite conflicting base-template files.

## CLI reference

```text
npx nextjs-boilerplate-kit [project-name] [options]
```

| Option | Accepted values | `--yes` default | Notes |
| --- | --- | --- | --- |
| `[project-name]` | directory name or `.` | prompts if omitted | Names may contain letters, numbers, `_`, and `-`. |
| `--yes` | flag | off | Disables prompts and supplies documented defaults. |
| `--auth` | `nextauth`, `supabase`, `none` | `nextauth` | `none` still protects generated APIs with a bearer token. |
| `--roles` | boolean | `false` | Applies only to Supabase; roles come from `app_metadata`. |
| `--orm` | `none`, `drizzle`, `prisma`, `mongoose` | `none` | Independent of authentication. |
| `--payments` | `none`, `one-time`, `subscriptions` | `none` | Uses Stripe Checkout and signed webhooks. |
| `--email` | boolean | `false` | Adds protected Nodemailer/SMTP example code. |
| `--dark-mode` | boolean | `true` | Adds theme support and the UI toggle. |
| `--dashboard` | boolean | `false` | Adds dashboard example UI. |
| `--pwa` | boolean | `false` | Adds service-worker registration and an install prompt. |
| `--storybook` | boolean | `false` | Adds Storybook 10 configuration and stories. |
| `--docker` | boolean | `false` | Adds Node.js 24 multi-stage container files. |
| `--sentry` | boolean | `false` | Adds Sentry client/server/edge configuration. |

Unsupported enum or boolean values fail generation instead of silently falling
back to another choice.

## Common recipes

### Auth.js application with PostgreSQL and subscriptions

```bash
npx nextjs-boilerplate-kit@latest app --yes \
  --auth nextauth \
  --orm drizzle \
  --payments subscriptions \
  --sentry true
```

### Supabase RBAC application

```bash
npx nextjs-boilerplate-kit@latest app --yes \
  --auth supabase \
  --roles true \
  --orm prisma \
  --payments none
```

### Token-protected API starter with MongoDB

```bash
npx nextjs-boilerplate-kit@latest service --yes \
  --auth none \
  --orm mongoose \
  --email true \
  --dark-mode false
```

### Frontend/PWA prototype with Storybook

```bash
npx nextjs-boilerplate-kit@latest prototype --yes \
  --auth none \
  --orm none \
  --pwa true \
  --storybook true
```

### One-time Stripe checkout

```bash
npx nextjs-boilerplate-kit@latest store --yes \
  --auth nextauth \
  --orm prisma \
  --payments one-time
```

## What gets generated

Every application starts with:

- Next.js App Router and React Server Components;
- strict TypeScript;
- React 19.2;
- Tailwind CSS 4 and reusable UI primitives;
- next-intl English/French routing baseline;
- typed environment variables through T3 Env and Zod;
- React Query, React Hook Form, Zustand, and common UI utilities;
- ESLint, Vitest, Testing Library, and Playwright configuration;
- metadata, canonical URLs, hreflang, robots, sitemap, JSON-LD, social cards,
  web manifest, and `llms.txt` discovery files;
- security headers that are safe across the selectable integrations;
- MIT license and third-party notices;
- a generated-project README and `.env.example`.

Selected modules are overlaid onto the base template and their package
dependencies, scripts, and unique environment variables are merged into the
result.

## Platform baseline

Important generated versions at the `2.0.0` baseline:

| Area | Baseline |
| --- | --- |
| Runtime | Node.js `>=24`, npm `>=11` |
| Framework | Next.js `^16.2.10` |
| UI runtime | React and React DOM `19.2.7` |
| Language | TypeScript `^5.9.3` |
| Styling | Tailwind CSS `^4.0.0` |
| Unit tests | Vitest `^4.1.10` |
| Browser tests | Playwright `^1.61.1` |
| Component workshop | Storybook `^10.5.0` when selected |
| Supabase | `@supabase/ssr ^0.12.3`, `@supabase/supabase-js ^2.110.5` |
| Stripe | `stripe ^22.3.1` and matching current client bindings |
| Prisma | Prisma and `@prisma/client ^7.8.0` |
| Drizzle | `drizzle-orm ^0.45.2` |
| MongoDB | Mongoose `^9.7.4` |
| Observability | Sentry `^10.65.0` when selected |

Generated npm configuration is prepared for npm's deny-by-default dependency
lifecycle-script policy. Reviewed install-time build packages are recorded in
the `allowScripts` field with exact versions; npm 12 will block an unexpected
new script, while current npm 11 surfaces it for review. Update that allowlist
deliberately whenever dependencies change.

Versions are deliberately pinned in template manifests so output is
reproducible. A newer package existing on npm does not automatically mean it is
compatible with the full selected stack. In particular, TypeScript 5.9 and
Recharts 2.15 remain intentional compatibility holds until their next lines
pass every generated quality gate.

## Security model

The generator establishes these default trust boundaries:

1. A browser is untrusted.
2. Authentication is resolved on the server.
3. Data ownership is derived from the authenticated principal, not a request
   body field.
4. Authorization roles are read from trusted server claims, not editable
   profile metadata or cookies.
5. Payment price/customer/redirect decisions remain on the server.
6. Webhooks are trusted only after signature verification against the raw body.
7. Secrets are server-only unless a provider explicitly defines a publishable
   browser key.

Generated data, payment, and email API examples call `requireApiUser`. The
expected exceptions are OAuth/Auth.js callback routes and Stripe webhook routes,
which authenticate through their protocols and signature boundary.

This baseline does **not** automatically provide rate limiting, bot protection,
organization-level permissions, audit retention, regulatory compliance,
application-specific RLS, backups, WAF configuration, or incident response.
Those depend on the product and deployment.

See [SECURITY.md](SECURITY.md) for vulnerability reporting and supported
versions.

## Authentication

### NextAuth/Auth.js

The NextAuth selection uses server sessions and configured GitHub/Google OAuth
providers. It does not include the former hard-coded external credentials
backend.

Required setup:

1. Generate a strong `AUTH_SECRET`.
2. Configure at least one OAuth application.
3. Set the provider callback URL for each environment.
4. Remove any provider you do not intend to support.
5. Review session lifetime and account-linking behavior for your product.

### Supabase SSR

The Supabase selection uses `@supabase/ssr` with browser and server clients,
cookie `getAll`/`setAll`, and a Next.js proxy that refreshes and validates auth
claims. Use the project's publishable key in the browser; never expose a secret
or service-role key through `NEXT_PUBLIC_*`.

The roles option reads `claims.app_metadata.role`. Assign that value only from a
trusted admin process. Users can edit `user_metadata`, so it is intentionally
excluded from authorization.

Before production:

- enable RLS on every table exposed through the Supabase Data API;
- write ownership and role policies for the actual schema;
- use both `USING` and `WITH CHECK` for owner-scoped updates;
- remember that app metadata in an existing JWT may remain stale until refresh;
- avoid ISR or shared caching on authenticated responses that can set cookies;
- configure provider redirect URLs and email templates per environment.

### No UI authentication

`--auth none` means no user sign-in UI. It does **not** make generated APIs
public. API routes require:

```http
Authorization: Bearer <API_ACCESS_TOKEN>
```

The comparison is timing-safe. Generate a long random token, store it as a
server secret, rotate it per environment, and replace this single-token model
if you need per-client identity, revocation, or fine-grained permissions.

## ORM and data access

Authentication and ORM are independent selections.

| ORM | Database | Generated baseline |
| --- | --- | --- |
| None | none selected | API trust boundary still exists; add your own data layer. |
| Drizzle | PostgreSQL | typed schema/client and owner-scoped user examples |
| Prisma | PostgreSQL | Prisma 7 config, PostgreSQL adapter, schema/client, owner-scoped examples |
| Mongoose | MongoDB | connection/model code and owner-scoped examples |

The CRUD routes derive `ownerId` from `requireApiUser`. A caller cannot choose a
different owner by posting an ID. These are examples, not a complete domain
model: define unique constraints, validation, migrations, pagination, deletion
policy, tenant boundaries, and indexes for the actual product.

After choosing Prisma, `npm install` runs `prisma generate`. Configure
`DATABASE_URL` before database operations. For Drizzle and Prisma, create and
review migrations rather than allowing production schema drift. For Mongoose,
review connection pooling and indexes for the deployment runtime.

## Stripe payments

Both payment modules use Stripe Checkout.

### One-time payments

The server reads `STRIPE_ONE_TIME_PRICE_ID`. The browser cannot post an amount,
currency, customer ID, or success/cancel URL.

### Subscriptions

The browser may select only the supported plan identifier (`monthly` or
`yearly`). The server maps that identifier to `STRIPE_PRICE_ID_MONTHLY` or
`STRIPE_PRICE_ID_YEARLY`.

### Webhooks

The webhook route reads the raw request body and calls
`stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`. Configure a
separate endpoint secret per environment.

For local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The generated handler acknowledges verified events and provides a safe place to
add idempotent fulfillment. Before selling anything, persist processed event
IDs, implement entitlement state, handle retries/out-of-order events, decide
which event types are authoritative, and test with Stripe test clocks or test
mode as appropriate.

## Email

The optional email module uses Nodemailer and SMTP. Its API route is protected by
the selected authentication strategy. With token auth, the recipient remains
server-controlled through `EMAIL_TEST_RECIPIENT`; arbitrary browser recipients
are not accepted by the starter endpoint.

Before production, add template-specific validation, unsubscribe/compliance
behavior where applicable, delivery-event handling, rate limits, and provider
domain authentication such as SPF, DKIM, and DMARC.

## SEO and public discoverability

Generated projects include a technically complete discovery baseline:

- centralized public app name, description, URL, author, keywords, and optional
  social handle;
- canonical URL and localized `hreflang` alternates;
- index/follow directives plus Google preview controls;
- Open Graph and Twitter card metadata;
- a dynamic 1200×630 social image using Next.js `ImageResponse`;
- localized `sitemap.xml` entries;
- `robots.txt` that permits public content and excludes API/private starter
  routes;
- web manifest and theme viewport metadata;
- `WebSite` and `WebApplication` JSON-LD;
- semantic headings in the starter UI;
- `public/llms.txt` as a concise AI-crawler information surface;
- AVIF/WebP image output and response compression.

Customize these before deploying:

```text
.env.local
src/utils/AppConfig.ts
src/app/[locale]/(main)/page.tsx
src/app/sitemap.ts
src/app/robots.ts
src/app/opengraph-image.tsx
public/llms.txt
public/favicon.ico
public/favicon-16x16.png
public/favicon-32x32.png
public/apple-touch-icon.png
src/locales/*.json
```

Set `NEXT_PUBLIC_APP_URL` to the final HTTPS origin. A localhost canonical URL
in production prevents correct canonical, sitemap, structured-data, and social
URL output.

Technical metadata alone does not guarantee search ranking or inclusion by an
AI system. Publish original useful content, make public pages internally
linkable, preserve semantic HTML/accessibility, earn reputable references,
maintain Core Web Vitals, avoid duplicate/thin pages, and verify the site in
Google Search Console and Bing Webmaster Tools. Validate structured data and
social previews after deployment. Update `llms.txt` with factual public
documentation; never put private instructions or secrets in it.

## PWA, Storybook, Docker, and Sentry

### PWA

The base includes a dynamic web manifest. Selecting PWA adds service-worker
registration, a small offline app-shell cache, a manifest icon, and an install
prompt. Review caching rules before caching authenticated or rapidly changing
content. Bump the cache name when changing offline assets.

### Storybook

Storybook 10 is merged without replacing the generated package manifest.

```bash
npm run storybook
npm run storybook:build
npm run storybook:serve
```

### Docker

The Docker module uses Node.js 24 and a multi-stage production build. Do not bake
runtime secrets into image layers. Supply them at deployment, run as the
non-root image user, and scan/pin the final image according to your platform's
supply-chain policy.

### Sentry

The Sentry module includes client, server, edge, and Next.js instrumentation.
Use a public DSN only where intended. Keep `SENTRY_AUTH_TOKEN` server/CI-only,
scope it minimally, and review data scrubbing before capturing production user
traffic.

## Environment variables

The generator merges only variables needed by selected modules into
`.env.example`. Copy it to `.env.local`; never commit real values.

### Core

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NODE_ENV` | shared | runtime mode |
| `NEXT_PUBLIC_APP_NAME` | browser/public | site and social name |
| `NEXT_PUBLIC_APP_DESCRIPTION` | browser/public | default description and structured data |
| `NEXT_PUBLIC_APP_URL` | browser/public | canonical HTTPS origin |
| `NEXT_PUBLIC_API_URL` | browser/public | public API base when used by client code |
| `NEXT_PUBLIC_TWITTER_HANDLE` | browser/public | optional `@handle` for card attribution |
| `NEXT_PUBLIC_GA_ID` | browser/public | optional analytics ID; integration is not enabled automatically |
| `API_ACCESS_TOKEN` | server secret | bearer token for `auth=none` API requests |

### Auth.js

| Variable | Exposure |
| --- | --- |
| `AUTH_SECRET` | server secret |
| `AUTH_TRUST_HOST` | server configuration |
| `AUTH_GITHUB_ID`, `AUTH_GOOGLE_ID` | server configuration |
| `AUTH_GITHUB_SECRET`, `AUTH_GOOGLE_SECRET` | server secrets |

### Supabase

| Variable | Exposure |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | browser/public project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | browser-safe publishable key |

No service-role/secret Supabase key is generated into browser configuration.

### Databases

| Variable | Module | Exposure |
| --- | --- | --- |
| `DATABASE_URL` | Drizzle or Prisma | server secret |
| `MONGODB_URI` | Mongoose | server secret |

### Stripe

| Variable | Exposure |
| --- | --- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | browser/public |
| `STRIPE_SECRET_KEY` | server secret |
| `STRIPE_WEBHOOK_SECRET` | server secret |
| `STRIPE_ONE_TIME_PRICE_ID` | server configuration |
| `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY` | server configuration |
| `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL` | server configuration |
| `STRIPE_CURRENCY` | server configuration |

### Email

`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`,
and optional `EMAIL_TEST_RECIPIENT` are server-side email configuration.

### Sentry

`NEXT_PUBLIC_SENTRY_DSN` is intentionally browser-visible. `SENTRY_ORG`,
`SENTRY_PROJECT`, and especially `SENTRY_AUTH_TOKEN` belong in trusted build or
server configuration.

## Generated project structure

Exact files depend on selected modules. The shared shape is:

```text
my-app/
├── .env.example
├── LICENSE
├── THIRD_PARTY_NOTICES.md
├── README.md
├── next.config.ts
├── package.json
├── public/
│   ├── llms.txt
│   └── favicons
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   ├── api/
│   │   ├── manifest.ts
│   │   ├── opengraph-image.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   └── twitter-image.tsx
│   ├── components/
│   ├── libs/
│   ├── locales/
│   ├── templates/
│   ├── utils/
│   └── validations/
├── tests/
├── tsconfig.json
└── vitest.config.mts
```

Depending on choices, generation also adds `auth.ts`, `src/proxy.ts`, database
schema/client files, Prisma config/schema, Stripe route handlers, Storybook
configuration, Sentry configuration, service-worker assets, and Docker files.

## Generated commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | start the Next.js development server |
| `npm run build` | create a production build |
| `npm start` | serve the production build |
| `npm run check-types` | strict TypeScript check without output |
| `npm run lint` | lint the complete generated project |
| `npm run lint:fix` | apply safe lint fixes |
| `npm test` | run unit/component tests once |
| `npm run test:e2e` | run Playwright tests |
| `npm run clean` | remove Next.js, coverage, and output artifacts |
| `npm run build-stats` | run a bundle-analyzed production build |
| `npm run generate:component` | use the included component generator |

Prisma adds `postinstall: prisma generate`. Storybook adds its own commands as
described above.

## Test matrix and quality gates

The repository models the Cartesian product of three auth modes and four ORM
modes: 12 base combinations. Payments, PWA, Sentry, Storybook, and Supabase RBAC
are distributed across those samples so every value is exercised without
pretending that 2,304 exhaustive feature permutations are practical on every
commit.

| Sample | RBAC | Payments | PWA | Sentry | Storybook |
| --- | ---: | --- | ---: | ---: | ---: |
| `none-none` | no | none | yes | yes | yes |
| `none-drizzle` | no | one-time | no | no | yes |
| `none-prisma` | no | subscriptions | yes | no | no |
| `none-mongoose` | no | none | no | yes | no |
| `nextauth-none` | no | one-time | yes | no | yes |
| `nextauth-drizzle` | no | subscriptions | no | no | yes |
| `nextauth-prisma` | no | none | yes | yes | no |
| `nextauth-mongoose` | no | one-time | no | no | no |
| `supabase-none` | no | subscriptions | yes | no | yes |
| `supabase-drizzle` | yes | none | no | yes | yes |
| `supabase-prisma` | no | one-time | yes | no | no |
| `supabase-mongoose` | yes | subscriptions | no | no | no |

Repository commands:

```bash
npm test
npm run test:matrix
npm run test:matrix:full
node scripts/test-generation-matrix.mjs --sample supabase-drizzle
```

- `npm test` checks matrix coverage, deterministic generation, dependency
  baselines, licensing output, and security-sensitive static contracts.
- `npm run test:matrix` generates all samples without installing them.
- `npm run test:matrix:full` generates each sample, installs dependencies, and
  runs type-check, lint, unit tests, and production build. Storybook samples also
  run `storybook:build`.
- `--sample` runs the full install/gate sequence for one named sample.

## CI and dependency maintenance

GitHub Actions runs generator tests and a fail-independent 12-job generated
matrix on Node.js 24 for pushes to `main` and pull requests. Dependabot checks
npm and GitHub Actions monthly. Action workflows use the current Node.js 24
runtime lines (`actions/checkout@v6` and `actions/setup-node@v6`).

Dependency pull requests must be evaluated on generated output. Passing the CLI
unit tests alone is insufficient for framework, TypeScript, auth, ORM, Stripe,
Storybook, or build-tool updates.

## Publishing and release integrity

The package is configured for public npm access and includes only the CLI,
templates, README, changelog, security policy, license, and third-party notices.
The release workflow publishes only after a GitHub Release is created from a
`v*` tag. It checks that the tag equals `package.json`, runs tests and generation,
inspects the package dry run, and publishes through npm trusted publishing with
provenance.

Maintainers must complete the one-time npm trusted-publisher and GitHub
environment setup described in [RELEASING.md](RELEASING.md). The workflow is not
proof of that external configuration until the first release succeeds.

Pre-release verification:

```bash
npm ci
npm test
npm run test:matrix:full
npm pack --dry-run
```

## Open-source project health

This repository includes:

- [MIT License](LICENSE)
- [third-party provenance notices](THIRD_PARTY_NOTICES.md)
- [contribution guide](CONTRIBUTING.md)
- [code of conduct](CODE_OF_CONDUCT.md)
- [security policy and private reporting](SECURITY.md)
- [support policy](SUPPORT.md)
- [governance and maintainers](GOVERNANCE.md)
- [changelog](CHANGELOG.md)
- [release runbook](RELEASING.md)
- bug and feature issue forms;
- pull-request checklist;
- Dependabot configuration;
- quality and provenance-publishing workflows.

Repository administrators should still configure these GitHub settings before
announcing the project:

1. Make the repository public and verify no internal issues, Actions logs,
   branches, releases, packages, secrets, or commit history expose confidential
   information.
2. Enable branch protection/rulesets and require both quality jobs.
3. Enable private vulnerability reporting and secret scanning.
4. Enable Discussions if `SUPPORT.md` should route users there.
5. Configure the `npm` environment and npm trusted publisher.
6. Add a concise GitHub description, website, and topics such as `nextjs`,
   `react`, `typescript`, `boilerplate`, `generator`, `supabase`, `stripe`,
   `prisma`, and `storybook`.
7. Upload a 1280×640 repository social-preview image.
8. Create the `v2.0.0` release notes from the changelog only after the full
   matrix passes on the release commit.

## Customization checklist

Immediately after generation:

- [ ] Set the app name, description, canonical URL, author, keywords, and social
  profiles.
- [ ] Replace starter favicons and inspect the generated social image.
- [ ] Replace demo homepage copy, Code Huddle links, example translations, and
  placeholder `llms.txt` content.
- [ ] Remove unused locales and update sitemap/hreflang output.
- [ ] Configure only the selected integration credentials.
- [ ] Delete demo routes/components not relevant to the product.
- [ ] Define the domain model and application-specific authorization policy.
- [ ] Add RLS when Supabase exposes database tables.
- [ ] Add legal pages and consent behavior required by your product and region.
- [ ] Add real unit, integration, and end-to-end tests.

Search for starter values before deployment:

```bash
rg -n "Your App|Your Team|example.com|your-|replace-with|FIXME|TODO" . \
  -g '!node_modules' -g '!.next'
```

## Production checklist

- [ ] `npm ci`, type-check, lint, unit tests, E2E tests, and production build pass
  in a clean environment.
- [ ] Every secret is managed by the deployment platform and has been rotated
  if it ever appeared in source, chat, logs, screenshots, or build artifacts.
- [ ] API authorization, object ownership, tenant isolation, validation, rate
  limits, and abuse controls match the real product.
- [ ] Database migrations, indexes, backups, restore tests, retention, and least
  privilege are defined.
- [ ] Supabase RLS/policies and JWT-role refresh behavior are tested, if used.
- [ ] Stripe webhook idempotency, fulfillment, refunds, disputes, subscription
  lifecycle, and environment-specific endpoint secrets are tested, if used.
- [ ] OAuth callback URLs, email sender authentication, and Sentry scrubbing are
  correct for every environment.
- [ ] Authenticated responses are not cached publicly.
- [ ] Canonical URLs, robots, sitemap, social cards, structured data, and public
  content have been validated against the deployed HTTPS origin.
- [ ] Accessibility, performance budgets, logs, alerts, uptime checks, incident
  ownership, and rollback procedures are in place.
- [ ] Dependency/license inventory and software-composition scanning are part of
  release operations.
- [ ] `npm approve-scripts --allow-scripts-pending --json` reports no unreviewed
  dependency lifecycle scripts.

## Troubleshooting

### The target directory already exists

Choose another name, remove the empty directory yourself, or use `.` inside a
new empty directory. The generator intentionally does not delete or overwrite
an existing project.

### Generation is prompting in CI

Pass `--yes`. Supply every choice explicitly if the configuration itself is an
artifact that should remain stable across future default changes.

### `npm install` rejects the runtime

Use Node.js 24+ and npm 11+. Check `node --version`, `npm --version`, `.nvmrc`,
and any CI/container runtime pin.

### The build fails because of environment variables

Copy `.env.example` to `.env.local` and replace values required by the selected
modules. Public placeholder strings are examples, not functional provider
credentials. For a CI build, inject test-safe values through the CI secret and
environment system.

### Supabase keeps redirecting or has no session

Confirm the project URL/publishable key, configured redirect URL, cookie domain,
HTTPS settings, and that `src/proxy.ts` is present. Do not replace server
`getClaims()` protection with `getSession()` or an unverified cookie value.

### Supabase role changes are not visible immediately

`app_metadata` is carried in the access token. Refresh/reissue the user's token
after a trusted role change, and design sensitive authorization with that
staleness window in mind.

### Stripe Checkout fails

Check that the configured price IDs belong to the same Stripe mode/account as
the secret key. Verify server URLs and inspect Stripe request logs. For webhook
errors, use the signing secret emitted for the exact endpoint/listener; the API
secret key is not a webhook secret.

### Social preview shows old content

Deploy with the final `NEXT_PUBLIC_APP_URL`, inspect `/opengraph-image`, and ask
the relevant social platform debugger to re-scrape the canonical URL. Social
caches may outlive a deployment.

### A matrix sample fails locally but not in CI

Remove the generated `.matrix/<sample>` directory, confirm Node/npm versions,
and rerun the named sample. The matrix script recreates its target. Compare
platform-specific native dependencies and include the complete first failure in
an issue.

## FAQ

### Is this production-ready?

It is a tested production-oriented starter with deliberate security boundaries.
No generic starter is production-ready for an unknown business by itself. Your
team still owns domain authorization, data policy, deployment, observability,
performance, compliance, and incident response.

### Does it guarantee SEO rankings or AI visibility?

No. It generates strong technical discovery primitives. Rankings and inclusion
depend on crawlable original content, authority, links, user value, performance,
indexing policy, and search/AI platform decisions outside this repository.

### Can auth and ORM be mixed freely?

Yes. The matrix tests all three auth modes against all four ORM choices. Your
domain schema and provider-specific user linkage remain application decisions.

### Why are APIs protected when auth is `none`?

Because “no sign-in UI” should not silently create public mutation endpoints.
The bearer token provides a minimal server boundary until you implement the
identity model you need.

### Why isn't every possible feature permutation installed in CI?

The complete boolean/product space is too large for every change. The matrix
covers every auth-by-ORM pair and both values of the major optional features,
while security contract tests inspect all route templates. Release-impacting
changes should run extra targeted combinations when interactions warrant it.

### Can I use pnpm, Yarn, or Bun?

The generated source may work with them, but the committed release and CI
contract is Node.js 24 with npm 11. If another package manager matters to your
team, generate and commit its lockfile only after running the complete gates.

### Why is `@supabase/ssr` still a `0.x` package?

It is Supabase's recommended SSR package but its API remains pre-1.0. The
template uses the current `getAll`/`setAll` client shape and pins the tested
line. Dependabot updates must still pass Supabase samples.

### Can I publish a generated app under another license?

The generator and inherited template code are MIT licensed, allowing broad use
subject to preservation of the required copyright/license notice in substantial
copies. Keep `LICENSE` and `THIRD_PARTY_NOTICES.md`, and review licenses of every
dependency and any assets/code you add. This is not legal advice.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. For help,
see [SUPPORT.md](SUPPORT.md). Participation is governed by
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Useful repository commands:

```bash
npm ci
npm test
npm run test:matrix
npm run test:matrix:full
npm pack --dry-run
```

## License and provenance

`nextjs-boilerplate-kit` is distributed under the [MIT License](LICENSE).

Portions are derived from
[ixartz/Next-js-Boilerplate](https://github.com/ixartz/Next-js-Boilerplate).
The upstream copyright and complete MIT permission/warranty notice are retained
in `LICENSE`. Additional attribution and dependency guidance are in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Contributors must identify copied code/assets and compatible licensing in their
pull requests. Dependency packages retain their own licenses; an application
owner should generate and review a dependency license/SBOM inventory for the
exact generated combination it deploys.

Copyright © 2025–2026 Code Huddle contributors.
