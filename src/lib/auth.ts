import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'login',
      data: credentials,
    }),
  });

  const responseText = await response.text();
  
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (parseError) {
    console.error('Failed to parse response as JSON:', responseText);
    throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}...`);
  }

  if (!response.ok) {
    if (data.details === 'invalid credentials') {
      throw new Error('Invalid username or password. Please try again.');
    }
    throw new Error(data.error || data.details || 'Failed to login');
  }

  localStorage.setItem('token', data.token);
  
  const user: User = {
    id: data.user_id,
    username: credentials.username,
  };
  localStorage.setItem('user', JSON.stringify(user));
  
  return data;
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const { confirmPassword, ...credentialsWithoutConfirm } = credentials;
  
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'register',
      data: credentialsWithoutConfirm,
    }),
  });

  const responseText = await response.text();
  

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (parseError) {
    console.error('Failed to parse response as JSON:', responseText);
    throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}...`);
  }

  if (!response.ok) {
    if (data.details === 'username already exists') {
      throw new Error('This username is already taken. Please choose a different one.');
    }
    throw new Error(data.error || data.details || 'Failed to register');
  }
  const user: User = {
    id: data.user_id,
    username: credentials.username,
  };
  localStorage.setItem('user', JSON.stringify(user));
  
  return data;
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'validate',
        data: { token },
      }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.valid;
  } catch (error) {
    return false;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
} 