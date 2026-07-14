# Security policy

## Supported versions

Security fixes are provided for the latest `2.x` release. Older major versions
are unsupported; upgrade before requesting a backport.

| Version | Supported |
| --- | --- |
| Latest `2.x` | Yes |
| `1.x` and older | No |

## Report a vulnerability privately

Please use [GitHub private vulnerability reporting](https://github.com/Code-Huddle/nextjs-boilerplate-kit/security/advisories/new).
If that is unavailable, email `haris.ahmed@code-huddle.com` with the subject
`nextjs-boilerplate-kit security report`.

Include:

- the affected generator version and options;
- the generated file or route involved;
- reproduction steps or a minimal proof of concept;
- impact and prerequisites;
- any suggested fix or disclosure constraints.

Do not open a public issue before a fix or coordinated disclosure. Do not access
data you do not own, perform denial-of-service testing, or retain credentials or
personal data encountered during research.

We aim to acknowledge complete reports within five business days. Fix and
disclosure timing depends on severity, reproducibility, upstream dependencies,
and release coordination. We do not currently operate a paid bug bounty.

## Scope clarification

The project provides generated starter code, not a hosted service. Reports about
the generator and unmodified generated output are in scope. Vulnerabilities
introduced by an application's later customization or deployment are normally
the responsibility of that application owner, though clear hardening proposals
are still welcome.

## Security baseline for generated apps

Generated code authenticates API routes, verifies Stripe webhooks, keeps Stripe
price/customer decisions server-side, uses server-validated Supabase claims,
and scopes ORM examples to their owner. Application teams must still add their
own authorization policy, rate limits, abuse controls, data classification,
RLS policies, monitoring, backups, and deployment review.
