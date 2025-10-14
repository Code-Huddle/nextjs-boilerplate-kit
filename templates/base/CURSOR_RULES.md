# Cursor AI Rules - Implementation Guide

This project includes comprehensive Cursor AI rules following senior software engineer best practices. These rules ensure consistent, high-quality code across the entire codebase.

## 📁 Rule Files Location

All Cursor rules are stored in `.cursor/rules/` directory:

```
.cursor/rules/
├── README.md                      # Complete documentation
├── 00-core-principles.mdc        # Core development principles (Always)
├── 01-typescript.mdc             # TypeScript standards (Auto-Attached)
├── 02-react-nextjs.mdc           # React 19 & Next.js 15 (Auto-Attached)
├── 03-code-style.mdc             # Code style and formatting (Always)
├── 04-architecture.mdc           # Architecture patterns (Always)
├── 05-testing.mdc                # Testing best practices (Auto-Attached)
├── 06-performance.mdc            # Performance optimization (Agent Requested)
├── 07-security.mdc               # Security standards (Always)
├── 08-accessibility.mdc          # Accessibility (WCAG 2.1) (Auto-Attached)
├── 09-state-management.mdc       # Zustand patterns (Auto-Attached)
├── 10-data-fetching.mdc          # TanStack Query patterns (Auto-Attached)
├── 11-forms.mdc                  # React Hook Form & Zod (Auto-Attached)
├── 12-styling.mdc                # Tailwind CSS patterns (Auto-Attached)
├── 13-i18n.mdc                   # Internationalization (Auto-Attached)
└── 14-git-workflow.mdc           # Git & commit conventions (Manual)
```

## 🎯 What These Rules Cover

### 1. **Core Development (Always Active)**
- Code quality standards
- Error handling patterns
- Import organization
- Naming conventions
- DRY principles
- Early returns
- Performance mindset

### 2. **TypeScript (Auto-Attached)**
- No `any` types - strict type safety
- Interface vs Type usage
- Generic types and utility types
- Type guards and assertions
- Discriminated unions
- Branded types

### 3. **React & Next.js (Auto-Attached)**
- Server Components first
- Async request APIs
- Proper data fetching
- Suspense and error boundaries
- Image and font optimization
- Metadata API usage

### 4. **Code Style (Always Active)**
- Consistent formatting
- Naming conventions
- JSX patterns
- Conditional rendering
- Comment guidelines
- Array and object manipulation

### 5. **Architecture (Always Active)**
- Component layer patterns
- Service layer abstraction
- Validation layer with Zod
- Repository pattern
- Custom hooks
- Dependency injection

### 6. **Testing (Auto-Attached)**
- Unit testing with Vitest
- Component testing
- E2E testing with Playwright
- Mocking strategies
- Testing async code
- Accessibility testing

### 7. **Performance (Agent Requested)**
- Core Web Vitals optimization
- Image and font optimization
- Code splitting
- Memoization strategies
- Virtualization for long lists
- Bundle size optimization

### 8. **Security (Always Active)**
- Authentication & authorization
- Input validation
- XSS prevention
- SQL injection prevention
- CSRF protection
- Rate limiting
- Secure headers

### 9. **Accessibility (Auto-Attached)**
- WCAG 2.1 Level AA compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

### 10. **State Management (Auto-Attached)**
- Zustand store patterns
- When to use state management
- Selector optimization
- Persistence strategies
- Testing stores

### 11. **Data Fetching (Auto-Attached)**
- TanStack Query setup
- Query key organization
- Mutations with optimistic updates
- Infinite queries
- Prefetching strategies
- Cache management

### 12. **Forms (Auto-Attached)**
- React Hook Form patterns
- Zod validation schemas
- shadcn Form components
- Dynamic fields
- File uploads
- Server Actions integration

### 13. **Styling (Auto-Attached)**
- Tailwind CSS utility-first
- Component variants with CVA
- Responsive design
- Dark mode support
- Custom utilities
- Accessibility in styling

### 14. **i18n (Auto-Attached)**
- next-intl patterns
- Translation file structure
- Locale switching
- Date/number formatting
- Type-safe translations
- Namespace organization

### 15. **Git Workflow (Manual Reference)**
- Conventional commits
- Branch naming
- PR guidelines
- Code review process
- Commitizen usage

## 🚀 How It Works

### Automatic Application

Cursor AI automatically applies these rules based on:

