import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './navbar/Navbar';
import Home from './components/Home';
import Categories from './components/Categories';
import Products from './products/Products';
import Profile from './users/Profile';
import SalesHistory from './components/SalesHistory';
import CreateNft from './nfts/CreateNft';
import EditNft from './nfts/EditNft';
import ShowNft from './nfts/ShowNft';
import Login from './users/Login.jsx';
import ShowCart from './carts/Show.jsx'
import Checkout from './carts/Checkout.jsx';
import Register from './users/Register.jsx';
import { authService } from './services/authService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const token = useSelector(state => state.auth.token);
  const isAuthenticated = !!token;
  
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, redirigiendo a login...');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para el layout con Navbar
const LayoutWithNavbar = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Rutas públicas sin Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Ruta raíz redirige a login si no está autenticado */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <Home />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />

          {/* Ruta de productos */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <Products />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />

          {/* Ruta para mostrar un NFT específico */}
          <Route
            path="/nfts/:id"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <ShowNft />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />

          {/* Otras rutas con Navbar */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <Categories />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas con Navbar */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <Profile />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales-history"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <SalesHistory />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-nft"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <CreateNft />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-nft"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <EditNft />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                <ShowCart />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart/checkout/:cartId"
            element={
              <ProtectedRoute>
                <LayoutWithNavbar>
                  <Checkout />
                </LayoutWithNavbar>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
