export interface User {
  id: string;
  email: string;
  displayName: string;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
}
