import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/nuevologo.png'
import searchIcon from '../assets/icons/microfono.svg'
import cuentaIcon from '../assets/icons/cuenta.svg'
import cartIcon from '../assets/icons/bag.svg'
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
          <input type="text" className="search-input" placeholder="Búsqueda" />
          <button type="submit" className="search-button" aria-label="Buscar">
            <img src={searchIcon} alt="Buscar" className="svg-icon search-icon" />
          </button>
        </form>

        <div className="header-icons">
          <button className="search-button-mobile" aria-label="Buscar" onClick={() => setIsMobileSearchOpen((s) => !s)}>
            <img src={searchIcon} alt="Buscar" className="svg-icon mobile-search-icon" />
          </button>

          <Link to="/Login" className="user-button" aria-label="Menú de usuario">
            <span className="icon-circle">
              <img src={cuentaIcon} alt="Mi Cuenta" className="svg-icon user-icon" />
            </span>
          </Link>

          <Link to="/wishlist" className="wishlist-button" aria-label="Wishlist">
            <span className="icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"></path>
              </svg>
            </span>
            <span className="icon-badge">0</span>
          </Link>

          <Link to="/cart" className="cart-button" aria-label="Carrito de compras">
            <span className="icon-circle">
              <img src={cartIcon} alt="Carrito" className="svg-icon cart-icon" />
            </span>
            <span className="icon-badge">0</span>
          </Link>
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
