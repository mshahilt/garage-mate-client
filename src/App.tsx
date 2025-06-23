import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import AdminRequests from '@/pages/AdminRequests'
import Dashboard from '@/pages/Dashboard'
import DashboardLayout from '@/layout/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthStore } from '@/store/authStore'
import Toast from '@/components/Toast'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Box sx={{ display: 'flex' }}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'admin' ? '/admin/requests' : '/dashboard'} replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminRequests />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            <Navigate 
              to={
                isAuthenticated
                  ? user?.role === 'admin'
                    ? '/admin/requests'
                    : '/dashboard'
                  : '/login'
              }
              replace
            />
          }
        />
      </Routes>
      <Toast />
    </Box>
  )
}

export default App