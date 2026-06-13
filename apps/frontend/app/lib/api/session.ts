import type { User } from '@/types/user';
import { getProfile } from './user';

export async function getSession(): Promise<User | null> {
  try {
    return await getProfile();
  } catch {
    return null;
  }
}
