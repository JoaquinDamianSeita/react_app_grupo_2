import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Snackbar from '../utils/Snackbar'
import { authService } from '../services/authService'
import React from 'react';
import { useSelector } from 'react-redux';

const API_BASE_URL = 'http://localhost:8080';

export default function Profile() {
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    biography: '',
    roleName: ''
  })
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    biography: '',
    roleName: ''
  })
  const navigate = useNavigate()
  const token = useSelector(state => state.auth.token);

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

      case 'address':
        if (!value) {
          error = 'La dirección es obligatoria'
        } else if (value.length < 1 || value.length > 50) {
          error = 'La dirección debe tener entre 1 y 50 caracteres'
        }
        break

      default:
        break
    }

    return error
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (!token) {
          navigate('/login');
          return;
        }

        console.log('Obteniendo datos del usuario...');
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener perfil: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          address: data.address || '',
          biography: data.biography || '',
          roleName: data.roleName || ''
        });
      } catch (err) {
        console.error('Error completo al obtener perfil:', err);
        setError(err.message || 'Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData()
  }, [navigate, token])

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validar todos los campos
    let hasErrors = false
    const newValidationErrors = {}
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field])
      if (error) {
        hasErrors = true
        newValidationErrors[field] = error
      }
    })

    if (hasErrors) {
      setValidationErrors(newValidationErrors)
      setError('Por favor corrige los errores antes de guardar')
      return
    }

    if (!token || !authService.isAuthenticated()) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout()
          navigate('/login')
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.')
        }
        if (data.validation_messages && data.validation_messages.length > 0) {
          throw new Error(data.validation_messages.join(', '))
        }
        if (data.message) {
          throw new Error(data.message)
        }
        throw new Error(data.error || 'Error al actualizar usuario')
      }

      setSuccess(true)
      setUserData({
        ...userData,
        ...formData
      })
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
      if (err.message.includes('Sesión expirada')) {
        navigate('/login')
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      address: userData.address,
      biography: userData.biography || '',
      roleName: userData.roleName
    })
    setValidationErrors({})
    setIsEditing(false)
    setError('')
  }

  const getInputClassName = (fieldName) => {
    const baseClassName = "block w-full rounded-md px-3 py-2 text-gray-900"
    const hasError = validationErrors[fieldName]
    
    return `${baseClassName} ${
      hasError 
        ? 'bg-red-50 outline-red-500 outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500' 
        : 'bg-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
    } placeholder:text-gray-400`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Perfil
            </button>
          )}
        </div>
        
        <div className="p-6 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Nombre de Usuario</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {userData?.username || 'No disponible'}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                    Correo Electrónico
                  </label>
                  {isEditing ? (
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={getInputClassName('email')}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      {userData?.email || 'No disponible'}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
                    Nombre
                  </label>
                  {isEditing ? (
                    <div className="mt-1">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={getInputClassName('firstName')}
                      />
                      {validationErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      {userData?.firstName || 'No disponible'}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
                    Apellido
                  </label>
                  {isEditing ? (
                    <div className="mt-1">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={getInputClassName('lastName')}
                      />
                      {validationErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      {userData?.lastName || 'No disponible'}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-600">
                    Dirección
                  </label>
                  {isEditing ? (
                    <div className="mt-1">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={getInputClassName('address')}
                      />
                      {validationErrors.address && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      {userData?.address || 'No disponible'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Rol</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {userData?.roleName || 'No disponible'}
                  </div>
                </div>
              </div>
            </div>

            {/* Biografía */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Biografía</h2>
              {isEditing ? (
                <div className="mt-1">
                  <textarea
                    id="biography"
                    name="biography"
                    rows={3}
                    value={formData.biography}
                    onChange={handleInputChange}
                    className={getInputClassName('biography')}
                    placeholder="Escribe tu biografía aquí..."
                  />
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md min-h-[100px]">
                  {userData?.biography || 'No hay biografía disponible'}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Guardar Cambios
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <Snackbar
        show={!!error}
        message={error}
        variant="error"
        onClose={() => setError('')}
        position="bottom-right"
      />

      <Snackbar
        show={success}
        message="¡Perfil actualizado con éxito!"
        variant="success"
        onClose={() => setSuccess(false)}
        position="bottom-right"
      />
    </div>
  )
} 