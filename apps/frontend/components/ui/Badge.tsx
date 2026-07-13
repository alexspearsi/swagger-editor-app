import { cn } from '@/app/lib/utils/cn';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Badge({ className, children }: Props) {
  return <span className={cn('rounded px-2 py-0.5 text-xs font-bold', className)}>{children}</span>;
}
