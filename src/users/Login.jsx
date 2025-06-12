import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Snackbar from '../utils/Snackbar'
import { authService } from '../services/authService'

export default function Login() {
    const [error, setError] = useState('')
    const [showError, setShowError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleCloseError = () => {
      setShowError(false)
      setError('')
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')
      setIsLoading(true)

      const formData = new FormData(e.target)
      const credentials = {
        username: formData.get('username'),
        password: formData.get('password')
      }

      try {
        console.log('Iniciando proceso de login...')
        await authService.login(credentials.username, credentials.password)
        console.log('Login exitoso, redirigiendo...')
        navigate('/profile')
      } catch (err) {
        console.error('Error en el proceso de login:', err)
        setError(err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.')
        setShowError(true)
      } finally {
        setIsLoading(false)
      }
    }

    const inputClassName = `block w-full rounded-md px-3 py-2 text-lg text-gray-900 
      ${error ? 'bg-red-50 outline-red-500 outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500' 
      : 'bg-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'} 
      placeholder:text-gray-400`

    return (
      <>
        <div className="flex h-screen">
          {/* Imagen lado izquierdo */}
          <div className="hidden lg:block lg:w-1/2">
            <img
              src="/images/kitty-nfts.jpg"
              alt="Kitty NFTs"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Formulario lado derecho */}
          <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 lg:px-20 bg-gray-50">
            <div className="w-full max-w-xl max-h-xl mx-auto -mt-20 bg-white p-20 rounded-lg shadow-sm">
              <div className="flex items-center justify-center mb-6">
                <img
                  alt="Tu Empresa"
                  src="/images/icon.svg"
                  className="h-12"
                />
                <span className="ml-3 font-reem text-[40px] leading-[30px] tracking-[0.5px] font-semibold text-gray-900">Mint & Frame</span>
              </div>
              <h2 className="mt-12 text-3xl font-bold tracking-tight text-gray-900">
                Login
              </h2>
              <p className="mt-2 text-xl font-semibold text-gray-600">
                Ingresá a tu cuenta para continuar
              </p>
    
              <div className="mt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      placeholder="Usuario"
                      autoComplete="username"
                      className={inputClassName}
                      disabled={isLoading}
                    />
                  </div>
    
                  <div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Contraseña"
                      autoComplete="current-password"
                      className={inputClassName}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      disabled={isLoading}
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

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-cyan-600 px-4 py-2 text-lg font-semibold text-white hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                  </div>
                </form>
                <div className="mt-6">
                  <Link to="/" className="text-lg font-semibold text-gray-900 hover:text-gray-700">
                    ← Regresar al inicio
                  </Link>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <p className="text-lg text-gray-600">
                    ¿No tenés una cuenta?{' '}
                    <Link to="/register" className="text-lg font-semibold text-gray-900 hover:text-gray-700">
                      Registrate aquí
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
      </>
    )
  } 