import { spawnSync } from 'node:child_process';
import fs from 'fs-extra';
import path from 'node:path';
import process from 'node:process';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { matrix } from './matrix-config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(root, '.matrix');
const selectedId = process.argv.includes('--sample') ? process.argv[process.argv.indexOf('--sample') + 1] : undefined;
const generateOnly = process.argv.includes('--generate-only');
const samples = selectedId ? matrix.filter(sample => sample.id === selectedId) : matrix;
if (!samples.length) throw new Error(`Unknown matrix sample: ${selectedId}`);
await fs.mkdirp(outputRoot);

async function removeDirectory(target) {
  if (!(await fs.pathExists(target))) return;

  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      await fs.remove(target);
      return;
    } catch (error) {
      const retriable = ['EPERM', 'EBUSY', 'ENOTEMPTY', 'EACCES'].includes(error.code);
      if (!retriable || attempt === 8) throw error;
      await setTimeout(500 * attempt);
    }
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', env: { ...process.env, CI: '1' } });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed in ${cwd}`);
}

for (const sample of samples) {
  const target = path.join(outputRoot, sample.id);
  await removeDirectory(target);
  run(process.execPath, [
    path.join(root, 'bin/index.js'),
    sample.id,
    '--yes',
    '--auth', sample.auth,
    '--roles', String(sample.roles),
    '--orm', sample.orm,
    '--payments', sample.payments,
    '--pwa', String(sample.pwa),
    '--sentry', String(sample.sentry),
    '--storybook', String(sample.storybook),
    '--email', 'false',
    '--dashboard', 'false',
    '--docker', 'false',
  ], outputRoot);

  if (!generateOnly) {
    run('npm', ['install', '--no-audit', '--no-fund'], target);
    for (const script of ['check-types', 'lint', 'test', 'build']) run('npm', ['run', script], target);
    if (sample.storybook) run('npm', ['run', 'storybook:build'], target);
  }
}