1. **Always Active Rules**: Applied to every interaction
   - Core Principles
   - Code Style
   - Architecture
   - Security

2. **Auto-Attached Rules**: Applied when editing specific file types
   - TypeScript rules for `.ts`/`.tsx` files
   - React/Next.js rules for components
   - Testing rules for test files
   - Form rules for form components
   - And more...

3. **Context-Aware**: The AI understands your project structure and applies relevant rules

### No Configuration Needed

Just start coding! Cursor will:
- ✅ Follow all best practices automatically
- ✅ Suggest improvements based on rules
- ✅ Generate code that matches project standards
- ✅ Enforce type safety and security
- ✅ Maintain consistent style

## 💡 Key Principles Enforced

### Type Safety
```typescript
// ✅ Always use proper types
function processUser(user: User): void {
  // Implementation
}

// ❌ Never use 'any'
function processUser(user: any): void {
  // Don't do this
}
```

### Server Components First
```typescript
// ✅ Default to Server Components
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// ✅ Client Components only when needed
'use client';
export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(true)}>Click</button>;
}
```

### Input Validation
```typescript
// ✅ Always validate with Zod
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const validatedData = schema.parse(input);
```

### Accessibility
```typescript
// ✅ Proper ARIA labels
<button aria-label="Delete item" onClick={handleDelete}>
  <TrashIcon aria-hidden="true" />
</button>
```

### Error Handling
```typescript
// ✅ Explicit error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  Logger.error('Operation failed', { error });
  throw error;
}
```

## 📊 Benefits

### For Developers
- 🎯 Consistent code quality
- 🚀 Faster development with AI assistance
- 📚 Built-in best practices
- 🔒 Security by default
- ♿ Accessibility compliance
- 🧪 Testable code patterns

### For Teams
- 📋 Standardized code style
- 🤝 Easier code reviews
- 📖 Self-documenting patterns
- 🔄 Easier onboarding
- 🎨 Consistent UI/UX

### For Projects
- 🏗️ Clean architecture
- 🔐 Secure by default
- ⚡ Performance optimized
- 🌍 Internationalization ready
- 📱 Responsive and accessible
- 🧩 Maintainable codebase

## 🔍 Examples

### Creating a New Component
Cursor will automatically:
1. Use proper TypeScript types
2. Apply accessibility standards
3. Follow React 19 patterns
4. Implement proper error handling
5. Use Tailwind CSS correctly
6. Support dark mode
7. Be responsive

### Building a Form
Cursor will automatically:
1. Use React Hook Form
2. Implement Zod validation
3. Add proper error messages
4. Include accessibility attributes
5. Support internationalization
6. Handle loading states
7. Add proper TypeScript types

### Writing Tests
Cursor will automatically:
1. Use Vitest for unit tests
2. Follow testing best practices
3. Test behavior, not implementation
4. Include accessibility tests
5. Mock external dependencies
6. Use descriptive test names

## 📚 Additional Resources

- **Detailed Documentation**: See `.cursor/rules/README.md`
- **Individual Rules**: Check `.cursor/rules/*.mdc` files
- **Examples**: Find patterns throughout the codebase
- **Official Docs**: [Cursor Documentation](https://docs.cursor.com)

## 🔄 Updating Rules

To modify or add rules:
1. Edit files in `.cursor/rules/`
2. Follow MDC format with metadata
3. Include practical examples
4. Update `.cursor/rules/README.md`
5. Test with actual code

## ✨ Getting Started

1. **Open your project in Cursor**
2. **Start coding** - rules are already active!
3. **Ask Cursor for help** - it will follow all rules
4. **Review suggestions** - they'll match project standards
5. **Commit with confidence** - consistent, high-quality code

## 🎓 Learning from Rules

Use these rules as a learning resource:
- 📖 Read through rule files to understand best practices
- 🔍 See examples of proper patterns
- 🤔 Understand the "why" behind decisions
- 💡 Apply principles to your own code
- 🚀 Level up your development skills

## 🤝 Contributing

When contributing to this project:
1. Cursor AI will guide you to follow these rules
2. All PRs will be reviewed against these standards
3. Automated checks enforce key rules
4. Code reviews verify compliance

---

**Note**: These rules represent industry best practices and are continuously updated to reflect the latest standards in React, Next.js, TypeScript, and web development.

**Project**: CodeHuddle Frontend Boilerplate  
**Last Updated**: October 2025  
**Maintained by**: CodeHuddle Team

