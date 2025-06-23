import { api } from './api'
import {type LoginCredentials,type User } from '@/types/User'
import { type CompanyRegistrationData } from '@/types/Company'

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    // just for the delay
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    //  mock user 
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      name: credentials.email.includes('admin') ? 'Admin User' : 'Company User',
      role: credentials.email.includes('admin') ? 'admin' : 'company',
      companyId: credentials.email.includes('admin') ? undefined : '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // mock auth
    if (credentials.password.length >= 6) {
      return { data: { user: mockUser, token: 'mock-jwt-token' } }
    } else {
      throw new Error('Invalid credentials')
    }
  },

  register: async (data: CompanyRegistrationData) => {
    // just for the delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // mock registration 
    return {
      data: {
        message: 'Registration successful. Your application is under review.',
        companyId: 'mock-company-id',
      }
    }
  },

  logout: async () => {
    // make an api call to invalidate the token in future
    return { data: { message: 'Logged out successfully' } }
  },
}