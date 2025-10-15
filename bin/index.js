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

      console.log(chalk.gray('   🔐 Configuring authentication module...'));
      if (authProvider === 'NextAuth') {
        const nextAuthModuleDir = path.join(modulesDir, 'auth-nextauth');
        await fs.copy(nextAuthModuleDir, targetDir, { overwrite: true });
        ensureDeps({ 'next-auth': '^5.0.0-beta.25' });
        console.log(chalk.blue('   ✅ NextAuth.js configured'));
      } else if (authProvider === 'Supabase') {
        const supabaseModuleDir = path.join(modulesDir, 'auth-supabase');
        await fs.copy(supabaseModuleDir, targetDir, { overwrite: true });
        ensureDeps({ '@supabase/supabase-js': '^2.47.10' });
        console.log(chalk.blue('   ✅ Supabase Auth configured'));
      } else if (authProvider === 'None') {
        const noneModuleDir = path.join(modulesDir, 'auth-none');
        await fs.copy(noneModuleDir, targetDir, { overwrite: true });
        console.log(chalk.blue('   ✅ No authentication (can be added later)'));
        // No additional dependencies needed for None
      }

      // Inject auth message and dark mode setting into landing page
      console.log(chalk.gray('   📝 Customizing landing page...'));
      const pagePath = path.join(targetDir, 'src', 'app', '[locale]', '(main)', 'page.tsx');
      if (await fs.pathExists(pagePath)) {
        let pageContent = await fs.readFile(pagePath, 'utf8');
        const authMessage = authProvider === 'NextAuth'
          ? 'Welcome to your app with NextAuth'
          : authProvider === 'Supabase'
            ? 'Welcome to your app with Supabase Auth'
            : 'Welcome to your app';
        pageContent = pageContent.replace('__AUTH_MESSAGE__', authMessage);
        pageContent = pageContent.replace('__DARK_MODE_ENABLED__', enableDarkMode);
        await fs.writeFile(pagePath, pageContent, 'utf8');
        console.log(chalk.green('   ✅ Landing page customized'));
        console.log(chalk.blue(`   ✅ Dark mode ${enableDarkMode ? 'enabled' : 'disabled'}`));
      }

      // Write updated package.json
      console.log(chalk.gray('   📦 Updating package dependencies...'));
      await fs.writeJson(projectPackageJsonPath, projectPkg, { spaces: 2 });
      console.log(chalk.green('   ✅ Dependencies updated'));

      // Success message with better formatting
      console.log(chalk.green.bold(`\n🎉 Success! Project created successfully!`));
      console.log(chalk.white.bold(`\n📋 Project Configuration:`));
      console.log(chalk.cyan(`   🔐 Authentication: ${authProvider}`));
      console.log(chalk.cyan(`   🌙 Dark Mode: ${enableDarkMode ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.white.bold(`\n🚀 Next Steps:`));
      if (!isCurrentDir) {
        console.log(chalk.yellow(`   cd ${projectName}`));
      }
      console.log(chalk.yellow(`   npm install`));
      console.log(chalk.yellow(`   copy .env.example .env.local`));
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