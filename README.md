# 🚀 create-codehuddle-nextjs

[![npm version](https://img.shields.io/npm/v/create-codehuddle-nextjs.svg?style=flat-square)](https://www.npmjs.com/package/create-codehuddle-nextjs)
[![Downloads](https://img.shields.io/npm/dm/create-codehuddle-nextjs.svg?style=flat-square)](https://www.npmjs.com/package/create-codehuddle-nextjs)
[![License](https://img.shields.io/npm/l/create-codehuddle-nextjs.svg?style=flat-square)](https://github.com/Code-Huddle/create-codehuddle-nextjs/blob/main/LICENSE)
[![Node.js Version](https://img.shields.io/node/v/create-codehuddle-nextjs.svg?style=flat-square)](https://nodejs.org/)

> **The ultimate CLI tool for generating modern, production-ready Next.js applications with enterprise-grade features, modular architecture, and best practices built-in.**

## ✨ What Makes This Special?

**create-codehuddle-nextjs** is not just another Next.js starter template. It's a **modular, interactive CLI tool** that lets you build exactly what you need, when you need it. Choose your authentication, payments, features, and more through an intuitive command-line interface.

### 🎯 **Interactive Project Generation**
```bash
npx create-codehuddle-nextjs my-app
# ✨ Interactive prompts guide you through:
# 🔐 Authentication: NextAuth.js, Supabase, or None
# 💳 Payments: One-time, Subscriptions, or None  
# 📊 Dashboard: Include analytics dashboard
# 📱 PWA: Progressive Web App features
# 📚 Storybook: Component development
# 🌙 Dark Mode: Theme switching
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 20.0.0
- **npm**, **yarn**, or **pnpm**

### Create Your Project

```bash
# Create a new project with interactive setup
npx create-codehuddle-nextjs my-awesome-app

# Or create in current directory
npx create-codehuddle-nextjs .
```

### Setup & Run

```bash
cd my-awesome-app
npm install
cp .env.example .env.local
npm run dev
```

**🎉 That's it!** Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🏗️ Architecture & Features

### 🔐 **Modular Authentication System**

Choose from multiple authentication providers, each with complete implementations:

| Provider | Features | Best For |
|----------|----------|----------|
| **NextAuth.js** | OAuth, credentials, session management | Full-featured apps with multiple providers |
| **Supabase** | Real-time auth, database integration | Modern apps with real-time features |
| **Supabase + Roles** | Role-based access control (Admin/User) | Enterprise applications |
| **None** | No authentication | Simple apps or custom auth later |

**Example CLI Flow:**
```bash
🔐 Choose your authentication provider:
❯ NextAuth.js - Complete auth with OAuth providers
  Supabase Auth - Real-time auth with database  
  None - Add authentication later
```

### 💳 **Flexible Payment Integration**

Integrated Stripe payments with complete flows:

| Integration | Features | Pages Included |
|-------------|----------|----------------|
| **One-time Payments** | Single payments, purchases | `/test-payment`, `/payment/success`, `/payment/cancel` |
| **Subscriptions** | Recurring billing, subscription management | `/test-subscription`, `/payment/success`, `/payment/cancel` |
| **None** | No payment integration | - |

**Interactive Landing Page:** When you select Stripe integration, your landing page automatically includes clickable links to test payment functionality.

### 📊 **Optional Dashboard Module**

Modern analytics dashboard with:
- **KPI Cards** with metrics and trends
- **Interactive Charts** using Recharts
- **Activity Timeline** for user actions
- **Sales Table** with data visualization
- **Responsive Design** with sidebar navigation

### 📱 **Progressive Web App (PWA)**

Complete PWA implementation:
- **Web App Manifest** for app-like experience
- **Service Worker** for offline functionality
- **Install Prompt** component for app installation
- **Offline Support** with caching strategies

### 📚 **Storybook Integration**

Component development environment:
- **Pre-configured** Storybook setup
- **Component Stories** for UI development
- **Interactive Documentation** for your design system
- **Visual Testing** capabilities

### 🌙 **Smart Dark Mode**

Intelligent theme system:
- **System Preference Detection** 
- **localStorage Persistence**
- **Smooth Transitions** with CSS variables
- **Conditional Inclusion** - only adds toggle if enabled

## 🛠️ Technology Stack

### **Core Framework**
- **Next.js 15** - Latest React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Tailwind CSS v4** - Utility-first styling

### **UI & Components**
- **shadcn/ui** - Beautiful, accessible components
- **Radix UI** - Low-level UI primitives
- **Lucide React** - Beautiful icon library
- **Class Variance Authority** - Component variants

### **State Management**
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **React Hook Form** - Performant forms
- **Zod** - TypeScript-first validation

### **Development Tools**
- **Vitest** - Fast unit testing
- **Playwright** - E2E testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitizen** - Conventional commits

### **Production Ready**
- **Bundle Analysis** with @next/bundle-analyzer
- **Docker** configuration
- **CI/CD** templates
- **SEO Optimization**
- **Performance Monitoring** ready

## 📁 Project Structure

```
my-awesome-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalization
│   │   │   ├── (auth)/        # Authentication routes
│   │   │   │   ├── sign-in/   # Sign in pages
│   │   │   │   ├── sign-up/   # Sign up pages
│   │   │   │   ├── dashboard/ # Dashboard (if enabled)
│   │   │   │   ├── admin/     # Admin routes (Supabase Roles)
│   │   │   │   └── user/      # User routes (Supabase Roles)
│   │   │   ├── test-payment/  # Stripe test pages
│   │   │   ├── test-subscription/ # Subscription test
│   │   │   └── test-email/    # Email testing
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   └── dashboard/        # Dashboard components
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

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbo |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run storybook` | Start Storybook development |
| `npm run generate:component` | Generate new component |
| `npm run build-stats` | Build with bundle analysis |

## 🌍 Internationalization

Built-in i18n support with **next-intl**:
- **Multiple Languages** - English, French, and more
- **Locale-based Routing** - `/en/`, `/fr/` paths
- **Dynamic Translations** - Server and client components
- **SEO-friendly** - Proper meta tags per locale

## 🧪 Testing Strategy

Comprehensive testing setup:

### **Unit Testing** (Vitest)
```bash
npm run test
# Fast unit tests with React Testing Library
```

### **E2E Testing** (Playwright)
```bash
npm run test:e2e
# End-to-end testing across browsers
```

### **Component Testing** (Storybook)
```bash
npm run storybook
# Visual component development and testing
```

## 🔧 Configuration Examples

### **Environment Variables**
The CLI automatically generates `.env.example` with the right variables for your selected modules:

```bash
# Authentication (NextAuth.js)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Email (Nodemailer)
RESEND_API_KEY=re_...
```

### **Module Selection Example**
```bash
🌟 Welcome to create-codehuddle-nextjs!

🔐 Choose your authentication provider:
❯ NextAuth.js - Complete auth with OAuth providers

👥 Enable Role-Based Authentication (Admin/User roles)?
❯ No

🌙 Enable dark mode toggle in your app?
❯ Yes

💳 Choose your Stripe integration:
❯ One-time payments - Single payments and purchases

📩 Include Email module (Nodemailer) for transactional emails?
❯ Yes

📊 Include a Dashboard page (graphs, tables, stats)?
❯ Yes

📚 Include Storybook for UI component development?
❯ Yes

📱 Include PWA (Progressive Web App) support?
❯ Yes

📋 Configuration Summary:
   🔐 Auth: NextAuth
   💳 Payments: OneTime
   📩 Email: Enabled
   📊 Dashboard: Enabled
   📱 PWA: Enabled
   📚 Storybook: Enabled
   🌙 Dark Mode: Enabled
```

## 🚀 Production Deployment

### **Vercel** (Recommended)
```bash
# Deploy to Vercel
npx vercel

# Set environment variables in Vercel dashboard
```

### **Docker**
```bash
# Build Docker image
docker build -t my-app .

# Run container
docker run -p 3000:3000 my-app
```

### **Other Platforms**
- **Netlify** - Static site generation
- **Railway** - Full-stack deployment
- **AWS** - Container deployment
- **DigitalOcean** - App Platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For hosting and deployment
- **shadcn/ui** - For beautiful components
- **Radix UI** - For accessible primitives
- **Tailwind CSS** - For utility-first styling

## 📞 Support

- **Documentation** - [Full documentation](https://github.com/Code-Huddle/create-codehuddle-nextjs/wiki)
- **Issues** - [GitHub Issues](https://github.com/Code-Huddle/create-codehuddle-nextjs/issues)
- **Discussions** - [GitHub Discussions](https://github.com/Code-Huddle/create-codehuddle-nextjs/discussions)
- **Email** - harisahmed629@gmail.com

---

<div align="center">

**💜 Made with ♥ by CodeHuddle**  
**🚀 Happy coding • Join our amazing community!**

[⭐ Star us on GitHub](https://github.com/Code-Huddle/create-codehuddle-nextjs) • [📦 NPM Package](https://www.npmjs.com/package/create-codehuddle-nextjs) • [🐦 Follow us](https://twitter.com/codehuddle)

</div>