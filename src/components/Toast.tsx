import React from 'react'
import { Snackbar, Alert, Slide, type SlideProps } from '@mui/material'
import { useToast as useToastContext } from '@/context/ToastContext'

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />
}

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToastContext()

  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => removeToast(toast.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          style={{
            bottom: `${(index * 70) + 20}px`,
          }}
        >
          <Alert
            onClose={() => removeToast(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{
              width: '100%',
              minWidth: '300px',
              maxWidth: '500px',
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}

export default Toast