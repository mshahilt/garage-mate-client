import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Collapse,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import {
  CheckCircle,
  Cancel,
  Visibility,
  ExpandMore,
  ExpandLess,
  Business,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material'
import { companyApi } from '@/services/companyApi'
import useToast from '@/hooks/useToast'
import {type CompanyRequest } from '@/types/Company'

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<CompanyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<CompanyRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view'>('view')
  const [adminNotes, setAdminNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const toast = useToast()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await companyApi.getCompanyRequests()
      setRequests(response.data)
    } catch (error) {
      toast.error('Failed to fetch company requests')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (request: CompanyRequest, action: 'approve' | 'reject' | 'view') => {
    setSelectedRequest(request)
    setActionType(action)
    setAdminNotes('')
    setDialogOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedRequest || actionType === 'view') return

    try {
      setProcessing(true)
      await companyApi.updateCompanyStatus(
        selectedRequest.id,
        actionType === 'approve' ? 'approved' : 'rejected',
        adminNotes
      )
      
      // Update local state
      setRequests(prev =>
        prev.map(req =>
          req.id === selectedRequest.id
            ? { ...req, status: actionType === 'approve' ? 'approved' : 'rejected', adminNotes }
            : req
        )
      )
      
      toast.success(`Company ${actionType}d successfully`)
      setDialogOpen(false)
    } catch (error) {
      toast.error(`Failed to ${actionType} company`)
    } finally {
      setProcessing(false)
    }
  }

  const toggleCardExpansion = (requestId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(requestId)) {
        newSet.delete(requestId)
      } else {
        newSet.add(requestId)
      }
      return newSet
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedRequest(null)
    setAdminNotes('')
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Company Registration Requests
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Review and manage company registration requests
      </Typography>

      {requests.length === 0 ? (
        <Alert severity="info">
          No company registration requests found.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {requests.map((request) => {
            const isExpanded = expandedCards.has(request.id)
            return (
              <Grid xs={12} key={request.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="between" alignItems="flex-start" mb={2}>
                      <Box flexGrow={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Business color="primary" />
                          <Typography variant="h6">{request.name}</Typography>
                          <Chip
                            label={request.status.toUpperCase()}
                            color={getStatusColor(request.status) as any}
                            size="small"
                          />
                        </Box>
                        
                        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Email fontSize="small" color="action" />
                            <Typography variant="body2">{request.email}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Phone fontSize="small" color="action" />
                            <Typography variant="body2">{request.phone}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2">
                              {request.city}, {request.state}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          onClick={() => toggleCardExpansion(request.id)}
                          size="small"
                        >
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    </Box>

                    <Collapse in={isExpanded}>
                      <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Address:</strong> {request.address}
                            </Typography>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Business Reg. No:</strong> {request.businessRegistrationNumber}
                            </Typography>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Tax ID:</strong> {request.taxId}
                            </Typography>
                          </Grid>
                          {request.website && (
                            <Grid xs={12} md={6}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Website:</strong> {request.website}
                              </Typography>
                            </Grid>
                          )}
                          {request.description && (
                            <Grid xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Description:</strong> {request.description}
                              </Typography>
                            </Grid>
                          )}
                          <Grid xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          {request.adminNotes && (
                            <Grid xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Admin Notes:</strong> {request.adminNotes}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                        
                        {request.status === 'pending' && (
                          <Box display="flex" gap={1} sx={{ mt: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleAction(request, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleAction(request, 'reject')}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleAction(request, 'view')}
                            >
                              View Details
                            </Button>
                          </Box>
                        )}
                        
                        {request.status !== 'pending' && (
                          <Box display="flex" gap={1} sx={{ mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleAction(request, 'view')}
                            >
                              View Details
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {actionType === 'approve' && 'Approve Company Registration'}
          {actionType === 'reject' && 'Reject Company Registration'}
          {actionType === 'view' && 'Company Registration Details'}
        </DialogTitle>
        
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedRequest.name}
                  </Typography>
                </Grid>
                
                <Grid xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {selectedRequest.email}
                  </Typography>
                </Grid>
                
                <Grid xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Phone:</strong> {selectedRequest.phone}
                  </Typography>
                </Grid>
                
                <Grid xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Address:</strong> {selectedRequest.address}, {selectedRequest.city}, {selectedRequest.state}
                  </Typography>
                </Grid>
                
                <Grid xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Business Registration Number:</strong> {selectedRequest.businessRegistrationNumber}
                  </Typography>
                </Grid>
                
                <Grid xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Tax ID:</strong> {selectedRequest.taxId}
                  </Typography>
                </Grid>
                
                {selectedRequest.website && (
                  <Grid xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Website:</strong> {selectedRequest.website}
                    </Typography>
                  </Grid>
                )}
                
                {selectedRequest.description && (
                  <Grid xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Description:</strong> {selectedRequest.description}
                    </Typography>
                  </Grid>
                )}
                
                <Grid xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Status:</strong> {selectedRequest.status.toUpperCase()}
                  </Typography>
                </Grid>
                
                <Grid xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                
                {selectedRequest.adminNotes && (
                  <Grid xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Previous Admin Notes:</strong> {selectedRequest.adminNotes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              {(actionType === 'approve' || actionType === 'reject') && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Admin Notes (Optional)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={`Enter notes for ${actionType}ing this company registration...`}
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={processing}>
            {actionType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          
          {actionType !== 'view' && (
            <Button
              onClick={handleConfirmAction}
              variant="contained"
              color={actionType === 'approve' ? 'success' : 'error'}
              disabled={processing}
              startIcon={processing ? <CircularProgress size={16} /> : null}
            >
              {processing ? 'Processing...' : `${actionType === 'approve' ? 'Approve' : 'Reject'} Company`}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminRequests