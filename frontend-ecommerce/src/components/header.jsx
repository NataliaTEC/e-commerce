import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/nuevologo.png'
import './header.css'

export default function Header() {
  const headerRef = useRef(null)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (!headerRef.current) return
      const height = headerRef.current.offsetHeight
      document.documentElement.style.setProperty('--header-height', `${height}px`)
    }

    updateHeaderHeight()
    const ro = new ResizeObserver(updateHeaderHeight)
    if (headerRef.current) ro.observe(headerRef.current)

    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsMobileSearchOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      if (ro && headerRef.current) ro.unobserve(headerRef.current)
    }
  }, [])

  return (
    <div className="header-navigation-container" ref={headerRef}>
      <header className="app-header">
        <button
          className="hamburger-header"
          onClick={() => {
            /* placeholder for mobile menu toggle if needed later */
          }}
          aria-expanded={false}
          aria-controls="main-menu"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <div className="logo-section">
          <Link to="/" className="logo-link">
            <h1>
              <img src={logo} alt="Logo" className="logo" />
            </h1>
          </Link>
        </div>

        <form
          className="search-container"
          onSubmit={(e) => {
            e.preventDefault()
            // Implementar búsqueda si lo desea
          }}
        >
          <input type="text" className="search-input" placeholder="Buscar Productos" />
          <button type="submit" className="search-button" aria-label="Buscar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        <div className="header-icons">
          <button className="search-button-mobile" aria-label="Buscar" onClick={() => setIsMobileSearchOpen((s) => !s)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <Link to="/Login" className="user-button" aria-label="Menú de usuario">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="profile-name">Mi Cuenta</span>
          </Link>

          <button className="cart-button" aria-label="Carrito de compras">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-text">Mi Carrito</span>
          </button>
        </div>
      </header>


      {isMobileSearchOpen && (
        <div className="mobile-search-overlay">
          <form className="mobile-search-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" className="search-input" placeholder="Buscar Productos" />
            <button type="submit" className="search-button" aria-label="Buscar">
              Buscar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
