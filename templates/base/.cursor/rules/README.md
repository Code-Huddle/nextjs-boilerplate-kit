# Cursor Rules Documentation

This directory contains comprehensive Cursor rules that guide AI-assisted development for this Next.js 15 project. These rules ensure consistent, high-quality code following senior software engineer best practices.

## Rule Files

### Core Rules (Always Active)

- **00-core-principles.mdc** - Fundamental development principles, code quality standards, and mandatory practices
- **03-code-style.mdc** - Code formatting, naming conventions, and style guidelines
- **04-architecture.mdc** - Clean architecture patterns, separation of concerns, and design patterns
- **07-security.mdc** - Security best practices, authentication, authorization, and vulnerability prevention

### Auto-Attached Rules (File-Specific)

- **01-typescript.mdc** - TypeScript standards, type safety, and patterns (*.ts, *.tsx)
- **02-react-nextjs.mdc** - React 19 & Next.js 15 patterns and best practices (**/app/**/*.tsx)
- **05-testing.mdc** - Testing strategies with Vitest and Playwright (*.test.ts, *.spec.ts)
- **08-accessibility.mdc** - WCAG 2.1 Level AA accessibility standards (**/components/**/*.tsx)
- **09-state-management.mdc** - Zustand state management patterns (**/stores/**/*.ts)
- **10-data-fetching.mdc** - TanStack Query data fetching patterns (**/hooks/**/*.ts)
- **11-forms.mdc** - React Hook Form and Zod validation patterns (*Form*.tsx)
- **12-styling.mdc** - Tailwind CSS best practices and patterns (*.tsx, *.css)
- **13-i18n.mdc** - Internationalization with next-intl (**/[locale]/**/*.tsx)

### Manual Rules (Reference)

- **06-performance.mdc** - Performance optimization techniques and Core Web Vitals
- **14-git-workflow.mdc** - Git workflow, conventional commits, and PR guidelines

## Rule Types

### Always
These rules are included in every AI interaction:
- Core Principles
- Code Style
- Architecture
- Security

### Auto Attached
These rules are automatically included when you edit files matching their patterns:
- TypeScript rules activate when editing `.ts` or `.tsx` files
- React/Next.js rules activate for components and pages
- Testing rules activate for test files
- And so on...

### Agent Requested
The AI decides whether to include these based on context:
- Performance optimization rules

### Manual
These rules must be explicitly mentioned or are used as reference:
- Git workflow documentation

## Usage

### For Developers

These rules are automatically applied by Cursor AI. You don't need to do anything special - just write code and Cursor will follow these guidelines.

### For AI Assistants

When working on this project:
1. Always follow the **Core Principles** and **Code Style** rules
2. Apply **Auto-Attached** rules based on file type
3. Reference **Performance** rules when optimizing code
4. Consult **Git Workflow** rules for commit and PR guidance

## Key Principles

1. **Type Safety First** - No `any` types, always use proper TypeScript
2. **Server Components by Default** - Use Client Components only when needed
3. **Accessibility** - WCAG 2.1 Level AA compliance
4. **Security** - Input validation, authentication, and secure practices
5. **Testing** - Comprehensive test coverage with meaningful tests
6. **Performance** - Optimize for Core Web Vitals
7. **Clean Architecture** - Separation of concerns and design patterns
8. **Internationalization** - Support multiple locales
9. **Conventional Commits** - Standardized commit messages
10. **Documentation** - Self-documenting code with clear patterns

## Project Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth.js v5
- **i18n**: next-intl
- **Testing**: Vitest + Playwright
- **Database**: Prisma
- **Logging**: Pino + Logtail

## Updating Rules

When updating rules:
1. Maintain the existing file structure
2. Keep examples relevant to the project
3. Update this README if adding/removing rules
4. Test changes with actual code examples
5. Ensure rules don't conflict with each other

## Quick Reference

### Common Patterns

```typescript
// Component Structure
export function Component({ prop }: Props) {
  // 1. Hooks
  // 2. Derived state
  // 3. Event handlers
  // 4. Early returns
  // 5. Main render
}

// Data Fetching (Server)
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// Data Fetching (Client)
export function Component() {
  const { data } = useQuery({
    queryKey: ['key'],
    queryFn: fetchData,
  });
}

// Form Handling
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});

// State Management
export const useStore = create<State>((set) => ({
  // state and actions
}));
```

## Resources

- [Cursor Documentation](https://docs.cursor.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

For questions or suggestions about these rules:
1. Review the specific rule file
2. Check examples in the codebase
3. Refer to official documentation
4. Consult with the team

---

Last Updated: October 2025
Project: CodeHuddle Frontend Boilerplate

