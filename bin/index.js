#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs-extra';
import inquirer from 'inquirer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const program = new Command();

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (['true', '1', 'yes'].includes(value.toLowerCase())) return true;
  if (['false', '0', 'no'].includes(value.toLowerCase())) return false;
  throw new Error(`Expected a boolean value, received "${value}"`);
};

const pick = async (provided, fallback, prompt) => {
  if (provided !== undefined) return provided;
  if (fallback !== undefined) return fallback;
  const answer = await inquirer.prompt([prompt]);
  return answer[prompt.name];
};

// Utility: read JSON with comments (JSONC) safely
const readJsonc = async (filePath) => {
  let text = await fs.readFile(filePath, 'utf8');

  // Strip BOM if present
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // State machine to remove comments without touching string contents
  let out = '';
  let inString = false;
  let stringChar = '';
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false;
        out += ch;
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++; // skip '/'
      }
      continue;
    }

    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      if (inString) {
        escaped = true;
      }
      out += ch;
      continue;
    }

    if (inString) {
      if (ch === stringChar) {
        inString = false;
        stringChar = '';
      }
      out += ch;
      continue;
    }

    // Not in string: detect comment starts
    if (ch === '/' && next === '/') {
      inLineComment = true;
      i++; // skip second '/'
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i++; // skip '*'
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      out += ch;
      continue;
    }

    out += ch;
  }

  // Remove trailing commas
  for (let i = 0; i < 3; i++) {
    out = out.replace(/,\s*(\]|\})/g, '$1');
  }

  try {
    return JSON.parse(out);
  } catch (e) {
    const preview = out.slice(0, 2000);
    throw new Error(`Failed to parse JSONC at ${filePath}: ${e.message}\nSnippet:\n${preview}`);
  }
};

