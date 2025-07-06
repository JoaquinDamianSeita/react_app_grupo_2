import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_BASE_URL = 'http://localhost:8080';

const SalesHistory = () => {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);

  const fetchSales = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sales`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el historial de ventas/compras');
      }

      const data = await response.json();
      // Filter out sales with price 0
      const validSales = data.filter(sale => sale.salePrice > 0);
      setSales(validSales);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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

        // Fetch sales data after getting user role
        await fetchSales(token);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
    <div className="container mx-auto px-4 py-8" style={{ backgroundColor: '#0092BB' }}>
      <h1 className="text-3xl font-bold mb-6 text-white">{getTitle()}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        {sales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Venta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NFTs</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <tr key={sale.saleId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{sale.saleId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(sale.saleDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.salePrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {sale.nfts.map((nft) => (
                          <div key={nft.id} className="text-sm">
                            <p className="font-medium text-gray-900">{nft.title}</p>
                            <p className="text-gray-500">
                              Artista: {nft.artist.firstName} {nft.artist.lastName}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>{userRole === 'BUYER' ? 'No tiene compras realizadas' : 'No tiene ventas realizadas'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SalesHistory;
