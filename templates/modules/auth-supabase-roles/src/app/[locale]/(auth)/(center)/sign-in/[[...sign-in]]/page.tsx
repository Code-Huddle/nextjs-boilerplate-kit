import { SignInForm } from '@/components/SignInForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}
