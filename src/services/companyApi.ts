import { api } from './api'
import { type CompanyRequest } from '@/types/Company'

export const companyApi = {
  //  function to get company requests for admin
  getCompanyRequests: async (): Promise<{ data: CompanyRequest[] }> => {
    // mock delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // mock data
    const mockRequests: CompanyRequest[] = [
      {
        id: '1',
        name: 'AutoFix Garage',
        email: 'info@autofix.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        businessRegistrationNumber: 'BRN123456',
        taxId: 'TAX789012',
        website: 'https://autofix.com',
        description: 'Full-service auto repair shop',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'QuickLube Express',
        email: 'contact@quicklube.com',
        phone: '+1987654321',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        businessRegistrationNumber: 'BRN654321',
        taxId: 'TAX210987',
        website: 'https://quicklube.com',
        description: 'Fast oil change and basic maintenance',
        status: 'approved',
        createdAt: '2024-01-10T14:20:00Z',
        updatedAt: '2024-01-12T09:15:00Z',
      },
      {
        id: '3',
        name: 'Premium Motors',
        email: 'admin@premiummotors.com',
        phone: '+1555123456',
        address: '789 Elite Blvd',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'USA',
        businessRegistrationNumber: 'BRN987654',
        taxId: 'TAX456789',
        status: 'rejected',
        createdAt: '2024-01-08T11:45:00Z',
        updatedAt: '2024-01-09T16:30:00Z',
        adminNotes: 'Incomplete documentation provided',
      },
    ]

    return { data: mockRequests }
  },

  //  function to update company request status
  updateCompanyStatus: async (companyId: string, status: 'approved' | 'rejected', notes?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      data: {
        message: `Company ${status} successfully`,
        companyId,
        status,
        notes,
      }
    }
  },
}