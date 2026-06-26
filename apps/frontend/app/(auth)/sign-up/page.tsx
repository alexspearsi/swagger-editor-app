import { redirect } from 'next/navigation';

import { getSession } from '@/app/lib/api/session';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default async function SignUpPage() {
  const user = await getSession();

  if (user) {
    redirect('/');
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <SignUpForm />
    </div>
  );
}
