// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import PaginaPrincipal from './views/homepage'
import CatalogoProductos from './views/CatalogoProductos'
import CarritoProductos from './views/carritoProductos'
import LoginPage from './views/loginPage'
import SobreNosotros from './views/sobreNosotros'
import DetalleProducto from './views/detalleProducto'
import PaymentMethods from "./views/paymentMethods"

export default function App() {
  return (
    <div id="app" className="site-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/CatalogoProductos" element={<CatalogoProductos />} />
          <Route path="/carrito" element={<CarritoProductos />} />
          <Route path="/sobreNosotros" element={<SobreNosotros />} />
          <Route path="/detalleProducto/:id" element={<DetalleProducto />} />
          <Route path="/payments" element={<PaymentMethods />} />
          {/* para los links del Header */}
          <Route path="/catalog" element={<CatalogoProductos />} />
        </Routes>
      </main>
    </div>
  )
}
