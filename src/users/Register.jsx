import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Snackbar from '../utils/Snackbar'
import { authService } from '../services/authService'

const API_BASE_URL = 'http://localhost:8080';

export default function Register() {
    const [error, setError] = useState('')
    const [showError, setShowError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [success, setSuccess] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      address: '',
      biography: '',
      roleId: ''
    })
    const [validationErrors, setValidationErrors] = useState({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      address: '',
      biography: '',
      roleId: ''
    })
    const navigate = useNavigate()

    const validateField = (name, value) => {
      let error = ''
      
      switch (name) {
        case 'firstName':
        case 'lastName':
          if (!value) {
            error = `El ${name === 'firstName' ? 'nombre' : 'apellido'} es obligatorio`
          } else if (value.length < 1 || value.length > 50) {
            error = `El ${name === 'firstName' ? 'nombre' : 'apellido'} debe tener entre 1 y 50 caracteres`
          }
          break

        case 'email':
          if (!value) {
            error = 'El correo electrónico es obligatorio'
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            error = 'El correo electrónico debe ser válido'
          } else if (value.length > 50) {
            error = 'El correo electrónico no puede exceder los 50 caracteres'
          }
          break

        case 'username':
          if (!value) {
            error = 'El nombre de usuario es obligatorio'
          } else if (value.length < 1 || value.length > 50) {
            error = 'El nombre de usuario debe tener entre 1 y 50 caracteres'
          }
          break

        case 'password':
          if (!value) {
            error = 'La contraseña es obligatoria'
          } else if (value.length < 8) {
            error = 'La contraseña debe tener al menos 8 caracteres'
          }
          break

        case 'confirmPassword':
          if (!value) {
            error = 'Debe confirmar la contraseña'
          } else if (value !== formData.password) {
            error = 'Las contraseñas no coinciden'
          }
          break

        case 'address':
          if (!value) {
            error = 'La dirección es obligatoria'
          } else if (value.length < 1 || value.length > 50) {
            error = 'La dirección debe tener entre 1 y 50 caracteres'
          }
          break

        case 'biography':
          if (!value) {
            error = 'La biografía es obligatoria'
          }
          break

        case 'roleId':
          if (!value) {
            error = 'Debe seleccionar un rol'
          }
          break

        default:
          break
      }

      return error
    }

    const handleCloseError = () => {
      setShowError(false)
      setError('')
    }

    const togglePasswordVisibility = (field) => {
      if (field === 'password') {
        setShowPassword(!showPassword)
      } else {
        setShowConfirmPassword(!showConfirmPassword)
      }
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))

      const error = validateField(name, value)
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }))

      // Validar confirmPassword cuando cambia password
      if (name === 'password' && formData.confirmPassword) {
        const confirmError = validateField('confirmPassword', formData.confirmPassword)
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: confirmError
        }))
      }
    }

    const validateStep = (step) => {
      let isValid = true
      let fieldsToValidate = []

      switch (step) {
        case 1:
          fieldsToValidate = ['firstName', 'lastName', 'email']
          break
        case 2:
          fieldsToValidate = ['username', 'password', 'confirmPassword']
          break
        case 3:
          fieldsToValidate = ['address', 'biography', 'roleId']
          break
        default:
          return false
      }

      // Validar todos los campos del paso actual
      fieldsToValidate.forEach(field => {
        const error = validateField(field, formData[field])
        setValidationErrors(prev => ({
          ...prev,
          [field]: error
        }))
        if (error) {
          isValid = false
        }
      })

      return isValid
    }

    const handleNext = () => {
      if (validateStep(currentStep)) {
        setCurrentStep(prev => prev + 1)
        setError('')
        setShowError(false)
      } else {
        setError('Por favor corrige los errores antes de continuar')
        setShowError(true)
      }
    }

    const handleBack = () => {
      setCurrentStep(prev => prev - 1)
      setError('')
      setShowError(false)
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!validateStep(3)) {
        setError('Por favor corrige los errores antes de enviar el formulario')
        setShowError(true)
        return
      }

      setError('')
      setShowError(false)
      setSuccess(false)

      const userData = {
        ...formData,
        roleId: parseInt(formData.roleId)
      }
      delete userData.confirmPassword

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })

        const data = await response.json()

        if (!response.ok) {
          if (data.validation_messages && data.validation_messages.length > 0) {
            throw new Error(data.validation_messages.join(', '))
          }
          if (data.message) {
            throw new Error(data.message)
          }
          throw new Error(data.error || 'Error al registrar usuario')
        }

        setSuccess(true)
        // Login automático después del registro exitoso
        try {
          await authService.login(formData.username, formData.password)
          navigate('/')
        } catch (loginError) {
          setError('Registro exitoso, pero error al iniciar sesión automáticamente: ' + (loginError.message || ''))
          setShowError(true)
        }
      } catch (err) {
        setError(err.message)
        setShowError(true)

        if (err.message === 'El email ya está en uso.') {
          setValidationErrors(prev => ({
            ...prev,
            email: err.message
          }))
          if (currentStep !== 1) {
            setCurrentStep(1)
          }
        } else if (err.message === 'El email o el username ya está en uso.') {
          setValidationErrors(prev => ({
            ...prev,
            email: 'El email o nombre de usuario ya está en uso',
            username: 'El email o nombre de usuario ya está en uso'
          }))
          if (currentStep === 3) {
            setCurrentStep(2)
          } else if (currentStep === 2) {
            // No hacer nada con el currentStep
          } else {
            // No hacer nada con el currentStep
          }
        }
      }
    }

    const getInputClassName = (fieldName) => {
      const baseClassName = "block w-full rounded-md px-3 py-2 text-lg text-gray-900"
      const hasError = validationErrors[fieldName]
      
      return `${baseClassName} ${
        hasError 
          ? 'bg-red-50 outline-red-500 outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600' 
          : 'bg-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600'
      } placeholder:text-gray-400`
    }

    const renderStepContent = () => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={getInputClassName('firstName')}
                />
                {validationErrors.firstName && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={getInputClassName('lastName')}
                />
                {validationErrors.lastName && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.lastName}
                  </p>
                )}
              </div>

              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  className={getInputClassName('email')}
                />
                {validationErrors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>
            </div>
          )
        case 2:
          return (
            <div className="space-y-6">
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Usuario"
                  value={formData.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                  className={getInputClassName('username')}
                />
                {validationErrors.username && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.username}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    className={getInputClassName('password')}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 hover:text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 hover:text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirmar Contraseña"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    className={getInputClassName('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 hover:text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 hover:text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          )
        case 3:
          return (
            <div className="space-y-6">
              <div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="Dirección"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={getInputClassName('address')}
                />
                {validationErrors.address && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.address}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  id="biography"
                  name="biography"
                  required
                  placeholder="Biografía"
                  rows={3}
                  value={formData.biography}
                  onChange={handleInputChange}
                  className={getInputClassName('biography')}
                />
                {validationErrors.biography && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.biography}
                  </p>
                )}
              </div>

              <div>
                <select
                  id="roleId"
                  name="roleId"
                  required
                  value={formData.roleId}
                  onChange={handleInputChange}
                  className={getInputClassName('roleId')}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="1">Comprador</option>
                  <option value="2">Artista</option>
                </select>
                {validationErrors.roleId && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.roleId}
                  </p>
                )}
              </div>
            </div>
          )
        default:
          return null
      }
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          {/* Imagen lado izquierdo */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <img
              src="/images/bored-ape-yacht-club.jpg"
              alt="Bored Ape NFTs"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Formulario lado derecho */}
          <div className="flex w-full lg:w-1/2 flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-sm">
              <div className="flex items-center justify-center mb-6">
                <img
                  alt="Tu Empresa"
                  src="/images/icon.svg"
                  className="h-10 sm:h-12"
                />
                <span className="ml-3 font-reem text-3xl sm:text-[40px] leading-[30px] tracking-[0.5px] font-semibold text-gray-900">
                  Mint & Frame
                </span>
              </div>
              
              <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Registro
              </h2>
              <p className="mt-2 text-lg sm:text-xl font-semibold text-gray-600">
                Paso {currentStep} de 3
              </p>
    
              <div className="mt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderStepContent()}

                  <div className="flex justify-between gap-4">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex w-full justify-center rounded-md bg-gray-100 px-4 py-2 text-base sm:text-lg font-semibold text-gray-900 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      >
                        Anterior
                      </button>
                    )}
                    
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex w-full justify-center rounded-md bg-cyan-600 px-4 py-2 text-base sm:text-lg font-semibold text-white hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                      >
                        Siguiente
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-cyan-600 px-4 py-2 text-base sm:text-lg font-semibold text-white hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                      >
                        Registrarse
                      </button>
                    )}
                  </div>
                </form>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <p className="text-base sm:text-lg text-gray-600">
                    ¿Ya tenés una cuenta?{' '}
                    <Link to="/login" className="text-base sm:text-lg font-semibold text-gray-900 hover:text-gray-700">
                      Ingresá aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Snackbar
          show={showError}
          message={error}
          variant="error"
          onClose={handleCloseError}
          position="bottom-right"
        />

        <Snackbar
          show={success}
          message="¡Usuario registrado con éxito! Redirigiendo al login..."
          variant="success"
          position="bottom-right"
        />
      </div>
    )
  }