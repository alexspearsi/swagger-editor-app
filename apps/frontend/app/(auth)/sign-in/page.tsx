import { getSession } from '@/app/lib/api/session';
import { SignInForm } from '@/components/auth/SignInForm';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const user = await getSession();

  if (user) {
    redirect('/');
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <SignInForm />
    </div>
  );
}
