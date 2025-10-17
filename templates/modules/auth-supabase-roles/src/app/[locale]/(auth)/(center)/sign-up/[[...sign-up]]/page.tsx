import { SignUpForm } from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
