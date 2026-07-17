# Contributing

Thank you for improving `nextjs-boilerplate-kit`. Contributions of code,
documentation, tests, security hardening, and reproducible bug reports are
welcome.

## Before opening an issue

- Search existing issues and discussions.
- Confirm the problem on Node.js 24 and the current `main` branch.
- For generated-app failures, include the complete non-secret generator command.
- Do not post credentials, tokens, connection strings, webhook secrets, or
  private customer data.
- Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Local setup

```bash
git clone https://github.com/Code-Huddle/nextjs-boilerplate-kit.git
cd nextjs-boilerplate-kit
nvm use
npm ci
npm test
```

The repository itself is a Node.js CLI. It copies and composes the files in
`templates/` according to the selections implemented in `bin/index.js`.

## Development workflow

1. Create a focused branch from `main`.
2. Make the smallest coherent change.
3. Add or update generator contract tests.
4. Generate every supported combination.
5. Run the relevant generated-app gates.
6. Update the README, changelog, examples, and notices when behavior or
   provenance changes.
7. Open a pull request using the repository template.

Use clear commit subjects. Conventional Commit prefixes such as `fix:`,
`feat:`, `docs:`, `test:`, and `chore:` are encouraged but not enforced.

## Required checks

```bash
npm test
npm run test:matrix
npm pack --dry-run
```

For changes to dependencies, templates, the generator, or shared configuration,
also run:

```bash
npm run test:matrix:full
```

The full command installs and validates all 12 auth-by-ORM samples. Each sample
must pass type-checking, linting, unit tests, and a production build. Samples
with Storybook must also pass a static Storybook build.

If the full matrix is impractical locally, run the most affected sample and
state exactly what you ran in the pull request. CI remains authoritative.

```bash
node scripts/test-generation-matrix.mjs --sample supabase-prisma
```

## Adding or changing an option

Generator changes are incomplete unless they include:

- an interactive prompt or an explicit reason no prompt is needed;
- a deterministic non-interactive CLI option;
- validation for unsupported values;
- a matrix sample or contract test;
- environment-variable documentation;
- generated README documentation;
- security review of every generated route and secret boundary;
- license/provenance review for copied code or assets.

## Security expectations

- Authenticate and authorize on the server; client UI is not an access control.
- Never trust a user-supplied owner, role, price, amount, customer ID, or return
  URL when the server can derive or configure it.
- Keep secret and service-role keys out of browser bundles.
- Verify webhook signatures against the raw request body.
- Keep generic demo APIs explicitly documented as anonymous, or add and test
  product-appropriate authentication, authorization, and ownership boundaries.
- With Supabase, use `app_metadata` for authorization and pair exposed tables
  with RLS policies.
- Add negative-path tests for security-sensitive behavior.

## Dependency updates

Update versions in the owning template or module manifest, regenerate the
affected lockfile/output, and test the generated combination. Do not update a
version only to make `npm outdated` empty: document compatibility holds when a
newer release does not work with the selected stack.

## Documentation and accessibility

Documentation should use copy-pasteable commands and identify defaults,
required environment variables, and trust boundaries. UI changes should
preserve keyboard access, labels, focus visibility, and useful semantic HTML.

## License and provenance

By submitting a contribution, you agree that it is licensed under this
repository's MIT License and that you have the right to submit it. Identify any
third-party source, license, and substantial copied material in the pull
request. Update `THIRD_PARTY_NOTICES.md` when required.

## Review and conduct

Maintainers may request changes, tests, or a narrower scope before merging.
Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
