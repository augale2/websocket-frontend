export interface User {
  id: string;
  username: string;
}

export interface AuthResponse {
  user_id: string;
  message: string;
  token?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
} 