export interface UserRole {
  id: string;
  name: 'user' | 'admin' | 'manager';
  displayName: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole['name'];
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
