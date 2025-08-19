export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  name: string;
  phone: string;
}

export interface VerifyCodeRequest {
  phone: string;
  code: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface SMSCodeResponse {
  message: string;
  code: string; // Only for development
}
