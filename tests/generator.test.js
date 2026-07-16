import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { matrix } from '../scripts/matrix-config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('matrix covers every auth and ORM pair plus all feature values', () => {
  assert.equal(matrix.length, 12);
  for (const auth of ['none', 'nextauth', 'supabase']) {
    for (const orm of ['none', 'drizzle', 'prisma', 'mongoose']) {
      assert.ok(matrix.some(sample => sample.auth === auth && sample.orm === orm));
    }
  }
  assert.deepEqual(new Set(matrix.map(sample => sample.payments)), new Set(['none', 'one-time', 'subscriptions']));
  for (const key of ['pwa', 'sentry', 'storybook']) {
    assert.deepEqual(new Set(matrix.map(sample => sample[key])), new Set([true, false]));
  }
});

test('all matrix combinations generate non-interactively', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'boilerplate-matrix-'));
  try {
    for (const sample of matrix) {
      const result = spawnSync(process.execPath, [
        path.join(root, 'bin/index.js'), sample.id, '--yes',
        '--auth', sample.auth, '--roles', String(sample.roles), '--orm', sample.orm,
        '--payments', sample.payments, '--pwa', String(sample.pwa),
        '--sentry', String(sample.sentry), '--storybook', String(sample.storybook),
      ], { cwd, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr || result.stdout);

      const project = path.join(cwd, sample.id);
      const pkg = JSON.parse(readFileSync(path.join(project, 'package.json'), 'utf8'));
      assert.equal(pkg.engines.node, '>=24.0.0');
      assert.equal(pkg.dependencies.next, '^16.2.10');
      assert.equal(pkg.dependencies.react, '19.2.7');
      assert.equal(pkg.packageManager, 'npm@11.18.0');
      assert.equal(pkg.allowScripts['sharp@0.34.5'], true);
      assert.equal(pkg.allowScripts['@prisma/engines@7.8.0'], true);
      assert.ok(existsSync(path.join(project, '.gitignore')));
      assert.ok(existsSync(path.join(project, '.npmrc')));
      assert.ok(!existsSync(path.join(project, 'gitignore.template')));
      assert.ok(!existsSync(path.join(project, 'npmrc.template')));
      assert.ok(!existsSync(path.join(project, 'public/assets/images')));
      assert.ok(!existsSync(path.join(project, 'public/icon-200.jpeg')));
      assert.ok(readFileSync(path.join(project, 'LICENSE'), 'utf8').includes('MIT License'));
      assert.ok(readFileSync(path.join(project, 'src/app/robots.ts'), 'utf8').includes("'/api/'"));
      assert.ok(readFileSync(path.join(project, 'src/app/sitemap.ts'), 'utf8').includes('AppConfig.locales'));
      assert.ok(readFileSync(path.join(project, 'src/app/manifest.ts'), 'utf8').includes('MetadataRoute.Manifest'));
      assert.ok(readFileSync(path.join(project, 'src/app/opengraph-image.tsx'), 'utf8').includes('ImageResponse'));
      assert.ok(readFileSync(path.join(project, 'src/components/JsonLd.tsx'), 'utf8').includes('application/ld+json'));
      assert.ok(readFileSync(path.join(project, 'public/llms.txt'), 'utf8').includes('Guidance for automated systems'));
      assert.ok(!readFileSync(path.join(project, 'src/components/Seo.tsx'), 'utf8').includes('@yourtwitterhandle'));
      assert.ok(readFileSync(path.join(project, 'src/proxy.ts'), 'utf8').includes('opengraph-image|twitter-image'));
      assert.ok(!existsSync(path.join(project, 'public/images/og-image.jpg')));
      if (sample.sentry) {
        const nextConfigPath = path.join(project, 'next.config.ts');
        const nextConfig = readFileSync(nextConfigPath, 'utf8');
        assert.ok(nextConfig.includes('export default withSentryConfig(bundleAnalyzer('));
        assert.ok(nextConfig.trimEnd().endsWith(', sentryOptions);'));
        assert.ok(!nextConfig.includes('}], sentryOptions);'));
        const syntax = spawnSync(process.execPath, ['--check', nextConfigPath], { encoding: 'utf8' });
        assert.equal(syntax.status, 0, syntax.stderr || syntax.stdout);
      }
      if (sample.storybook) assert.equal(pkg.devDependencies.storybook, '^10.5.0');
      if (sample.auth === 'supabase') assert.equal(pkg.dependencies['@supabase/ssr'], '^0.12.3');
      if (sample.orm === 'prisma') assert.equal(pkg.dependencies['@prisma/client'], '^7.8.0');
      if (sample.payments !== 'none') {
        const webhook = readFileSync(path.join(project, 'src/app/api/stripe/webhook/route.ts'), 'utf8');
        assert.ok(webhook.includes('constructEvent'));
      }
    }
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('package is ready for public, documented, provenance-aware releases', () => {
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.license, 'MIT');
  assert.equal(pkg.publishConfig.access, 'public');
  assert.equal(pkg.engines.node, '>=24.0.0');
  assert.equal(pkg.packageManager, 'npm@11.18.0');
  assert.match(pkg.repository.url, /Code-Huddle\/nextjs-boilerplate-kit/);

  for (const file of [
    'README.md',
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    'SECURITY.md',
    'SUPPORT.md',
    'GOVERNANCE.md',
    'CHANGELOG.md',
    'RELEASING.md',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/dependabot.yml',
    '.github/workflows/quality.yml',
    '.github/workflows/release.yml',
  ]) {
    assert.ok(existsSync(path.join(root, file)), `Missing open-source release file: ${file}`);
  }
});

test('local documentation links resolve', () => {
  for (const file of [
    'README.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    'SUPPORT.md',
    'GOVERNANCE.md',
    'RELEASING.md',
    'THIRD_PARTY_NOTICES.md',
    'templates/base/README.md',
    'templates/base/THIRD_PARTY_NOTICES.md',
  ]) {
    const absolute = path.join(root, file);
    const markdown = readFileSync(absolute, 'utf8');
    for (const match of markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const href = match[1];
      if (/^(?:https?:|mailto:|#)/.test(href)) continue;
      const relative = href.split('#')[0];
      assert.ok(existsSync(path.resolve(path.dirname(absolute), relative)), `Broken local link in ${file}: ${href}`);
    }
  }
});

test('security-sensitive templates keep server-side trust boundaries', () => {
  const template = (...parts) => path.join(root, 'templates', ...parts);
  const drizzleUsers = readFileSync(template('modules', 'orm-drizzle', 'src', 'app', 'api', 'users', 'route.ts'), 'utf8');
  const drizzleSchema = readFileSync(template('modules', 'orm-drizzle', 'src', 'lib', 'schema.ts'), 'utf8');
  assert.ok(!drizzleUsers.includes('requireApiUser'));
  assert.ok(!drizzleUsers.includes('ownerId'));
  assert.ok(!drizzleSchema.includes('ownerId'));

  const prismaUsers = readFileSync(template('modules', 'orm-prisma', 'src', 'app', 'api', 'users', 'route.ts'), 'utf8');
  const prismaUserById = readFileSync(template('modules', 'orm-prisma', 'src', 'app', 'api', 'users', '[id]', 'route.ts'), 'utf8');
  const prismaSchema = readFileSync(template('modules', 'orm-prisma', 'prisma', 'schema.prisma'), 'utf8');
  assert.ok(!prismaUsers.includes('requireApiUser'));
  assert.ok(!prismaUsers.includes('ownerId'));
  assert.ok(!prismaUserById.includes('ownerId'));
  assert.ok(!prismaSchema.includes('ownerId'));

  const mongooseUsers = readFileSync(template('modules', 'orm-mongoose', 'src', 'app', 'api', 'users', 'route.ts'), 'utf8');
  const mongooseUserById = readFileSync(template('modules', 'orm-mongoose', 'src', 'app', 'api', 'users', '[id]', 'route.ts'), 'utf8');
  const mongooseModel = readFileSync(template('modules', 'orm-mongoose', 'src', 'models', 'User.ts'), 'utf8');
  assert.ok(!mongooseUsers.includes('requireApiUser'));
  assert.ok(!mongooseUsers.includes('ownerId'));
  assert.ok(!mongooseUserById.includes('ownerId'));
  assert.ok(!mongooseModel.includes('ownerId'));

  const emailRoute = readFileSync(template('modules', 'nodemailer-email', 'src', 'app', 'api', 'email', 'send', 'route.ts'), 'utf8');
  assert.ok(!emailRoute.includes('requireApiUser'));
  assert.ok(emailRoute.includes('EMAIL_TEST_RECIPIENT'));

  const oneTime = readFileSync(template('modules', 'stripe-one-time', 'src', 'app', 'api', 'stripe', 'route.ts'), 'utf8');
  assert.ok(oneTime.includes('STRIPE_ONE_TIME_PRICE_ID'));
  assert.ok(!oneTime.includes('request.json()'));
  assert.ok(!oneTime.includes('customerId'));

  const subscriptions = readFileSync(template('modules', 'stripe-subscriptions', 'src', 'app', 'api', 'stripe', 'route.ts'), 'utf8');
  assert.ok(subscriptions.includes("plan?: 'monthly' | 'yearly'"));
  assert.ok(subscriptions.includes('sessionId?: string'));
  assert.ok(!subscriptions.includes('requireApiUser'));
  assert.ok(!subscriptions.includes('amount?:'));
  assert.ok(!subscriptions.includes('body.amount'));

  const webhook = readFileSync(template('modules', 'stripe-subscriptions', 'src', 'app', 'api', 'stripe', 'webhook', 'route.ts'), 'utf8');
  assert.ok(webhook.includes('constructEvent'));

  const rolesProxy = readFileSync(template('modules', 'auth-supabase-roles', 'src', 'proxy.ts'), 'utf8');
  assert.ok(rolesProxy.includes('claims.app_metadata'));
  assert.ok(!rolesProxy.includes('userRole'));
  assert.ok(!rolesProxy.includes('user_metadata'));

  const nextAuth = readFileSync(template('modules', 'auth-nextauth', 'auth.ts'), 'utf8');
  assert.ok(!nextAuth.includes('Credentials'));
  assert.ok(!nextAuth.includes('herokuapp.com'));

  const nextAuthSignIn = readFileSync(template('modules', 'auth-nextauth', 'src', 'app', '[locale]', '(auth)', '(center)', 'sign-in', '[[...sign-in]]', 'page.tsx'), 'utf8');
  const nextAuthSignUp = readFileSync(template('modules', 'auth-nextauth', 'src', 'app', '[locale]', '(auth)', '(center)', 'sign-up', '[[...sign-up]]', 'page.tsx'), 'utf8');
  assert.ok(nextAuthSignIn.includes('SignInForm'));
  assert.ok(nextAuthSignUp.includes('SignUpForm'));
  assert.ok(!nextAuthSignIn.includes('credentials'));
  assert.ok(!nextAuthSignUp.includes('password'));
});
