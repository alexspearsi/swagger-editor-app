import { VerificationCard } from '@/components/auth/VerificationCard';

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function NewVerificationPage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <VerificationCard token={token} />
    </div>
  );
}
