// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import PaginaPrincipal from './views/homepage'
import CatalogoProductos from './views/CatalogoProductos'

export default function App() {
  return (
    <div id="app" className="site-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="/CatalogoProductos" element={<CatalogoProductos />} />
          {/* para los links del Header */}
          <Route path="/catalog" element={<CatalogoProductos />} />
        </Routes>
      </main>
    </div>
  )
}