program
  .argument('[project-name]', 'Name of the project directory (use "." for current directory)')
  .description('🚀 Generate a modern Next.js project with authentication and dark mode options')
  .option('--yes', 'Run non-interactively using secure defaults')
  .option('--auth <provider>', 'Authentication: nextauth, supabase, or none')
  .option('--roles <boolean>', 'Enable Supabase app_metadata roles', parseBoolean)
  .option('--orm <orm>', 'ORM: none, drizzle, prisma, or mongoose')
  .option('--payments <mode>', 'Payments: none, one-time, or subscriptions')
  .option('--email <boolean>', 'Include the protected email module', parseBoolean)
  .option('--dark-mode <boolean>', 'Include dark mode', parseBoolean)
  .option('--dashboard <boolean>', 'Include dashboard', parseBoolean)
  .option('--pwa <boolean>', 'Include PWA assets', parseBoolean)
  .option('--storybook <boolean>', 'Include Storybook', parseBoolean)
  .option('--docker <boolean>', 'Include Docker assets', parseBoolean)
  .option('--sentry <boolean>', 'Include Sentry', parseBoolean)
  .action(async (projectName, options) => {
    // Welcome message
    console.log(chalk.cyan.bold('\n🌟 Welcome to nextjs-boilerplate-kit!'));
    console.log(chalk.gray('   Let\'s create your modern Next.js application\n'));

    // Prompt for project name if not provided
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '📁 What is your project name? (use "." for current directory):',
          validate: (input) => {
            if (input.trim() === '') {
              return '❌ Project name cannot be empty.';
            }
            if (input !== '.' && !/^[a-zA-Z0-9_-]+$/.test(input)) {
              return '❌ Project name can only contain letters, numbers, hyphens, or underscores.';
            }
            return true;
          },
        },
      ]);
      projectName = answers.projectName;
    }

    if (projectName !== '.' && !/^[a-zA-Z0-9_-]+$/.test(projectName)) {
      throw new Error('Project name can only contain letters, numbers, hyphens, or underscores.');
    }

    // Determine target directory
    const isCurrentDir = projectName === '.';
    const targetDir = isCurrentDir ? process.cwd() : path.resolve(process.cwd(), projectName);
    const templateDir = path.join(__dirname, '..', 'templates', 'base');

    // Check if template directory exists
    if (!fs.existsSync(templateDir)) {
      console.error(chalk.red.bold('\n❌ Error: Template directory not found!'));
      console.error(chalk.red(`   Path: ${templateDir}`));
      console.error(chalk.red('   Please ensure the template files are properly installed.'));
      process.exit(1);
    }

    // Check for directory conflicts
    if (!isCurrentDir && fs.existsSync(targetDir)) {
      console.error(chalk.red.bold('\n❌ Error: Directory already exists!'));
      console.error(chalk.red(`   Directory: '${projectName}'`));
      console.error(chalk.red('   Please choose a different name or remove the existing directory.'));
      process.exit(1);
    }

    // Check for file conflicts in current directory
    if (isCurrentDir) {
      const templateFiles = await fs.readdir(templateDir);
      const existingFiles = await fs.readdir(targetDir);
      const conflicts = templateFiles.filter(file => existingFiles.includes(file));
      if (conflicts.length > 0) {
        console.error(chalk.red.bold('\n❌ Error: Files already exist in current directory!'));
        console.error(chalk.red('   Conflicting files:'));
        conflicts.forEach(file => console.error(chalk.red(`   • ${file}`)));
        console.error(chalk.red('\n   Please run this command in an empty directory or specify a new directory name.'));
        process.exit(1);
      }
    }

    try {
      // ===============================
      // CORE APPLICATION CONFIGURATION
      // ===============================
      
      const authValues = { nextauth: 'NextAuth', supabase: 'Supabase', none: 'None' };
      const authOption = options.auth?.toLowerCase();
      if (authOption && !authValues[authOption]) throw new Error(`Unsupported auth provider: ${options.auth}`);
      const authProvider = await pick(authOption ? authValues[authOption] : undefined, options.yes ? 'NextAuth' : undefined, {
          type: 'select',
          name: 'authProvider',
          message: '🔐 Choose your authentication provider:',
          choices: [
            { name: 'NextAuth.js - Complete auth with OAuth providers', value: 'NextAuth' },
            { name: 'Supabase Auth - Real-time auth with database', value: 'Supabase' },
            { name: 'None - Add authentication later', value: 'None' }
          ],
          default: 'NextAuth',
      });

      // Prompt for role-based authentication if Supabase is selected
      let enableRoleBasedAuth = false;
      if (authProvider === 'Supabase') {
        enableRoleBasedAuth = await pick(options.roles, options.yes ? false : undefined, {
            type: 'confirm',
            name: 'includeRoleBasedAuth',
            message: '👥 Enable Role-Based Authentication (Admin/User roles)?',
            default: false,
        });
      }

      // Prompt for ORM choice independently of authentication.
      let ormChoice = 'None';
      const ormValues = { none: 'None', drizzle: 'Drizzle', prisma: 'Prisma', mongoose: 'Mongoose' };
      const ormOption = options.orm?.toLowerCase();
      if (ormOption && !ormValues[ormOption]) throw new Error(`Unsupported ORM: ${options.orm}`);
      ormChoice = await pick(ormOption ? ormValues[ormOption] : undefined, options.yes ? 'None' : undefined, {
            type: 'select',
            name: 'ormChoice',
            message: '📁 Choose your ORM (Object-Relational Mapping):',
            choices: [
              { name: 'None - Add database operations later', value: 'None' },
              { name: 'Drizzle - Lightweight, type-safe TypeScript ORM', value: 'Drizzle' },
              { name: 'Prisma - Powerful database toolkit with introspection', value: 'Prisma' },
              { name: 'Mongoose - MongoDB object modeling with TypeScript', value: 'Mongoose' }
            ],
            default: 'None',
      });

      // ===============================
      // PAYMENT & COMMUNICATION
      // ===============================
      
      // Prompt for Stripe integration choice
      const paymentValues = { none: 'None', 'one-time': 'OneTime', onetime: 'OneTime', subscriptions: 'Subscriptions' };
      const paymentOption = options.payments?.toLowerCase();
      if (paymentOption && !paymentValues[paymentOption]) throw new Error(`Unsupported payment mode: ${options.payments}`);
      const stripeIntegration = await pick(paymentOption ? paymentValues[paymentOption] : undefined, options.yes ? 'None' : undefined, {
          type: 'select',
          name: 'stripeIntegration',
          message: '💳 Choose your Stripe integration:',
          choices: [
            { name: 'None - Add payments later', value: 'None' },
            { name: 'One-time payments - Single payments and purchases', value: 'OneTime' },
            { name: 'Subscriptions - Recurring billing and subscriptions', value: 'Subscriptions' }
          ],
          default: 'None',
      });

      // Prompt for Email (Nodemailer) module
      const includeResend = await pick(options.email, options.yes ? false : undefined, {
          type: 'confirm',
          name: 'includeResend',
          message: '📩 Include Email module (Nodemailer) for transactional emails?',
          default: false,
      });

      // ===============================
      // UI & USER EXPERIENCE
      // ===============================
      
      // Prompt for dark mode choice
      const enableDarkMode = await pick(options.darkMode, options.yes ? true : undefined, {
          type: 'confirm',
          name: 'enableDarkMode',
          message: '🌙 Enable dark mode toggle in your app?',
          default: true,
      });

      // Prompt for Dashboard page
      const includeDashboard = await pick(options.dashboard, options.yes ? false : undefined, {
          type: 'confirm',
          name: 'includeDashboard',
          message: '📊 Include a Dashboard page (graphs, tables, stats)?',
          default: false,
      });

      // Prompt for PWA support
      const includePWA = await pick(options.pwa, options.yes ? false : undefined, {
          type: 'confirm',
          name: 'includePWA',
          message: '📱 Include PWA (Progressive Web App) support?',
          default: false,
      });

      // ===============================
      // DEVELOPMENT & DEPLOYMENT
      // ===============================
      
      // Prompt for Storybook module
      const includeStorybook = await pick(options.storybook, options.yes ? false : undefined, {
          type: 'confirm',
          name: 'includeStorybook',
          message: '📚 Include Storybook for UI component development?',
          default: false,
      });

      // Prompt for Docker support
      const includeDocker = await pick(options.docker, options.yes ? false : undefined, {
          type: 'confirm',
          name: 'includeDocker',
          message: '🐳 Include Docker configuration for containerization?',
          default: false,
      });

      // Prompt for Sentry support
      const includeSentry = await pick(options.sentry, options.yes ? false : undefined, {
          type: 'confirm',
          name: 'includeSentry',
          message: '🔍 Include Sentry for error monitoring and performance tracking?',
          default: false,
      });

      // Copy the entire base template
      console.log(chalk.blue.bold(`\n🚀 Creating project in ${isCurrentDir ? 'current directory' : `'${projectName}'`}...`));
      console.log(chalk.gray('   📁 Copying base template files...'));
      await fs.copy(templateDir, targetDir, {
        overwrite: false,
        filter: (src) => {
          const relative = path.relative(templateDir, src);
          return !relative.startsWith(path.join('public', 'assets', 'images'));
        },
      });

      // npm excludes nested dotfiles such as .gitignore and .npmrc from package
      // tarballs. Ship publish-safe aliases and restore the intended names here.
      for (const [sourceName, targetName] of [
        ['gitignore.template', '.gitignore'],
        ['npmrc.template', '.npmrc'],
      ]) {
        const source = path.join(targetDir, sourceName);
        if (await fs.pathExists(source)) {
          await fs.move(source, path.join(targetDir, targetName), { overwrite: true });
        }
      }
      console.log(chalk.green('   ✅ Base template copied successfully'));

      // Merge selected auth module
      const modulesDir = path.join(__dirname, '..', 'templates', 'modules');
      const projectPackageJsonPath = path.join(targetDir, 'package.json');

      // Read project package.json
      const projectPkg = await fs.readJson(projectPackageJsonPath);

      // Function to add deps safely
      const ensureDeps = (deps) => {
        projectPkg.dependencies = projectPkg.dependencies || {};
        Object.entries(deps).forEach(([name, version]) => {
          projectPkg.dependencies[name] = version;
        });
      };

      const ensureDevDeps = (deps) => {
        projectPkg.devDependencies = projectPkg.devDependencies || {};
        Object.entries(deps).forEach(([name, version]) => {
          projectPkg.devDependencies[name] = version;
        });
      };

      // Function to merge environment files from base + selected modules (deduplicated, preserves base)
      const mergeEnvFiles = async (targetDir, selectedModules) => {
        try {
          const baseEnvPath = path.join(targetDir, '.env.example');
          const seenKeys = new Set();

          const extractKey = (line) => {
            const match = line.match(/^\s*([A-Z0-9_]+)\s*=/);
            return match ? match[1] : null;
          };

          const normalizeEol = (s) => s.replace(/\r\n/g, '\n');

          // 1) Start with base .env.example (preserve comments/ordering exactly)
          let output = '';
          if (await fs.pathExists(baseEnvPath)) {
            const baseEnvRaw = await fs.readFile(baseEnvPath, 'utf8');
            const baseEnv = normalizeEol(baseEnvRaw);
            output = baseEnv.endsWith('\n') ? baseEnv : baseEnv + '\n';
            // Record keys already present in base
            for (const line of output.split('\n')) {
              const key = extractKey(line);
              if (key) seenKeys.add(key);
            }
            // ensure a blank line after base content
            if (!output.endsWith('\n\n')) output += '\n';
          }

          // 2) Append each module's unique keys (no comments), grouping per module
          for (const moduleName of selectedModules) {
            const moduleEnvPath = path.join(modulesDir, moduleName, '.env.example');
            if (!(await fs.pathExists(moduleEnvPath))) continue;

            const moduleEnvRaw = await fs.readFile(moduleEnvPath, 'utf8');
            const moduleEnv = normalizeEol(moduleEnvRaw);
            const lines = moduleEnv.split('\n');
            const unique = [];
            for (const rawLine of lines) {
              const line = rawLine.trim();
              if (!line || line.startsWith('#')) continue;
              const key = extractKey(line);
              if (key && !seenKeys.has(key)) {
                unique.push(line);
                seenKeys.add(key);
              }
            }
            if (unique.length > 0) {
              const header = moduleName.replace(/^(auth-|stripe-)/, '').replace(/-/g, ' ').toUpperCase();
              output += `# ${header} Configuration\n` + unique.join('\n') + '\n\n';
            }
          }

          // 3) Trim trailing newlines to a single \n
          const finalOutput = output.replace(/\n+$/, '\n');
          await fs.writeFile(baseEnvPath, finalOutput, 'utf8');
          console.log(chalk.green('   ✅ Environment variables merged (base + modules, deduped)'));
        } catch (error) {
          console.error(chalk.yellow(`   ⚠️  Warning: Could not merge environment files: ${error.message}`));
        }
      };

      // Track selected modules for environment merging
      const selectedModules = [];

      // ===============================
      // CORE APPLICATION CONFIGURATION
      // ===============================
      
      console.log(chalk.gray('   🔐 Configuring authentication...'));
      if (authProvider === 'NextAuth') {
        const nextAuthModuleDir = path.join(modulesDir, 'auth-nextauth');
        await fs.copy(nextAuthModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        ensureDeps({ 'next-auth': '5.0.0-beta.31' });
        selectedModules.push('auth-nextauth');
      } else if (authProvider === 'Supabase') {
        if (enableRoleBasedAuth) {
          const supabaseRolesModuleDir = path.join(modulesDir, 'auth-supabase-roles');
          await fs.copy(supabaseRolesModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
          ensureDeps({ '@supabase/ssr': '^0.12.3', '@supabase/supabase-js': '^2.110.5' });
          selectedModules.push('auth-supabase-roles');
        } else {
          const supabaseModuleDir = path.join(modulesDir, 'auth-supabase');
          await fs.copy(supabaseModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
          ensureDeps({ '@supabase/ssr': '^0.12.3', '@supabase/supabase-js': '^2.110.5' });
          selectedModules.push('auth-supabase');
        }
      } else if (authProvider === 'None') {
        const noneModuleDir = path.join(modulesDir, 'auth-none');
        await fs.copy(noneModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
      }

      // Configure ORM module
      if (ormChoice !== 'None') {
        console.log(chalk.gray(`   📁 Configuring ${ormChoice} ORM...`));
        const ormModuleDir = path.join(modulesDir, `orm-${ormChoice.toLowerCase()}`);
        await fs.copy(ormModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        
        if (ormChoice === 'Drizzle') {
          ensureDeps({ 
            'drizzle-orm': '^0.45.2',
            'postgres': '^3.4.4'
          });
          ensureDevDeps({ 'drizzle-kit': '^0.31.10' });
          selectedModules.push('orm-drizzle');
        } else if (ormChoice === 'Prisma') {
          ensureDeps({ '@prisma/adapter-pg': '^7.8.0', '@prisma/client': '^7.8.0', 'pg': '^8.16.3' });
          ensureDevDeps({ '@types/pg': '^8.15.5', 'dotenv': '^17.2.3', 'prisma': '^7.8.0' });
          projectPkg.scripts = projectPkg.scripts || {};
          projectPkg.scripts.postinstall = 'prisma generate';
          selectedModules.push('orm-prisma');
        } else if (ormChoice === 'Mongoose') {
          ensureDeps({ 'mongoose': '^9.7.4' });
          selectedModules.push('orm-mongoose');
        }
        
        await mergeEnvFiles(targetDir, selectedModules);
        console.log(chalk.green(`   ✅ ${ormChoice} ORM configuration added`));
      }

      // ===============================
      // PAYMENT & COMMUNICATION
      // ===============================
      
      // Merge selected Stripe module
      console.log(chalk.gray('   💳 Configuring payments...'));
      if (stripeIntegration === 'OneTime') {
        const stripeOneTimeModuleDir = path.join(modulesDir, 'stripe-one-time');
        await fs.copy(stripeOneTimeModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        ensureDeps({ 
          'stripe': '^22.3.1',
          '@stripe/stripe-js': '^9.9.0',
          '@stripe/react-stripe-js': '^6.7.0'
        });
        selectedModules.push('stripe-one-time');
      } else if (stripeIntegration === 'Subscriptions') {
        const stripeSubscriptionsModuleDir = path.join(modulesDir, 'stripe-subscriptions');
        await fs.copy(stripeSubscriptionsModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        ensureDeps({ 
          'stripe': '^22.3.1',
          '@stripe/stripe-js': '^9.9.0',
          '@stripe/react-stripe-js': '^6.7.0'
        });
        selectedModules.push('stripe-subscriptions');
      }

      // Merge environment variables from all selected modules
      if (selectedModules.length > 0) {
        console.log(chalk.gray('   📝 Merging environment variables...'));
        await mergeEnvFiles(targetDir, selectedModules);
      }

      // Ensure Supabase env keys are present when Supabase (with or without roles) is selected
      if (authProvider === 'Supabase') {
        const envExamplePath = path.join(targetDir, '.env.example');
        let envContent = '';
        if (await fs.pathExists(envExamplePath)) {
          envContent = await fs.readFile(envExamplePath, 'utf8');
        }
        const requiredKeys = [
          'NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url',
          'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key',
        ];
        let appended = false;
        for (const line of requiredKeys) {
          const key = line.split('=')[0];
          if (!new RegExp(`^${key}=`, 'm').test(envContent)) {
            envContent += (envContent.endsWith('\n') ? '' : '\n') + line + '\n';
            appended = true;
          }
        }
        if (appended) {
          await fs.writeFile(envExamplePath, envContent.replace(/\n+$/, '\n'), 'utf8');
          console.log(chalk.green('   ✅ Supabase env keys ensured in .env.example'));
        }
      }

      // Configure Email (Nodemailer) module
      if (includeResend) {
        console.log(chalk.gray('   📩 Configuring email...'));
        const emailModuleDir = path.join(modulesDir, 'nodemailer-email');
        await fs.copy(emailModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        ensureDeps({ 'nodemailer': '^7.0.7' });
        ensureDevDeps({ '@types/nodemailer': '^7.0.4' });
        selectedModules.push('nodemailer-email');
        await mergeEnvFiles(targetDir, selectedModules);
      }

      // ===============================
      // UI & USER EXPERIENCE
      // ===============================
      
      // Configure Dashboard module
      if (includeDashboard) {
        console.log(chalk.gray('   📊 Configuring dashboard...'));
        const dashboardModuleDir = path.join(modulesDir, 'dashboard');

        // Remove any existing dashboard page to avoid conflicts
        const possibleDashboardPages = [
          path.join(targetDir, 'src', 'app', '[locale]', '(auth)', 'dashboard', 'page.tsx'),
          path.join(targetDir, 'src', 'app', 'dashboard', 'page.tsx'),
        ];
        for (const p of possibleDashboardPages) {
          if (await fs.pathExists(p)) {
            await fs.remove(p);
          }
        }

        // Copy dashboard module files
        await fs.copy(dashboardModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
      }

      // Configure PWA (optional)
      if (includePWA) {
        console.log(chalk.gray('   📱 Configuring PWA...'));
        const pwaModuleDir = path.join(modulesDir, 'pwa');
        await fs.copy(pwaModuleDir, targetDir, {
          overwrite: true,
          filter: (src) => !['.env.example', 'icon-200.jpeg'].includes(path.basename(src)),
        });
        console.log(chalk.green('   ✅ PWA manifest and service worker added'));
      }

      // ===============================
      // DEVELOPMENT & DEPLOYMENT
      // ===============================
      
      // Configure Storybook module (optional)
      if (includeStorybook) {
        console.log(chalk.gray('   📚 Configuring Storybook...'));
        const storybookModuleDir = path.join(modulesDir, 'storybook');
        // Copy module files but DO NOT overwrite the project's package.json
        await fs.copy(storybookModuleDir, targetDir, {
          overwrite: true,
          filter: (src) => !['package.json', '.env.example'].includes(path.basename(src)),
        });

        // Merge Storybook scripts and devDependencies into already loaded projectPkg
        const storybookPkgPath = path.join(storybookModuleDir, 'package.json');
        if (await fs.pathExists(storybookPkgPath)) {
          const storybookPkg = await fs.readJson(storybookPkgPath);
          projectPkg.scripts = projectPkg.scripts || {};
          if (storybookPkg.scripts) {
            Object.assign(projectPkg.scripts, storybookPkg.scripts);
          }
          projectPkg.devDependencies = projectPkg.devDependencies || {};
          if (storybookPkg.devDependencies) {
            Object.assign(projectPkg.devDependencies, storybookPkg.devDependencies);
          }
        }

        // Ensure tsconfig includes .storybook files
        const tsconfigPath = path.join(targetDir, 'tsconfig.json');
        if (await fs.pathExists(tsconfigPath)) {
          const tsconfig = await readJsonc(tsconfigPath);
          tsconfig.include = tsconfig.include || [];
          if (!tsconfig.include.includes('.storybook/*.ts')) {
            tsconfig.include.push('.storybook/*.ts');
          }
          await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
        }
      }

      // Configure Docker (optional)
      if (includeDocker) {
        console.log(chalk.gray('   🐳 Configuring Docker...'));
        const dockerModuleDir = path.join(modulesDir, 'docker');
        await fs.copy(dockerModuleDir, targetDir, { overwrite: true });
        console.log(chalk.green('   ✅ Docker configuration added'));
      }

      // Configure Sentry (optional)
      if (includeSentry) {
        console.log(chalk.gray('   🔍 Configuring Sentry...'));
        const sentryModuleDir = path.join(modulesDir, 'sentry');
        await fs.copy(sentryModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        // Ensure Sentry is installed
        ensureDeps({ '@sentry/nextjs': '^10.65.0' });
        selectedModules.push('sentry');
        // Merge environment variables again to include Sentry
        await mergeEnvFiles(targetDir, selectedModules);

        // Wrap next.config.ts with Sentry's current two-argument API.
        const projectNextConfigPath = path.join(targetDir, 'next.config.ts');
        if (await fs.pathExists(projectNextConfigPath)) {
          let cfg = await fs.readFile(projectNextConfigPath, 'utf8');

          // Add Sentry import if missing
          if (!cfg.includes("from '@sentry/nextjs'")) {
            cfg = `import { withSentryConfig } from '@sentry/nextjs';\n` + cfg;
          }

          if (!cfg.includes('const sentryOptions')) {
            cfg = cfg.replace(
              /export default\s+/,
              `const sentryOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  webpack: {
    reactComponentAnnotation: { enabled: true },
    treeshake: { removeDebugLogging: true },
  },
  telemetry: false,
};

export default `
            );
          }

          // Wrap the export call with Sentry
          if (!cfg.includes('withSentryConfig(')) {
            const marker = 'export default ';
            const exportIndex = cfg.indexOf(marker);
            if (exportIndex === -1) {
              throw new Error('Could not find the default export in next.config.ts');
            }

            const prefix = cfg.slice(0, exportIndex);
            const exportedExpression = cfg.slice(exportIndex + marker.length).trim();
            if (!exportedExpression.endsWith(';')) {
              throw new Error('Expected next.config.ts default export to end with a semicolon');
            }

            cfg = `${prefix}export default withSentryConfig(${exportedExpression.slice(0, -1)}, sentryOptions);\n`;
          }

          await fs.writeFile(projectNextConfigPath, cfg, 'utf8');
        }
        console.log(chalk.green('   ✅ Sentry configuration added'));
      }

      // Inject configuration into landing page
      console.log(chalk.gray('   📝 Customizing landing page...'));
      const pagePath = path.join(targetDir, 'src', 'app', '[locale]', '(main)', 'page.tsx');
      if (await fs.pathExists(pagePath)) {
        let pageContent = await fs.readFile(pagePath, 'utf8');
        const authMessage = authProvider === 'NextAuth'
          ? 'Welcome to your app with NextAuth'
          : authProvider === 'Supabase'
             ? enableRoleBasedAuth 
               ? 'Welcome to your app with Supabase Auth and Role-Based Access Control'
               : 'Welcome to your app with Supabase Auth'
            : 'Welcome to your app';
        const stripeMessage = stripeIntegration === 'OneTime'
          ? 'One-time payments enabled with Stripe, test it on page <a href="/test-payment" class="underline text-futuristic hover:text-futuristic/80 transition-colors">One-time Payment</a>'
          : stripeIntegration === 'Subscriptions'
            ? 'Subscription billing enabled with Stripe, test it on page <a href="/test-subscription" class="underline text-futuristic hover:text-futuristic/80 transition-colors">Test Subscription</a>'
            : 'No payment integration';
        const emailMessage = includeResend
          ? 'Email sending enabled with Nodemailer, test it on page <a href="/test-email" class="underline text-futuristic hover:text-futuristic/80 transition-colors">Test Email</a>'
          : '';
        const authType = authProvider === 'NextAuth'
          ? 'NextAuth'
          : authProvider === 'Supabase'
            ? (enableRoleBasedAuth ? 'SupabaseRoles' : 'Supabase')
            : 'None';
        pageContent = pageContent.replaceAll('__AUTH_MESSAGE__', authMessage);
        pageContent = pageContent.replaceAll('__AUTH_TYPE__', authType);
        pageContent = pageContent.replaceAll('__DARK_MODE_ENABLED__', enableDarkMode);
        pageContent = pageContent.replaceAll('__STRIPE_INTEGRATION__', stripeMessage);
        pageContent = pageContent.replaceAll('__STRIPE_INTEGRATION_TYPE__', stripeIntegration);
        pageContent = pageContent.replaceAll('__EMAIL_INTEGRATION__', emailMessage);
        pageContent = pageContent.replaceAll('__DASHBOARD_ENABLED__', includeDashboard);
        pageContent = pageContent.replaceAll('__PWA_ENABLED__', includePWA);

        // Inject module messages (Dashboard, PWA, Storybook)
        const dashboardMsg = includeDashboard
          ? 'Dashboard module enabled. Explore it on the <a href="/dashboard" class="underline text-futuristic hover:text-futuristic/80 transition-colors">Dashboard</a> page.'
          : '';
        const pwaMsg = includePWA
          ? 'PWA enabled. You can install the app from the prompt and enjoy offline support.'
          : '';
        const storybookMsg = includeStorybook
          ? 'Storybook included. Run <code>npm run storybook</code> to explore UI components.'
          : '';
        const dockerMsg = includeDocker
          ? 'Docker configuration included. Use <code>docker-compose up</code> for development or <code>docker build</code> for production.'
          : '';
        const sentryMsg = includeSentry
          ? 'Sentry monitoring enabled. Configure <code>NEXT_PUBLIC_SENTRY_DSN</code> in your environment variables.'
          : '';
        const ormMsg = ormChoice !== 'None'
          ? `${ormChoice} ORM enabled. Test database operations on the <a href="/test-orm" class="underline text-futuristic hover:text-futuristic/80 transition-colors">Test ORM</a> page.`
          : 'No ORM selected. Database operations are not configured.';
        pageContent = pageContent.replaceAll('__DASHBOARD_MESSAGE__', dashboardMsg);
        pageContent = pageContent.replaceAll('__PWA_MESSAGE__', pwaMsg);
        pageContent = pageContent.replaceAll('__STORYBOOK_MESSAGE__', storybookMsg);
        pageContent = pageContent.replaceAll('__DOCKER_MESSAGE__', dockerMsg);
        pageContent = pageContent.replaceAll('__SENTRY_MESSAGE__', sentryMsg);
        pageContent = pageContent.replaceAll('__ORM_MESSAGE__', ormMsg);
        pageContent = pageContent.replaceAll('__ORM_TYPE__', ormChoice);
        await fs.writeFile(pagePath, pageContent, 'utf8');
      }

      // Write updated package.json
      console.log(chalk.gray('   📦 Updating dependencies...'));
      await fs.writeJson(projectPackageJsonPath, projectPkg, { spaces: 2 });

      // Success message with better formatting
      console.log(chalk.green.bold(`\n🎉 Project created successfully!`));
      
      // Configuration summary
      console.log(chalk.white.bold(`\n📋 Configuration Summary:`));
      const authDisplay = authProvider === 'Supabase' && enableRoleBasedAuth 
        ? 'Supabase (with Roles)' 
        : authProvider;
      console.log(chalk.cyan(`   🔐 Auth: ${authDisplay}`));
      console.log(chalk.cyan(`   💳 Payments: ${stripeIntegration}`));
      console.log(chalk.cyan(`   📩 Email: ${includeResend ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.cyan(`   📊 Dashboard: ${includeDashboard ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.cyan(`   📱 PWA: ${includePWA ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.cyan(`   📚 Storybook: ${includeStorybook ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.cyan(`   🐳 Docker: ${includeDocker ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.cyan(`   🔍 Sentry: ${includeSentry ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.cyan(`   📁 ORM: ${ormChoice}`));
      console.log(chalk.cyan(`   🌙 Dark Mode: ${enableDarkMode ? 'Enabled' : 'Disabled'}`));
      
      // Next steps
      console.log(chalk.white.bold(`\n🚀 Next Steps:`));
      if (!isCurrentDir) {
        console.log(chalk.yellow(`   cd ${projectName}`));
      }
      console.log(chalk.yellow(`   npm install`));
      console.log(chalk.yellow(`   cp .env.example .env.local`));
      if (selectedModules.length > 0) {
        console.log(chalk.gray(`   # Configure environment variables in .env.local`));
      }
      console.log(chalk.yellow(`   npm run dev`));
      console.log(chalk.white.bold(`\n💡 Tip: Visit http://localhost:3000 to see your app!`));
      console.log(chalk.magenta.bold(`\nMade with 💜 by CodeHuddle`));
      console.log(chalk.gray(`Let's build the future together!⚡\n`));
    } catch (err) {
      console.error(chalk.red.bold('\n❌ Error generating project!'));
      console.error(chalk.red(`   ${err.message}`));
      console.error(chalk.gray('\n   If this error persists, please check:'));
      console.error(chalk.gray('   • You have write permissions in the target directory'));
      console.error(chalk.gray('   • Your internet connection is working'));
      console.error(chalk.gray('   • The template files are properly installed'));
      process.exit(1);
    }
  });

await program.parseAsync();
