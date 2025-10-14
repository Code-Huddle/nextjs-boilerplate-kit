# Quick Reference Guide

## Essential Patterns

### Component Structure
```typescript
export function Component({ prop }: Props) {
  // 1. Hooks
  const [state, setState] = useState();
  const { data } = useQuery(...);
  
  // 2. Derived state
  const isValid = state !== null;
  
  // 3. Event handlers
  const handleClick = () => {};
  
  // 4. Early returns
  if (!data) return null;
  
  // 5. Main render
  return <div>{data}</div>;
}
```

### Server Component
```typescript
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### Client Component
```typescript
'use client';

export function ClientComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(true)}>Click</button>;
}
```

### Data Fetching (Server)
```typescript
export default async function Page() {
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
  ]);
  return <Dashboard users={users} posts={posts} />;
}
```

### Data Fetching (Client)
```typescript
'use client';

export function Component() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['key'],
    queryFn: fetchData,
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  return <div>{data}</div>;
}
```

### Form
```typescript
'use client';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### State Management
```typescript
export const useStore = create<State>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Usage
const count = useStore((state) => state.count);
const increment = useStore((state) => state.increment);
```

### Mutation
```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Updated successfully');
    },
  });
}
```

## Code Quality Checklist

### Before Committing
- [ ] No `any` types
- [ ] No `console.log`
- [ ] No magic numbers
- [ ] No hardcoded strings
- [ ] No TODO comments
- [ ] All imports organized
- [ ] Proper error handling
- [ ] Accessibility attributes
- [ ] Tests written/updated
- [ ] Types exported
- [ ] Lint passes
- [ ] Type check passes

### Component Checklist
- [ ] Named export (not default)
- [ ] Proper TypeScript types
- [ ] Accessibility (ARIA labels)
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Keyboard navigation
- [ ] Focus indicators

### Form Checklist
- [ ] Zod validation schema
- [ ] Proper labels
- [ ] Error messages
- [ ] Loading state
- [ ] Disabled when invalid
- [ ] Reset after success
- [ ] Accessibility attributes
- [ ] Keyboard navigation

## Common Patterns

### Error Handling
```typescript
try {
  const result = await operation();
  return result;
} catch (error) {
  Logger.error('Operation failed', { error });
  throw error;
}
```

### Async APIs
```typescript
const cookieStore = await cookies();
const headersList = await headers();
const params = await props.params;
const searchParams = await props.searchParams;
```

### Conditional Rendering
```typescript
// Early return
if (!user) return null;

// Ternary
{isLoading ? <Spinner /> : <Content />}

// Logical AND
{hasError && <ErrorMessage />}
```

### Styling
```typescript
<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
  variant === 'primary' && 'primary-classes',
  className
)}>
  Content
</div>
```

## Import Order
```typescript
// 1. External
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal (@/)
import { Button } from '@/components/ui/button';
import { useStore } from '@/stores/useStore';

// 3. Types
import type { User } from '@/types/user';

// 4. Relative
import { helper } from './helpers';

// 5. Styles
import './styles.css';
```

## Naming Conventions

### Files
- Components: `UserProfile.tsx`
- Utilities: `formatDate.ts`
- Types: `UserTypes.ts`
- Hooks: `useUserData.ts`
- Directories: `user-profile/`

### Variables
- Boolean: `isLoading`, `hasError`, `canEdit`
- Event handlers: `handleClick`, `handleSubmit`
- Constants: `MAX_FILE_SIZE`, `API_BASE_URL`
- Regular: `userData`, `formValues`

### Functions
- Pure: `calculateTotal`, `formatCurrency`
- Components: `UserCard`, `LoginForm`

## Quick Commands

### Git
```bash
npm run commit          # Commitizen
git checkout -b feature/name
gh pr create
```

### Development
```bash
npm run dev            # Start dev server
npm run build          # Build production
npm run lint           # Run linter
npm run lint:fix       # Fix lint issues
npm run check-types    # Type check
npm run test           # Run tests
npm run test:e2e       # E2E tests
```

### Testing
```bash
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run storybook      # Storybook
```

## Anti-Patterns to Avoid

❌ `any` types  
❌ `console.log`  
❌ Inline styles (except dynamic)  
❌ Magic numbers  
❌ Hardcoded strings  
❌ Direct `useEffect` for data fetching  
❌ Prop drilling (use context/store)  
❌ Nested ternaries  
❌ Missing error handling  
❌ Missing loading states  
❌ Missing accessibility attributes  
❌ Direct DOM manipulation  
❌ Mutating state directly  
❌ Large components (split them)  
❌ TODO comments in commits  

## Resources

- [Full Rules](./README.md)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

---

Keep this file handy as your daily reference guide!

