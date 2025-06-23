import { useToast as useToastContext } from '@/context/ToastContext'

export const useToast = () => {
  const { showToast } = useToastContext()

  const toast = {
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration),
  }

  return toast
}

export default useToast