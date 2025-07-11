import { useEffect } from 'react'

const VARIANTS = {
  error: {
    container: 'bg-red-100 border-red-400 text-red-700',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
      </svg>
    )
  },
  success: {
    container: 'bg-green-100 border-green-400 text-green-700',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    )
  },
  warning: {
    container: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
    )
  },
  info: {
    container: 'bg-blue-100 border-blue-400 text-blue-700',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
      </svg>
    )
  }
}

export default function Snackbar({ 
  show, 
  message, 
  variant = 'info', 
  onClose,
  autoHideDuration = 3000,
  position = 'bottom-right'
}) {
  useEffect(() => {
    if (show && autoHideDuration && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoHideDuration)
      return () => clearTimeout(timer)
    }
  }, [show, autoHideDuration, onClose])

  if (!show) return null

  const variantStyle = VARIANTS[variant] || VARIANTS.info
  
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }

  return (
    <div className={`fixed ${positionClasses[position]} flex items-center border px-4 py-3 rounded shadow-lg transition-all duration-500 ease-in-out transform translate-y-0 ${variantStyle.container}`}>
      <div className="flex items-center">
        {variantStyle.icon}
        <p>{message}</p>
      </div>
    </div>
  )
} 