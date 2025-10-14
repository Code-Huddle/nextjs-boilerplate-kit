#!/usr/bin/env node

/**
 * Component Generator Script
 *
 * Usage:
 * npm run generate:component -- --name Button --type ui
 * npm run generate:component -- --name UserProfile --type client
 * npm run generate:component -- --name DataFetcher --type server
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, '');
  const value = args[i + 1];
  params[key] = value;
}

const { name, type = 'ui' } = params;

if (!name) {
  console.error('Error: Component name is required.');
  console.log('Usage: npm run generate:component -- --name ComponentName --type [ui|client|server]');
  process.exit(1);
}

// Validate component type
const validTypes = ['ui', 'client', 'server', 'page'];
if (!validTypes.includes(type)) {
  console.error(`Error: Invalid component type. Must be one of: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Define directories
const componentDir = path.join(__dirname, '..', 'src', 'components');
const uiDir = path.join(componentDir, 'ui');

// Ensure directories exist
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

if (type === 'ui' && !fs.existsSync(uiDir)) {
  fs.mkdirSync(uiDir, { recursive: true });
}

// Template functions
const generateUIComponent = name => `import { cn } from "@/lib/utils";
import * as React from "react";

export interface ${name}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Add custom props here
}

export function ${name}({
  className,
  ...props
}: ${name}Props) {
  return (
    <div className={cn("", className)} {...props}>
      {/* Component content */}
    </div>
  );
}
`;

const generateClientComponent = name => `"use client";

import * as React from "react";

export interface ${name}Props {
  // Add props here
}

export function ${name}({ ...props }: ${name}Props) {
  // Client-side state or effects
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    // Client-side effect
  }, []);

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
`;

const generateServerComponent = name => `import * as React from "react";

export interface ${name}Props {
  // Add props here
}

export async function ${name}({ ...props }: ${name}Props) {
  // Server-side data fetching
  // const data = await fetchData();

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
`;

const generatePageComponent = name => `import { constructMetadata } from "@/components/Seo";
import * as React from "react";

export const metadata = constructMetadata({
  title: "${name}",
  description: "${name} page description",
});

export default function ${name}Page() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">${name}</h1>
    </main>
  );
}
`;

// Choose the appropriate template based on component type
let template;
let targetDir;

switch (type) {
  case 'ui':
    template = generateUIComponent(name);
    targetDir = uiDir;
    break;
  case 'client':
    template = generateClientComponent(name);
    targetDir = componentDir;
    break;
  case 'server':
    template = generateServerComponent(name);
    targetDir = componentDir;
    break;
  case 'page':
    template = generatePageComponent(name);
    targetDir = path.join(__dirname, '..', 'src', 'app', '[locale]');
    // Create directory for the page
    if (!fs.existsSync(path.join(targetDir, name.toLowerCase()))) {
      fs.mkdirSync(path.join(targetDir, name.toLowerCase()), { recursive: true });
    }
    targetDir = path.join(targetDir, name.toLowerCase());
    break;
}

// Create the file
const filename = type === 'page' ? 'page.tsx' : `${name}.tsx`;
const filePath = path.join(targetDir, filename);

try {
  if (fs.existsSync(filePath)) {
    console.error(`Error: Component ${filePath} already exists.`);
    process.exit(1);
  }

  fs.writeFileSync(filePath, template);
  console.log(`Success: Created ${type} component at ${filePath}`);
} catch (error) {
  console.error(`Error creating component: ${error.message}`);
  process.exit(1);
}
