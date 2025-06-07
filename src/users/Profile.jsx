import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken')
      
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('No se pudo obtener la información del usuario')
        }

        const data = await response.json()
        setUserData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-900 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Información Personal */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre de Usuario</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {userData?.username}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">Correo Electrónico</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {userData?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {userData?.firstName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Apellido</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {userData?.lastName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Dirección</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {userData?.address}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Rol</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {userData?.roleName}
                </div>
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Biografía</h2>
            <div className="p-3 bg-gray-50 rounded-md">
              {userData?.biography || 'No hay biografía disponible'}
            </div>
          </div>

          {/* Botón de Editar - Deshabilitado por ahora */}
          <div className="flex justify-end">
            <button
              type="button"
              disabled
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Perfil (Próximamente)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 