#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

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
  .action(async (projectName) => {
    // Welcome message
    console.log(chalk.cyan.bold('\n🌟 Welcome to create-codehuddle-nextjs!'));
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
      // Prompt for authentication choice
      const { authProvider } = await inquirer.prompt([
        {
          type: 'list',
          name: 'authProvider',
          message: '🔐 Choose your authentication provider:',
          choices: [
            { name: 'NextAuth.js - Complete auth with OAuth providers', value: 'NextAuth' },
            { name: 'Supabase Auth - Real-time auth with database', value: 'Supabase' },
            { name: 'None - Add authentication later', value: 'None' }
          ],
          default: 'NextAuth',
        },
      ]);

      // Prompt for role-based authentication if Supabase is selected
      let enableRoleBasedAuth = false;
      if (authProvider === 'Supabase') {
        const { includeRoleBasedAuth } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'includeRoleBasedAuth',
            message: '👥 Enable Role-Based Authentication (Admin/User roles)?',
            default: false,
          },
        ]);
        enableRoleBasedAuth = includeRoleBasedAuth;
      }

      // Prompt for dark mode choice
      const { enableDarkMode } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'enableDarkMode',
          message: '🌙 Enable dark mode toggle in your app?',
          default: true,
        },
      ]);

      // Prompt for Stripe integration choice
      const { stripeIntegration } = await inquirer.prompt([
        {
          type: 'list',
          name: 'stripeIntegration',
          message: '💳 Choose your Stripe integration:',
          choices: [
            { name: 'None - Add payments later', value: 'None' },
            { name: 'One-time payments - Single payments and purchases', value: 'OneTime' },
            { name: 'Subscriptions - Recurring billing and subscriptions', value: 'Subscriptions' }
          ],
          default: 'None',
        },
      ]);

      // Prompt for Email (Nodemailer) module
      const { includeResend } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'includeResend',
          message: '📩 Include Email module (Nodemailer) for transactional emails?',
          default: false,
        },
      ]);

      // Prompt for Dashboard page
      const { includeDashboard } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'includeDashboard',
          message: '📊 Include a Dashboard page (graphs, tables, stats)?',
          default: false,
        },
      ]);

      // Prompt for Storybook module
      const { includeStorybook } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'includeStorybook',
          message: '📚 Include Storybook for UI component development?',
          default: false,
        },
      ]);

      // Prompt for PWA support
      const { includePWA } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'includePWA',
          message: '📱 Include PWA (Progressive Web App) support?',
          default: false,
        },
      ]);

      // Prompt for Docker support
      const { includeDocker } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'includeDocker',
          message: '🐳 Include Docker configuration for containerization?',
          default: false,
        },
      ]);

      // Copy the entire base template
      console.log(chalk.blue.bold(`\n🚀 Creating project in ${isCurrentDir ? 'current directory' : `'${projectName}'`}...`));
      console.log(chalk.gray('   📁 Copying base template files...'));
      await fs.copy(templateDir, targetDir, { overwrite: false });
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

      console.log(chalk.gray('   🔐 Configuring authentication...'));
      if (authProvider === 'NextAuth') {
        const nextAuthModuleDir = path.join(modulesDir, 'auth-nextauth');
        await fs.copy(nextAuthModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        ensureDeps({ 'next-auth': '^5.0.0-beta.25' });
        selectedModules.push('auth-nextauth');
      } else if (authProvider === 'Supabase') {
        if (enableRoleBasedAuth) {
          const supabaseRolesModuleDir = path.join(modulesDir, 'auth-supabase-roles');
          await fs.copy(supabaseRolesModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
          ensureDeps({ '@supabase/supabase-js': '^2.47.10' });
          selectedModules.push('auth-supabase-roles');
        } else {
        const supabaseModuleDir = path.join(modulesDir, 'auth-supabase');
          await fs.copy(supabaseModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        ensureDeps({ '@supabase/supabase-js': '^2.47.10' });
        selectedModules.push('auth-supabase');
        }
      } else if (authProvider === 'None') {
        const noneModuleDir = path.join(modulesDir, 'auth-none');
        await fs.copy(noneModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
      }

      // Merge selected Stripe module
      console.log(chalk.gray('   💳 Configuring payments...'));
      if (stripeIntegration === 'OneTime') {
        const stripeOneTimeModuleDir = path.join(modulesDir, 'stripe-one-time');
        await fs.copy(stripeOneTimeModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        ensureDeps({ 
          'stripe': '^16.0.0',
          '@stripe/stripe-js': '^4.0.0',
          '@stripe/react-stripe-js': '^2.0.0'
        });
        selectedModules.push('stripe-one-time');
      } else if (stripeIntegration === 'Subscriptions') {
        const stripeSubscriptionsModuleDir = path.join(modulesDir, 'stripe-subscriptions');
        await fs.copy(stripeSubscriptionsModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        ensureDeps({ 
          'stripe': '^16.0.0',
          '@stripe/stripe-js': '^4.0.0',
          '@stripe/react-stripe-js': '^2.0.0'
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
          'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key',
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
        ensureDeps({ 'nodemailer': '^6.9.13' });
        selectedModules.push('nodemailer-email');
        await mergeEnvFiles(targetDir, selectedModules);
      }

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

      // Configure PWA (optional)
      if (includePWA) {
        console.log(chalk.gray('   📱 Configuring PWA...'));
        const pwaModuleDir = path.join(modulesDir, 'pwa');
        await fs.copy(pwaModuleDir, targetDir, { overwrite: true, filter: (src) => path.basename(src) !== '.env.example' });
        // Ensure next-pwa is installed
        ensureDeps({ 'next-pwa': '^5.6.0' });

        // Smoothly wrap next.config.ts with next-pwa
        const projectNextConfigPath = path.join(targetDir, 'next.config.ts');
        if (await fs.pathExists(projectNextConfigPath)) {
          let cfg = await fs.readFile(projectNextConfigPath, 'utf8');

          // Add import if missing
          if (!cfg.includes("from 'next-pwa'")) {
            cfg = `import withPWA from 'next-pwa';\n` + cfg;
          }

          // Add configured wrapper const if missing
          if (!cfg.includes('const withPWAConfigured')) {
            cfg = cfg.replace(
              /export default\s+/, 
              "const withPWAConfigured = withPWA({ dest: 'public', register: true, skipWaiting: true, disable: process.env.NODE_ENV === 'development' });\n\nexport default "
            );
          }

          // Wrap the export call: export default withPWAConfigured(<existingExportExpression>);
          if (!cfg.includes('export default withPWAConfigured(')) {
            cfg = cfg.replace(/export default\s*([\s\S]*?);\s*$/m, (m, expr) => {
              // Trim potential trailing commas/spaces that can break wrapping
              const cleaned = expr.replace(/,\s*\)$/g, ')');
              return `export default withPWAConfigured(${cleaned});`;
            });
          }

          await fs.writeFile(projectNextConfigPath, cfg, 'utf8');
        }
      }

      // Configure Docker (optional)
      if (includeDocker) {
        console.log(chalk.gray('   🐳 Configuring Docker...'));
        const dockerModuleDir = path.join(modulesDir, 'docker');
        await fs.copy(dockerModuleDir, targetDir, { overwrite: true });
        console.log(chalk.green('   ✅ Docker configuration added'));
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
        pageContent = pageContent.replaceAll('__DASHBOARD_MESSAGE__', dashboardMsg);
        pageContent = pageContent.replaceAll('__PWA_MESSAGE__', pwaMsg);
        pageContent = pageContent.replaceAll('__STORYBOOK_MESSAGE__', storybookMsg);
        pageContent = pageContent.replaceAll('__DOCKER_MESSAGE__', dockerMsg);
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

program.parse();