export interface User {
  id: string;
  username: string;
}

export interface AuthResponse {
  user_id: User;
  message: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
} 