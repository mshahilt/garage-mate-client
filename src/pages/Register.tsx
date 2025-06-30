import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Input,
  FormHelperText,
  InputLabel,
  FormControl,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { CloudUpload } from '@mui/icons-material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { authApi } from '@/services/authApi'
import useToast from '@/hooks/useToast'
import {type CompanyRegistrationData } from '@/types/Company'
const schema = yup.object({
  name: yup.string().required('Company name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
  businessRegistrationNumber: yup.string().required('Business registration number is required'),
  taxId: yup.string().required('Tax ID is required'),
  description: yup.string().required('Description is required'),
  logo: yup
    .mixed<File>()
    .required('Logo is required')
    .test('fileExists', 'Logo file is required', (value) => value instanceof File),

  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

const Register: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyRegistrationData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  })


  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Logo file size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      setLogoFile(file)
    }
  }

  const onSubmit = async (data:CompanyRegistrationData) => {
    setIsLoading(true)
    try {
      const formData = logoFile ? { ...data, logo: logoFile } : { ...data }
      await authApi.register(formData)
      toast.success('Registration successful! Your application is under review.')
      reset()
      setLogoFile(null)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Register Your Company
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Join our garage management platform
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3, width: '100%' }}
          >
            <Grid container spacing={3}>
              {/* Company Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Company Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Company Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  {...register('phone')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  error={!!errors.website}
                  helperText={errors.website?.message}
                  {...register('website')}
                />
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Address Information
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Street Address"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  {...register('address')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                  {...register('city')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="State/Province"
                  error={!!errors.state}
                  helperText={errors.state?.message}
                  {...register('state')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="ZIP/Postal Code"
                  error={!!errors.zipCode}
                  helperText={errors.zipCode?.message}
                  {...register('zipCode')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  {...register('country')}
                />
              </Grid>

              {/* Business Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Business Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Business Registration Number"
                  error={!!errors.businessRegistrationNumber}
                  helperText={errors.businessRegistrationNumber?.message}
                  {...register('businessRegistrationNumber')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Tax ID"
                  error={!!errors.taxId}
                  helperText={errors.taxId?.message}
                  {...register('taxId')}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Description"
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  {...register('description')}
                />
              </Grid>

              {/* Logo Upload */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor="logo-upload">
                    Company Logo
                  </InputLabel>
                  <Input
                    id="logo-upload"
                    type="file"
                    inputProps={{ accept: 'image/*' }}
                    onChange={handleLogoChange}
                    startAdornment={<CloudUpload sx={{ mr: 1 }} />}
                    sx={{ mt: 2 }}
                  />
                  <FormHelperText>
                    {logoFile ? `Selected: ${logoFile.name}` : 'Upload your company logo (max 5MB)'}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Account Security
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register('password')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Registering...' : 'Register Company'}
            </Button>
            
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Register