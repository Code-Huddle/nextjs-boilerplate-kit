# 🚀 create-codehuddle-nextjs

> **A powerful CLI tool to generate modern Next.js applications with enterprise-grade features and best practices**

## ✨ Features

### 🏗️ **Modern Architecture**
- **Next.js 15** with App Router and Turbo mode
- **React 19** with latest features
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Server Components** and Client Components

### 🔐 **Modular Authentication System**
- **Choose your auth provider**: NextAuth.js, Supabase, or None
- **Interactive CLI selection** during project creation
- **Protected routes** and middleware for each provider
- **Session management** with provider-specific implementations
- **Environment-based configuration** per auth type

### 💳 **Modular Stripe Integration**
- **Choose your payment type**: One-time payments, Subscriptions, or None
- **Interactive CLI selection** during project creation
- **Complete payment flows** with success/cancel pages
- **Test payment pages** for easy development and testing
- **Interactive landing page links** to test payment pages
- **Environment-based configuration** with merged variables
- **Auth-protected payment routes** for security

### 🌙 **Optional Dark Mode**
- **Toggle-enabled dark mode** with CSS variables
- **System preference detection** and localStorage persistence
- **Smooth theme transitions** with modern glassmorphism effects
- **Conditional inclusion** - only adds dark mode toggle if enabled

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
- **Global error handling** with custom error pages
- **404 not-found pages** with user-friendly navigation

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

**🎯 Project Configuration**: During project creation, you'll be prompted to configure:

**Authentication Provider:**
- **NextAuth** - Complete authentication with OAuth providers and credentials
- **Supabase** - Authentication with Supabase Auth and real-time features  
- **None** - No authentication (add your own later)

**Stripe Integration:**
- **One-time payments** - Process single payments with Stripe Checkout
- **Subscriptions** - Handle recurring billing with subscription management
- **None** - No payment integration (add your own later)

**Dark Mode:**
- **Enable** - Includes dark mode toggle button in header with CSS variables
- **Disable** - Light theme only (no dark mode toggle)

### Setup and Run

```bash
# Navigate to your project
cd my-awesome-app

# Install dependencies
npm install

# Copy environment variables (includes auth + payment configs)
cp .env.example .env.local

# Start development server
npm run dev
```

**📝 Environment Setup**: The `.env.example` file will contain the appropriate environment variables for your selected authentication provider and Stripe integration (if any).

**🎯 Interactive Landing Page**: When you select Stripe integration, the landing page will include clickable links to test your payment functionality directly from the homepage.

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
- **Authentication** - NextAuth.js, Supabase Auth, or custom solution
- **Payments** - Stripe integration for one-time payments and subscriptions
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

The `.env.example` file will be automatically generated based on your selected authentication provider:

#### **NextAuth Configuration**
```env
# NextAuth.js Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# API Configuration
NEXT_PUBLIC_SERVER_URL="https://your-api-url.com/api"
```

#### **Supabase Configuration**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

#### **No Authentication**
```env
# General Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### **Stripe One-Time Payments Configuration**
```env
# Stripe Configuration for One-Time Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Settings
STRIPE_CURRENCY=usd
STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel
```

#### **Stripe Subscriptions Configuration**
```env
# Stripe Configuration for Subscriptions
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Settings
STRIPE_CURRENCY=usd
STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel

# Subscription-specific settings
STRIPE_PRICE_ID_MONTHLY=price_your_monthly_price_id_here
STRIPE_PRICE_ID_YEARLY=price_your_yearly_price_id_here
```

### Customization

The boilerplate is designed to be easily customizable:

1. **Components**: Modify or add components in `src/components/`
2. **Styles**: Customize Tailwind config in `tailwind.config.js`
3. **Features**: Enable/disable features via environment variables
4. **Themes**: Customize the theme in `src/styles/`
5. **Authentication**: Switch auth providers by re-running the CLI or manually updating components

### 🧪 **Testing Payments**

When you select a Stripe integration, test pages are automatically included:

#### **One-Time Payments**
- **Test Page**: `/test-payment` - Interactive payment testing interface
- **Demo Component**: Quick amount selection ($9.99, $29.99, $49.99, $99.99)
- **Test Cards**: Built-in test card numbers for different scenarios
- **Success/Cancel Pages**: `/payment/success` and `/payment/cancel`

#### **Subscriptions**
- **Test Page**: `/test-subscription` - Subscription plan testing interface
- **Demo Component**: Plan selection (Starter, Professional, Enterprise)
- **Subscription Management**: Demo of subscription management interface
- **Success/Cancel Pages**: `/payment/success` and `/payment/cancel`

#### **Test Card Numbers**
```bash
# Successful payments
4242 4242 4242 4242  # Visa
5555 5555 5555 4444  # Mastercard
3782 822463 10005    # American Express

# Failed payments
4000 0000 0000 0002  # Declined
4000 0000 0000 9995  # Insufficient funds
4000 0000 0000 0069  # Expired card
```

### 🔄 **Changing Authentication Providers**

If you want to switch authentication providers after project creation:

1. **Re-run the CLI**: Delete the project and create a new one with your preferred auth provider
2. **Manual Migration**: Replace auth-specific files and update dependencies manually
3. **Hybrid Approach**: Keep the base template and manually add your preferred auth solution

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