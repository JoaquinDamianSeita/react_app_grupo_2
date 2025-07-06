import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useSelector, useDispatch } from 'react-redux';
import { clearToken } from '../store';

const API_BASE_URL = 'http://localhost:8080';

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
  const [showNftDropdown, setShowNftDropdown] = useState(false);
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          console.log('No token found');
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
          if (response.status === 401) {
            authService.logout();
            navigate('/login');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserRole(data.roleName);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        if (error.message.includes('401')) {
          authService.logout();
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate, token]);

  const handleLogout = () => {
    authService.logout(token);
    dispatch(clearToken());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/images/icon.svg"
                alt="Icon"
                className="h-8 w-auto"
              />
                <span className="ml-3 font-reem text-[32px] leading-[24px] tracking-[0.3px] font-semibold text-gray-900">Mint & Frame</span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900 font-medium">
              Categorías
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900 font-medium">
              Perfil
            </Link>

            {/* Conditional rendering based on user role */}
            {userRole === 'BUYER' && (
              <Link to="/sales-history" className="text-gray-600 hover:text-gray-900 font-medium">
                Compras
              </Link>
            )}

            {userRole === 'ARTIST' && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNftDropdown(!showNftDropdown)}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    NFT
                  </button>
                  {showNftDropdown && (
                    <div className="absolute z-10 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
                      <Link
                        to="/edit-nft"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Editar NFT
                      </Link>
                      <Link
                        to="/create-nft"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Subir NFT
                      </Link>
                    </div>
                  )}
                </div>
                <Link to="/sales-history" className="text-gray-600 hover:text-gray-900 font-medium">
                  Ventas
                </Link>
              </>
            )}
          </div>

          {/* Right side - Search, Cart, and Logout */}
          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <img src="/images/lupa.svg" alt="Search" className="h-5 w-5" style={{ minWidth: '20px' }} />
            </Link>
            <Link 
              to="/cart"
              className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <img src="/images/cart.svg" alt="Cart" className="h-5 w-5" style={{ minWidth: '20px' }} />
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
