import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './navbar/Navbar';
import Home from './components/Home';
import Categories from './components/Categories';
import Profile from './users/Profile';
import SalesHistory from './components/SalesHistory';
import CreateNft from './nfts/CreateNft';
import EditNft from './nfts/EditNft';
import Cart from './carts/Cart';
import Login from './users/Login.jsx';
import { authService } from './services/authService';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  useEffect(() => {
    // Verificar autenticación cada vez que se monta el componente
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Rutas públicas sin Navbar */}
        <Route path="/login" element={<Login />} />

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
                <Cart />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
