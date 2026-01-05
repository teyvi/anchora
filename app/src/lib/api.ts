// API Service Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // Check for token refresh header
      const refreshToken = response.headers.get('x-refresh-token');
      if (refreshToken) {
        this.setToken(refreshToken);
      }

      // Handle different response types
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post<{ token: string; role: string; requiresPasswordSetup?: boolean }>('/login', {
      email,
      password,
    }),

  setPassword: (email: string, newPassword: string) =>
    apiClient.post<{ message: string }>('/set-password', {
      email,
      newPassword,
    }),

  logout: () => {
    apiClient.setToken(null);
  },
};

// Users API
export const usersAPI = {
  getAll: () => apiClient.get<any[]>('/admin/users'),
  
  create: (email: string, role?: string) =>
    apiClient.post<any>('/admin/users', { email, role }),
  
  deactivate: (userId: string) =>
    apiClient.patch<any>(`/admin/users/${userId}/deactivate`),
};

// Posts API
export const postsAPI = {
  create: (title: string, content: string) =>
    apiClient.post<any>('/posts', { title, content }),

  getMyPosts: (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return apiClient.get<any[]>(`/posts/my-posts${params}`);
  },

  getAll: (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return apiClient.get<any[]>(`/admin/posts${params}`);
  },

  approve: (postId: string) =>
    apiClient.patch<any>(`/admin/posts/${postId}/approve`),

  reject: (postId: string, reason: string) =>
    apiClient.patch<any>(`/admin/posts/${postId}/reject`, { reason }),
};

export default apiClient;

