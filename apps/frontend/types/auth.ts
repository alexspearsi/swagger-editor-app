export interface LoginRequest {
  email: string;
  password: string;
  code?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export interface AuthResponse {
  message: string;
}

export interface TwoFactorResponse {
  message: string;
}
