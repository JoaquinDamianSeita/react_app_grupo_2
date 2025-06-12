import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './users/Login.jsx'
import Register from './users/Register.jsx'
import Home from './components/errors/Home.jsx'
import Profile from './users/Profile.jsx'
import NotFound from './components/errors/NotFound.jsx'
import ShowCart from './carts/Show.jsx'
import Checkout from './carts/Checkout.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<ShowCart />} />
        <Route path="/cart/checkout/:cartId" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
