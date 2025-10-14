#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

program
  .argument('[project-name]', 'Name of the project directory (use "." for current directory)')
  .description('Generate a new Next.js project from custom boilerplate')
  .action(async (projectName) => {
    // Prompt for project name if not provided
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Please enter the project name (use "." for current directory):',
          validate: (input) => {
            if (input.trim() === '') {
              return 'Project name cannot be empty.';
            }
            if (input !== '.' && !/^[a-zA-Z0-9_-]+$/.test(input)) {
              return 'Project name can only contain letters, numbers, hyphens, or underscores.';
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
      console.error(chalk.red(`Error: Template directory not found at ${templateDir}`));
      process.exit(1);
    }

    // Check for directory conflicts
    if (!isCurrentDir && fs.existsSync(targetDir)) {
      console.error(chalk.red(`Error: Directory '${projectName}' already exists.`));
      process.exit(1);
    }

    // Check for file conflicts in current directory
    if (isCurrentDir) {
      const templateFiles = await fs.readdir(templateDir);
      const existingFiles = await fs.readdir(targetDir);
      const conflicts = templateFiles.filter(file => existingFiles.includes(file));
      if (conflicts.length > 0) {
        console.error(chalk.red('Error: The following files/folders already exist in the current directory:'));
        console.error(chalk.red(conflicts.join(', ')));
        console.error(chalk.red('Please run this command in an empty directory or specify a new directory name.'));
        process.exit(1);
      }
    }

    try {
      // Prompt for authentication choice
      const { authProvider } = await inquirer.prompt([
        {
          type: 'list',
          name: 'authProvider',
          message: 'Choose an authentication provider:',
          choices: ['NextAuth', 'Supabase', 'None'],
          default: 'NextAuth',
        },
      ]);

      // Copy the entire base template
      console.log(chalk.blue(`Creating project in ${isCurrentDir ? 'current directory' : `'${projectName}'`}...`));
      await fs.copy(templateDir, targetDir, { overwrite: false });

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

      if (authProvider === 'NextAuth') {
        const nextAuthModuleDir = path.join(modulesDir, 'auth-nextauth');
        await fs.copy(nextAuthModuleDir, targetDir, { overwrite: true });
        ensureDeps({ 'next-auth': '^5.0.0-beta.25' });
      } else if (authProvider === 'Supabase') {
        const supabaseModuleDir = path.join(modulesDir, 'auth-supabase');
        await fs.copy(supabaseModuleDir, targetDir, { overwrite: true });
        ensureDeps({ '@supabase/supabase-js': '^2.47.10' });
      } else if (authProvider === 'None') {
        const noneModuleDir = path.join(modulesDir, 'auth-none');
        await fs.copy(noneModuleDir, targetDir, { overwrite: true });
        // No additional dependencies needed for None
      }

      // Inject auth message into landing page
      const pagePath = path.join(targetDir, 'src', 'app', '[locale]', '(main)', 'page.tsx');
      if (await fs.pathExists(pagePath)) {
        let pageContent = await fs.readFile(pagePath, 'utf8');
        const authMessage = authProvider === 'NextAuth'
          ? 'Welcome to your app with NextAuth'
          : authProvider === 'Supabase'
            ? 'Welcome to your app with Supabase Auth'
            : 'Welcome to your app';
        pageContent = pageContent.replace('__AUTH_MESSAGE__', authMessage);
        await fs.writeFile(pagePath, pageContent, 'utf8');
      }

      // Write updated package.json
      await fs.writeJson(projectPackageJsonPath, projectPkg, { spaces: 2 });

      console.log(chalk.green(`Success: Project created in ${isCurrentDir ? 'current directory' : `'${projectName}'`}!`));
      console.log(chalk.yellow(`Next steps:`));
      if (!isCurrentDir) {
        console.log(chalk.yellow(`  cd ${projectName}`));
      }
      console.log(chalk.yellow(`  npm install`));
      console.log(chalk.yellow(`  copy .env.example .env.local`));
      console.log(chalk.yellow(`  npm run dev`));
    } catch (err) {
      console.error(chalk.red('Error generating project:'), err.message);
      process.exit(1);
    }
  });

program.parse();