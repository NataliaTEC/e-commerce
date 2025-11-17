import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import searchIcon from '../assets/icons/microfono.svg'
import cuentaIcon from '../assets/icons/user.svg'
import cartIcon from '../assets/icons/bag.svg'
import LangIcon from '../assets/icons/language.svg'
import './header.css'
import categories from '../data/categories'
import storesIcon from '../assets/icons/stores.svg'
import paymentsIcon from '../assets/icons/paymentMethods.svg'
import aboutIcon from '../assets/icons/people.svg'

export default function Header() {
  const headerRef = useRef(null)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [activeCat, setActiveCat] = useState(categories[0] || null)
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem('locale') || document.documentElement.lang || 'es'
    } catch {
      return 'es'
    }
  })

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (!headerRef.current) return
      const height = headerRef.current.offsetHeight
      document.documentElement.style.setProperty('--header-height', `${height}px`)
    }

    updateHeaderHeight()
    const ro = new ResizeObserver(updateHeaderHeight)
    const observed = headerRef.current
    if (observed) ro.observe(observed)

    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsMobileSearchOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      if (ro && observed) ro.unobserve(observed)
    }
  }, [])

  useEffect(() => {
    try {
      document.documentElement.lang = locale
    } catch (e) {
      console.warn('Could not set document.lang', e)
    }
    try {
      localStorage.setItem('locale', locale)
    } catch (e) {
      console.warn('Could not persist locale', e)
    }
  }, [locale])

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
          
          <button
            type="button"
            className="user-button language-toggle"
            aria-label="Cambiar idioma"
            onClick={() => setLocale((prev) => (prev && String(prev).toLowerCase().startsWith('en') ? 'es' : 'en'))}
          >
            <span className="icon-circle">
              <img src={LangIcon} alt="Lenguaje" className="svg-icon user-icon" />
            </span>
            <span className="language-label">
              {String(locale).toLowerCase().startsWith('en') ? 'English' : 'Español'}
            </span>
            <span className="language-caret">▾</span>
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

      {/* Bottom navigation with categories hamburger and quick links */}
      <nav className="bottom-nav" onMouseLeave={() => setMegaOpen(false)}>
        <div className="bottom-inner">
          <div
            className="all-categories"
            onMouseEnter={() => setMegaOpen(true)}
            onClick={() => setMegaOpen((s) => !s)}
            aria-haspopup="true"
            aria-expanded={megaOpen}
          >
            <button className="hamburger-sm" aria-label="Todas las categorías">
              <span />
              <span />
              <span />
            </button>
            <span className="all-cats-label">Todas las categorías</span>
          </div>
          <div className="bottom-links">
            <Link to="/stores"><img src={storesIcon} alt="Nuestras Tiendas" className="bottom-link-icon"/>Nuestras tiendas</Link>
            <Link to="/payments"><img src={paymentsIcon} alt="Métodos de pago" className="bottom-link-icon"/>Métodos de pago</Link>
            <Link to="/about"><img src={aboutIcon} alt="Sobre nosotros" className="bottom-link-icon"/>Sobre nosotros</Link>
          </div>
        </div>

        {/* Mega menu panel */}
        <div className={`mega-menu ${megaOpen ? 'open' : ''}`} onMouseLeave={() => setMegaOpen(false)}>
          <div className="mega-inner">
            <div className="mega-cats">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`mega-cat ${activeCat && activeCat.id === cat.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveCat(cat)}
                >
                  <button className="mega-cat-btn">{cat.name}</button>
                </div>
              ))}
            </div>

            <div className="mega-content">
              {activeCat ? (
                <div className="mega-panel">
                  <h4>{activeCat.name}</h4>
                  <ul>
                    {activeCat.sub.map((s, i) => (
                      <li key={i}><Link to={`/catalog?categoria=${encodeURIComponent(s)}`}>{s}</Link></li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mega-panel"><p>Seleccione una categoría</p></div>
              )}
            </div>
          </div>
        </div>
      </nav>


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
