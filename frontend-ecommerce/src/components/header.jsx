import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import searchIcon from '../assets/icons/microfono.svg'
import cuentaIcon from '../assets/icons/user.svg'
import cartIcon from '../assets/icons/bag.svg'
import LangIcon from '../assets/icons/language.svg'
import WishIcon from '../assets/icons/heart.svg'
import './header.css'
import categories from '../data/categories'
import storesIcon from '../assets/icons/stores.svg'
import paymentsIcon from '../assets/icons/paymentMethods.svg'
import aboutIcon from '../assets/icons/people.svg'
import { fetchCartCount, fetchCart, addToCart } from '../services/ecommerceApi'
import closeIcon from '../assets/icons/close.svg'
import removeIcon from '../assets/icons/remove.svg'
import VoiceSearchPanel from "./voiceSearchPanel.jsx";

export default function Header() {
  const headerRef = useRef(null)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [activeCat, setActiveCat] = useState(categories[0] || null)
  const [cartCount, setCartCount] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const cartRef = useRef(null)
  const navigate = useNavigate()
  const [voiceOpen, setVoiceOpen] = useState(false)


  // 🔍 texto de búsqueda (desktop y mobile)
  const [searchTerm, setSearchTerm] = useState('')

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
          setCartOpen(false)
        } else {
          // If clicked inside header but outside the cart popup, close it
          if (cartOpen && cartRef.current && !cartRef.current.contains(e.target)) {
            const btn = headerRef.current.querySelector('.cart-button')
            if (!btn || !btn.contains(e.target)) setCartOpen(false)
          }
        }
      }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      if (ro && observed) ro.unobserve(observed)
    }
  }, [cartOpen])

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

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    const query = searchTerm.trim()

    if (!query) {
      navigate('/CatalogoProductos')
    } else {
      navigate(`/CatalogoProductos?q=${encodeURIComponent(query)}`)
    }

    setIsMobileSearchOpen(false)
  }

  useEffect(() => {
    fetchCartCount().then(setCartCount).catch(() => setCartCount(0))
  }, [])

  useEffect(() => {
    fetchCartCount().then(setCartCount).catch(() => setCartCount(0));

    function handleUpdate() {
      fetchCartCount().then(setCartCount).catch(() => setCartCount(0));
    }

    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, []);

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

        {/* 🔍 Búsqueda desktop */}
        <form
          className="search-container"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            className="search-input"
            placeholder="Búsqueda"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
            <button
              type="button"
              className="search-button"
              aria-label="Buscar por voz"
              onClick={() => setVoiceOpen(true)}
            >
              <img src={searchIcon} alt="Buscar por voz" className="svg-icon search-icon" />
            </button>

        </form>

        <div className="header-icons">
          <button
            className="search-button-mobile"
            aria-label="Buscar"
            onClick={() => setIsMobileSearchOpen((s) => !s)}
          >
            <img src={searchIcon} alt="Buscar" className="svg-icon mobile-search-icon" />
          </button>
          
          <button
            type="button"
            className="user-button language-toggle"
            aria-label="Cambiar idioma"
            onClick={() =>
              setLocale((prev) =>
                prev && String(prev).toLowerCase().startsWith('en') ? 'es' : 'en'
              )
            }
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
              <img src={WishIcon} alt="Wishlist" className="svg-icon wish-icon" />
            </span>
            <span className="icon-badge">0</span>
          </Link>

          <button
            type="button"
            className="cart-button"
            aria-label="Carrito de compras"
            onClick={async (e) => {
              e.preventDefault()
              const next = !cartOpen
              setCartOpen(next)
              if (next) {
                try {
                  const data = await fetchCart()
                  setCartItems(data.items || [])
                  setCartTotal(data.total || 0)
                } catch {
                  setCartItems([])
                  setCartTotal(0)
                }
              }
            }}
          >
            <span className="icon-circle">
              <img src={cartIcon} alt="Carrito" className="svg-icon cart-icon" />
            </span>
            <span className="icon-badge">{cartCount}</span>
          </button>

          {/* Small cart popup */}
          {cartOpen && (
            <div ref={cartRef} className="cart-popup" role="dialog" aria-label="Carrito rápido">
              <div className="cart-popup-header">
                <strong>Artículo agregado a tu carrito</strong>
                <button className="cart-popup-close" aria-label="Cerrar" onClick={() => setCartOpen(false)}>
                  <img src={closeIcon} alt="Cerrar" />
                </button>
              </div>

              <div className="cart-popup-list">
                {cartItems && cartItems.length > 0 ? (
                  cartItems.slice(0, 5).map((it, i) => {
                    const product = it.product || it
                    return (
                      <div key={i} className="cart-popup-item">
                        <img src={product.ruta} alt={product.name} />
                        <div className="item-info">
                          <div className="item-name">{product.name}</div>
                          <div className="item-qty">Cantidad: 
                            <button className="qty-btn" aria-label={`Disminuir ${product.name}`} onClick={async () => {
                              try {
                                await addToCart(product.id, -1)
                                const data = await fetchCart()
                                setCartItems(data.items || [])
                                setCartTotal(data.total || 0)
                                window.dispatchEvent(new Event('cart-updated'))
                              } catch {
                                // ignore
                              }
                            }}>−</button>
                            <strong>{it.quantity}</strong>
                            <button className="qty-btn" aria-label={`Aumentar ${product.name}`} onClick={async () => {
                              try {
                                await addToCart(product.id, 1)
                                const data = await fetchCart()
                                setCartItems(data.items || [])
                                setCartTotal(data.total || 0)
                                window.dispatchEvent(new Event('cart-updated'))
                              } catch {
                                // ignore
                              }
                            }}>+</button>
                            <button className="remove-btn" aria-label={`Remover ${product.name}`} onClick={async () => {
                              try {
                                await addToCart(product.id, -it.quantity)
                                const data = await fetchCart()
                                setCartItems(data.items || [])
                                setCartTotal(data.total || 0)
                                window.dispatchEvent(new Event('cart-updated'))
                              } catch {
                                // ignore
                              }
                            }}>
                              <img src={removeIcon} alt="Remover" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="cart-popup-empty">No tiene artículos en el carrito.</div>
                )}
              </div>

              <div className="cart-popup-subtotal">
                <div className="subtotal-left">Subtotal</div>
                <div className="subtotal-right">
                  <div className="subtotal-value">₡{Number(cartTotal || 0).toLocaleString('es-CR')}</div>
                  <div className="tax-note">(impuesto incluido)</div>
                </div>
              </div>

              <div className="cart-popup-actions">
                <button className="cart-popup-btn ghost" onClick={() => { setCartOpen(false); navigate('/carrito') }}>
                  Ver carrito ({cartCount})
                </button>
                <button className="cart-popup-btn primary" onClick={() => { setCartOpen(false); navigate('/carrito') }}>
                  Pagar pedido
                </button>
              </div>
            </div>
          )}
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
            <Link to="/stores">
              <img src={storesIcon} alt="Nuestras Tiendas" className="bottom-link-icon" />
              Nuestras tiendas
            </Link>
            <Link to="/payments">
              <img src={paymentsIcon} alt="Métodos de pago" className="bottom-link-icon" />
              Métodos de pago
            </Link>
            <Link to="/about">
              <img src={aboutIcon} alt="Sobre nosotros" className="bottom-link-icon" />
              Sobre nosotros
            </Link>
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
                  <button
                    className="mega-cat-btn"
                    onClick={() =>
                      navigate(
                        `/CatalogoProductos?categoria=${encodeURIComponent(
                          cat.slug.toLowerCase()
                        )}`
                      )
                    }
                  >
                    {cat.name}
                  </button>
                </div>
              ))}
            </div>

            <div className="mega-content">
              {activeCat ? (
                <div className="mega-panel">
                  <h4>{activeCat.name}</h4>

                  <div className="mega-subsections">
                    {Array.isArray(activeCat.sub) && activeCat.sub.length > 0 ? (
                      activeCat.sub.map((s, i) => {
                        if (typeof s === 'string') {
                          return (
                            <div key={i} className="mega-subsection simple">
                              <Link
                                to={`/CatalogoProductos?categoria=${encodeURIComponent(
                                  s.toLowerCase()
                                )}`}
                              >
                                {s}
                              </Link>
                            </div>
                          )
                        }

                        if (s && typeof s === 'object') {
                          return (
                            <div key={i} className="mega-subsection">
                              <div className="mega-subsection-title">{s.name}</div>
                              <ul className="mega-subsection-products">
                                {Array.isArray(s.products) &&
                                  s.products.map((p, j) => (
                                    <li key={j}>
                                      <Link
                                        to={`/CatalogoProductos?categoria=${encodeURIComponent(
                                          p.toLowerCase()
                                        )}`}
                                      >
                                        {p}
                                      </Link>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )
                        }

                        return null
                      })
                    ) : (
                      <div className="mega-subsection empty">No hay subcategorías</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mega-panel">
                  <p>Seleccione una categoría</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🔍 Búsqueda móvil */}
      {isMobileSearchOpen && (
        <div className="mobile-search-overlay">
          <form
            className="mobile-search-form"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              className="search-input"
              placeholder="Buscar Productos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Buscar">
              Buscar
            </button>
          </form>
        </div>
      )}
      {/* 🎤 Panel de búsqueda por voz */}
      {voiceOpen && (
        <VoiceSearchPanel
          initialValue={searchTerm}
          onClose={() => setVoiceOpen(false)}
          onResult={(value) => {
            const q = value.trim()
            setVoiceOpen(false)
            if (!q) return
            setSearchTerm(q)
            navigate(`/CatalogoProductos?q=${encodeURIComponent(q)}`)
          }}
        />
      )}
    </div>
  )
}
