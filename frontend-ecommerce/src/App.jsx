import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import PaginaPrincipal from './views/homepage'

export default function App() {
  return (
    <div id="app" className="site-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          {/* Add other routes here when ready */}
        </Routes>
      </main>
    </div>
  )
}
