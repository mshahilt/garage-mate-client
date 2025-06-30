export interface Company {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  businessRegistrationNumber: string
  taxId: string
  logo?: string
  website?: string
  description?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface CompanyRegistrationData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  businessRegistrationNumber: string
  taxId: string
  website?: string
  description: string
  logo: File
  password: string
  confirmPassword: string
}


export interface CompanyRequest extends Company {
  adminNotes?: string
  reviewedBy?: string
  reviewedAt?: string
}