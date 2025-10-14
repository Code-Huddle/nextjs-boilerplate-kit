# 🚀 create-codehuddle-nextjs

> **A powerful CLI tool to generate modern Next.js applications with enterprise-grade features and best practices**

## ✨ Features

### 🏗️ **Modern Architecture**
- **Next.js 15** with App Router and Turbo mode
- **React 19** with latest features
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Server Components** and Client Components

### 🔐 **Authentication & Security**
- **NextAuth.js v5** with multiple providers
- **Protected routes** and middleware
- **Session management** with database support
- **Environment-based configuration**

### 🎨 **UI & Styling**
- **Radix UI** components for accessibility
- **shadcn/ui** component library
- **Lucide React** icons
- **Dark/Light mode** support
- **Responsive design** out of the box

### 🌍 **Internationalization**
- **next-intl** for i18n support
- **Multiple language** support
- **Locale-based routing**
- **Dynamic translations**

### 📊 **State Management & Data**
- **Zustand** for client state
- **TanStack Query** for server state
- **React Hook Form** with Zod validation
- **Prisma** ORM ready

### 🧪 **Testing & Quality**
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **Storybook** for component development
- **ESLint** with strict rules
- **Prettier** for code formatting

### 🚀 **Developer Experience**
- **Hot reload** with Turbo
- **TypeScript** strict mode
- **Husky** git hooks
- **Commitizen** for conventional commits
- **Semantic release** automation
- **Component generator** script

### 📈 **Production Ready**
- **Bundle analysis** with @next/bundle-analyzer
- **Performance monitoring** ready
- **Docker** configuration
- **CI/CD** templates
- **SEO optimization**

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 20.0.0
- **npm** or **yarn**

### Create a New Project

```bash
# Create a new project
npx create-codehuddle-nextjs my-awesome-app

# Or create in current directory
npx create-codehuddle-nextjs .
```

### Setup and Run

```bash
# Navigate to your project
cd my-awesome-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 📁 Project Structure

```
my-awesome-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalization
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utility libraries
│   ├── hooks/                # Custom React hooks
│   ├── stores/               # Zustand stores
│   ├── types/                # TypeScript definitions
│   ├── validations/          # Zod schemas
│   └── locales/              # Translation files
├── public/                   # Static assets
├── tests/                    # Test files
├── .storybook/              # Storybook configuration
└── docs/                    # Documentation
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbo |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run storybook` | Start Storybook |
| `npm run generate:component` | Generate new component |

## 🎯 What's Included

### 🔧 **Core Technologies**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework

### 📦 **Key Dependencies**
- **NextAuth.js** - Authentication for Next.js
- **TanStack Query** - Server state management
- **React Hook Form** - Performant forms
- **Zod** - TypeScript-first schema validation
- **Prisma** - Database ORM
- **Radix UI** - Accessible component primitives

### 🧪 **Testing Stack**
- **Vitest** - Fast unit testing
- **Playwright** - E2E testing
- **Storybook** - Component development
- **Testing Library** - React component testing

### 🎨 **UI Components**
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Beautiful icons
- **Radix UI** - Low-level UI primitives
- **Tailwind CSS** - Utility classes

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your_database_url"

# NextAuth
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### Customization

The boilerplate is designed to be easily customizable:

1. **Components**: Modify or add components in `src/components/`
2. **Styles**: Customize Tailwind config in `tailwind.config.js`
3. **Features**: Enable/disable features via environment variables
4. **Themes**: Customize the theme in `src/styles/`

## 📚 Documentation

- [React Query Setup Guide](./templates/base/docs/REACT_QUERY_SETUP.md)
- [Tailwind v4 Migration](./templates/base/TAILWIND_V4_MIGRATION.md)
- [Component Development with Storybook](./templates/base/.storybook/README.md)


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives

<div align="center">

**Built with ❤️ by [Code Huddle](https://code-huddle.com)**

</div>