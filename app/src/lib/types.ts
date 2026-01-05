// Types matching backend schema

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  passwordSet: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  // Populated from relations
  author?: {
    id: string;
    email: string;
  };
}

export interface AuthResponse {
  token: string;
  role: string;
  requiresPasswordSetup?: boolean;
}

export interface ApiError {
  message: string;
}

