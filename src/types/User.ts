export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'company'
  companyId?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}