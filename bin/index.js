#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

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
          message: '✉️ Include Email module (Nodemailer) for transactional emails?',
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

      // Function to merge environment files from multiple modules (deduplicated)
      const mergeEnvFiles = async (targetDir, selectedModules) => {
        try {
          const baseEnvPath = path.join(targetDir, '.env.example');

          // Tracks keys we have already emitted
          const seenKeys = new Set();

          const extractKey = (line) => {
            const match = line.match(/^\s*([A-Z0-9_]+)\s*=/);
            return match ? match[1] : null;
          };

          const collectUniqueLines = (content) => {
            const lines = content.split(/\r?\n/);
            const unique = [];
            for (const rawLine of lines) {
              const line = rawLine.trimEnd();
              if (line.trim() === '' || line.trim().startsWith('#')) {
                // Skip empty/comment lines for modules; keep structure minimal
                continue;
              }
              const key = extractKey(line);
              if (key && !seenKeys.has(key)) {
                unique.push(line);
                seenKeys.add(key);
              }
            }
            return unique;
          };

          let output = '';

          // Start with base .env.example (preserve its structure and comments)
          if (await fs.pathExists(baseEnvPath)) {
            const baseEnv = await fs.readFile(baseEnvPath, 'utf8');
            const baseLines = baseEnv.split(/\r?\n/);
            for (const rawLine of baseLines) {
              const line = rawLine.trimEnd();
              output += line + '\n';
              const key = extractKey(line);
              if (key) {
                seenKeys.add(key);
              }
            }
            // Ensure single blank line separation after base
            output = output.replace(/\n+$/, '\n');
            output += '\n';
          }

          // Append each module's unique keys (with a header only if it contributes new keys)
          for (const module of selectedModules) {
            const moduleEnvPath = path.join(modulesDir, module, '.env.example');
            if (!(await fs.pathExists(moduleEnvPath))) continue;

            const moduleEnv = await fs.readFile(moduleEnvPath, 'utf8');
            const uniqueLines = collectUniqueLines(moduleEnv);
            if (uniqueLines.length === 0) continue; // nothing new to add

            const moduleName = module.replace(/^(auth-|stripe-)/, '').replace(/-/g, ' ').toUpperCase();
            output += `# ${moduleName} Configuration\n`;
            output += uniqueLines.join('\n') + '\n\n';
          }

          await fs.writeFile(baseEnvPath, output.replace(/\n+$/, '\n'));
          console.log(chalk.green(`   ✅ Environment variables merged (deduplicated)`));
        } catch (error) {
          console.error(chalk.yellow(`   ⚠️  Warning: Could not merge environment files: ${error.message}`));
        }
      };

      // Track selected modules for environment merging
      const selectedModules = [];

      console.log(chalk.gray('   🔐 Configuring authentication module...'));
      if (authProvider === 'NextAuth') {
        const nextAuthModuleDir = path.join(modulesDir, 'auth-nextauth');
        await fs.copy(nextAuthModuleDir, targetDir, { overwrite: true });
        ensureDeps({ 'next-auth': '^5.0.0-beta.25' });
        selectedModules.push('auth-nextauth');
        console.log(chalk.blue('   ✅ NextAuth.js configured'));
      } else if (authProvider === 'Supabase') {
        const supabaseModuleDir = path.join(modulesDir, 'auth-supabase');
        await fs.copy(supabaseModuleDir, targetDir, { overwrite: true });
        ensureDeps({ '@supabase/supabase-js': '^2.47.10' });
        selectedModules.push('auth-supabase');
        console.log(chalk.blue('   ✅ Supabase Auth configured'));
      } else if (authProvider === 'None') {
        const noneModuleDir = path.join(modulesDir, 'auth-none');
        await fs.copy(noneModuleDir, targetDir, { overwrite: true });
        // Don't add to selectedModules since auth-none has no env file
        console.log(chalk.blue('   ✅ No authentication (can be added later)'));
        // No additional dependencies needed for None
      }

      // Merge selected Stripe module
      console.log(chalk.gray('   💳 Configuring Stripe integration...'));
      if (stripeIntegration === 'OneTime') {
        const stripeOneTimeModuleDir = path.join(modulesDir, 'stripe-one-time');
        await fs.copy(stripeOneTimeModuleDir, targetDir, { overwrite: true });
        ensureDeps({ 
          'stripe': '^16.0.0',
          '@stripe/stripe-js': '^4.0.0',
          '@stripe/react-stripe-js': '^2.0.0'
        });
        selectedModules.push('stripe-one-time');
        console.log(chalk.blue('   ✅ Stripe one-time payments configured'));
      } else if (stripeIntegration === 'Subscriptions') {
        const stripeSubscriptionsModuleDir = path.join(modulesDir, 'stripe-subscriptions');
        await fs.copy(stripeSubscriptionsModuleDir, targetDir, { overwrite: true });
        ensureDeps({ 
          'stripe': '^16.0.0',
          '@stripe/stripe-js': '^4.0.0',
          '@stripe/react-stripe-js': '^2.0.0'
        });
        selectedModules.push('stripe-subscriptions');
        console.log(chalk.blue('   ✅ Stripe subscriptions configured'));
      } else if (stripeIntegration === 'None') {
        console.log(chalk.blue('   ✅ No Stripe integration (can be added later)'));
        // No additional dependencies needed for None
      }

      // Merge environment variables from all selected modules
      if (selectedModules.length > 0) {
        console.log(chalk.gray('   📝 Merging environment variables...'));
        await mergeEnvFiles(targetDir, selectedModules);
      }

      // Configure Email (Nodemailer) module
      if (includeResend) {
        console.log(chalk.gray('   ✉️ Configuring email module (Nodemailer)...'));
        const emailModuleDir = path.join(modulesDir, 'nodemailer-email');
        await fs.copy(emailModuleDir, targetDir, { overwrite: true });
        ensureDeps({ 'nodemailer': '^6.9.13' });
        selectedModules.push('nodemailer-email');
        // Merge env again to include resend entries
        console.log(chalk.gray('   📝 Merging environment variables (Email)...'));
        await mergeEnvFiles(targetDir, selectedModules);
        console.log(chalk.blue('   ✅ Email module configured (visit /test-email to send test emails)'));
      }

      // Inject auth message, dark mode setting, and Stripe integration into landing page
      console.log(chalk.gray('   📝 Customizing landing page...'));
      const pagePath = path.join(targetDir, 'src', 'app', '[locale]', '(main)', 'page.tsx');
      if (await fs.pathExists(pagePath)) {
        let pageContent = await fs.readFile(pagePath, 'utf8');
        const authMessage = authProvider === 'NextAuth'
          ? 'Welcome to your app with NextAuth'
          : authProvider === 'Supabase'
            ? 'Welcome to your app with Supabase Auth'
            : 'Welcome to your app';
        const stripeMessage = stripeIntegration === 'OneTime'
          ? 'One-time payments enabled with Stripe, test it on page <a href="/test-payment" class="underline text-futuristic hover:text-futuristic/80 transition-colors">One-time Payment</a>'
          : stripeIntegration === 'Subscriptions'
            ? 'Subscription billing enabled with Stripe, test it on page <a href="/test-subscription" class="underline text-futuristic hover:text-futuristic/80 transition-colors">Test Subscription</a>'
            : 'No payment integration';
        const emailMessage = includeResend
          ? 'Email sending enabled with Nodemailer, test it on page <a href="/test-email" class="underline text-futuristic hover:text-futuristic/80 transition-colors">Test Email</a>'
          : '';
        pageContent = pageContent.replace('__AUTH_MESSAGE__', authMessage);
        pageContent = pageContent.replace('__DARK_MODE_ENABLED__', enableDarkMode);
        pageContent = pageContent.replace('__STRIPE_INTEGRATION__', stripeMessage);
        pageContent = pageContent.replace('__STRIPE_INTEGRATION_TYPE__', stripeIntegration);
        pageContent = pageContent.replace('__EMAIL_INTEGRATION__', emailMessage);
        await fs.writeFile(pagePath, pageContent, 'utf8');
        console.log(chalk.green('   ✅ Landing page customized'));
        console.log(chalk.blue(`   ✅ Dark mode ${enableDarkMode ? 'enabled' : 'disabled'}`));
        console.log(chalk.blue(`   ✅ Stripe integration: ${stripeIntegration}`));
      }

      // Write updated package.json
      console.log(chalk.gray('   📦 Updating package dependencies...'));
      await fs.writeJson(projectPackageJsonPath, projectPkg, { spaces: 2 });
      console.log(chalk.green('   ✅ Dependencies updated'));

      // Success message with better formatting
      console.log(chalk.green.bold(`\n🎉 Success! Project created successfully!`));
      console.log(chalk.white.bold(`\n📋 Project Configuration:`));
      console.log(chalk.cyan(`   🔐 Authentication: ${authProvider}`));
      console.log(chalk.cyan(`   💳 Stripe Integration: ${stripeIntegration}`));
      console.log(chalk.cyan(`   ✉️ Email (Nodemailer): ${includeResend ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.cyan(`   🌙 Dark Mode: ${enableDarkMode ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.white.bold(`\n🚀 Next Steps:`));
      if (!isCurrentDir) {
        console.log(chalk.yellow(`   cd ${projectName}`));
      }
      console.log(chalk.yellow(`   npm install`));
      console.log(chalk.yellow(`   copy .env.example .env.local`));
      if (selectedModules.length > 0) {
        console.log(chalk.yellow(`   # Configure your environment variables in .env.local`));
        console.log(chalk.gray(`   # Includes: ${selectedModules.map(m => m.replace(/^(auth-|stripe-)/, '').replace(/-/g, ' ')).join(', ')}`));
      }
      console.log(chalk.yellow(`   npm run dev`));
      console.log(chalk.white.bold(`\n💡 Tip: Visit http://localhost:3000 to see your new app!`));
      console.log(chalk.magenta.bold(`\nMade with ♥ by CodeHuddle`));
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