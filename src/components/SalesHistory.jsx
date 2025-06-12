import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const API_BASE_URL = 'http://localhost:8080';

const SalesHistory = () => {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener datos del usuario');
        }

        const data = await response.json();
        setUserRole(data.roleName);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const getTitle = () => {
    switch (userRole) {
      case 'BUYER':
        return 'Historial de Compras';
      case 'ARTIST':
        return 'Historial de Ventas';
      default:
        return 'Historial';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{getTitle()}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        {userRole === 'BUYER' ? (
          <div>
            {/* Contenido específico para compradores */}
            <p className="text-gray-600">Aquí verás el historial de tus compras de NFTs.</p>
          </div>
        ) : userRole === 'ARTIST' ? (
          <div>
            {/* Contenido específico para artistas */}
            <p className="text-gray-600">Aquí verás el historial de tus ventas de NFTs.</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600">No hay información disponible para mostrar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesHistory; 