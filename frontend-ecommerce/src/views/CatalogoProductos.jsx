// src/views/CatalogoProductos.jsx
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Header from '../components/header'
import Footer from '../components/footer'
import {
  fetchProductsByCategory,
  fetchProducts,
  fetchProductsBySearch,
  addToCart,
} from '../services/ecommerceApi'
import './catalogoProductos.css'
import categories from '../data/categories'
import downArrow from '../assets/icons/down-arrow.svg'

function useQuery() {
  const { search } = useLocation()
  return new URLSearchParams(search)
}

export default function CatalogoProductos() {
  const query = useQuery()

  const searchText = (query.get('q') || '').trim()
  const categoriaSlug = (query.get('categoria') || '').trim()

  const isSearchMode = searchText.length > 0
  const isCategoryMode = !isSearchMode && categoriaSlug.length > 0
  const isAllMode = !isSearchMode && !isCategoryMode

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    minPrice: '',
    maxPrice: '',
    inStock: false,
  })

  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      setError('')

      try {
        let data = []

        if (isSearchMode) {
          // Búsqueda por texto
          data = await fetchProductsBySearch(searchText)
        } else if (isCategoryMode) {
          // Búsqueda por categoría con fallback
          const normalized = categoriaSlug.toLowerCase()
          let resp = await fetchProductsByCategory(normalized)

          if (!Array.isArray(resp) || resp.length === 0) {
            const todos = await fetchProducts()
            const filtrados = todos.filter((p) => {
              const cat = p.category?.toLowerCase() || ''
              const sub = p.subcategory?.toLowerCase() || ''
              const type = p.productType?.toLowerCase() || ''
              return cat === normalized || sub === normalized || type === normalized
            })
            resp = filtrados
          }

          data = resp
        } else if (isAllMode) {
          // Todos los productos
          data = await fetchProducts()
        }

        setProductos(data)
      } catch (e) {
        console.error(e)
        setError('Error al cargar productos')
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [searchText, categoriaSlug, isSearchMode, isCategoryMode, isAllMode])

  // --- Lógica de carrito (de tu compañero) ---
  const agregarAlCarrito = (productId) => {
    addToCart(productId, 1)
      .then((data) => {
        if (data.ok) alert(`Producto agregado al carrito`)
        else alert(`Error al agregar el producto al carrito: ${data.error}`)
      })
      .catch((err) => alert(`Error al agregar el producto al carrito: ${err}`))
      .finally(() => {
        window.dispatchEvent(new Event('cart-updated'))
      })
  }

  // --- Títulos y pill según modo (de tu compañero, adaptado) ---
  let titulo = ''
  let subtitulo = ''
  let pillLabel = ''
  let pillValue = ''

  if (isSearchMode) {
    titulo = `Resultados para: "${searchText}"`
    subtitulo = 'Estos son los productos que coinciden con tu búsqueda.'
    pillLabel = 'Texto buscado:'
    pillValue = searchText
  } else if (isCategoryMode) {
    titulo = categoriaSlug.charAt(0).toUpperCase() + categoriaSlug.slice(1)
    subtitulo = 'Explora los productos disponibles en esta categoría seleccionada.'
    pillLabel = 'Categoría seleccionada:'
    pillValue = categoriaSlug
  } else {
    titulo = 'Todos los productos'
    subtitulo = 'Explora todos los productos disponibles en la tienda.'
    pillLabel = 'Modo:'
    pillValue = 'Todos'
  }

  // --- Opciones de filtros calculadas a partir de los productos ---
  const availableBrands = useMemo(() => {
    const s = new Set()
    productos.forEach((p) => {
      if (p.brand) s.add(p.brand)
    })
    return Array.from(s).sort()
  }, [productos])

  const availableColors = useMemo(() => {
    const s = new Set()
    productos.forEach((p) => {
      if (p.color) s.add(p.color)
    })
    return Array.from(s).sort()
  }, [productos])

  const minMaxPrice = useMemo(() => {
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    productos.forEach((p) => {
      const price = Number(p.price) || 0
      if (price < min) min = price
      if (price > max) max = price
    })
    if (min === Number.POSITIVE_INFINITY) min = 0
    if (max === Number.NEGATIVE_INFINITY) max = 0
    return { min, max }
  }, [productos])

  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      const brandOk =
        filters.brands.length === 0 ||
        (p.brand && filters.brands.includes(p.brand))
      const colorOk =
        filters.colors.length === 0 ||
        (p.color && filters.colors.includes(p.color))
      const inStockOk = !filters.inStock || (p.stock && p.stock > 0)
      const price = Number(p.price) || 0
      const minOk = !filters.minPrice || Number(filters.minPrice) <= price
      const maxOk = !filters.maxPrice || Number(filters.maxPrice) >= price
      return brandOk && colorOk && inStockOk && minOk && maxOk
    })
  }, [productos, filters])

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts]
    switch (sortBy) {
      case 'price-asc':
        return arr.sort(
          (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0),
        )
      case 'price-desc':
        return arr.sort(
          (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0),
        )
      case 'name-asc':
        return arr.sort((a, b) =>
          (a.name || '').localeCompare(b.name || ''),
        )
      case 'discount-desc':
        return arr.sort(
          (a, b) =>
            (Number(b.discount) || 0) - (Number(a.discount) || 0),
        )
      default:
        return arr
    }
  }, [filteredProducts, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [sortedProducts])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedProducts.slice(start, start + pageSize)
  }, [sortedProducts, currentPage])

  const goToPage = (n) =>
    setCurrentPage(Math.min(Math.max(1, n), totalPages))
  const prevPage = () => goToPage(currentPage - 1)
  const nextPage = () => goToPage(currentPage + 1)

  // --- Breadcrumbs combinando tu lógica + modos de tu compa ---
  const breadcrumbs = useMemo(() => {
    const trail = [{ label: 'Inicio', to: '/' }]

    if (isSearchMode) {
      trail.push({ label: 'Resultados de búsqueda' })
      return trail
    }

    if (isAllMode) {
      trail.push({ label: 'Todos los productos' })
      return trail
    }

    // Solo armamos árbol cuando hay categoría
    const norm = (s = '') =>
      String(s).toLowerCase().replace(/[-_]+/g, ' ').trim()
    const target = norm(categoriaSlug)

    for (const cat of categories) {
      if (norm(cat.slug) === target) {
        trail.push({
          label: cat.name,
          to: `/?categoria=${encodeURIComponent(cat.slug)}`,
        })
        return trail
      }

      for (const sub of cat.sub || []) {
        if (norm(sub.name) === target) {
          trail.push({
            label: cat.name,
            to: `/?categoria=${encodeURIComponent(cat.slug)}`,
          })
          trail.push({
            label: sub.name,
            to: `/?categoria=${encodeURIComponent(sub.name)}`,
          })
          return trail
        }

        for (const prod of sub.products || []) {
          if (norm(prod) === target) {
            trail.push({
              label: cat.name,
              to: `/?categoria=${encodeURIComponent(cat.slug)}`,
            })
            trail.push({
              label: sub.name,
              to: `/?categoria=${encodeURIComponent(sub.name)}`,
            })
            trail.push({ label: prod })
            return trail
          }
        }
      }
    }

    if (categoriaSlug) {
      trail.push({
        label:
          categoriaSlug.charAt(0).toUpperCase() + categoriaSlug.slice(1),
      })
    }

    return trail
  }, [categoriaSlug, isSearchMode, isAllMode])

  const onToggleBrand = (brand) => {
    setFilters((prev) => {
      const exists = prev.brands.includes(brand)
      const nextBrands = exists
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand]
      return { ...prev, brands: nextBrands }
    })
  }

  const onToggleColor = (color) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(color)
      const next = exists
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color]
      return { ...prev, colors: next }
    })
  }

  const resetFilters = () =>
    setFilters({
      brands: [],
      colors: [],
      minPrice: '',
      maxPrice: '',
      inStock: false,
    })

  // Dropdown personalizado: estado y ref
  const [sortOpen, setSortOpen] = useState(false)
  const wrapperRef = useRef(null)

  const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'discount-desc', label: 'Mayor Descuento' },
  ]

  useEffect(() => {
    function onDown(e) {
      if (!wrapperRef.current) return
      if (wrapperRef.current.contains(e.target)) return
      setSortOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [wrapperRef])

  const toggleOption = (value) => {
    setSortBy(value)
    setSortOpen(false)
  }

  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <section className="catalog-page">
          <div className="catalog-layout">
            {/* --- Sidebar de filtros (tu código) --- */}
            <aside className="catalog-filters">
              <div className="filters-header">
                <h3>Filtros</h3>
                <button className="clear-filters" onClick={resetFilters}>
                  Limpiar
                </button>
              </div>

              <div className="filter-block">
                <div className="filter-title">Marca</div>
                <div className="filter-options">
                  {availableBrands.length === 0 && (
                    <div className="no-options">No hay marcas</div>
                  )}
                  {availableBrands.map((b) => (
                    <label key={b} className="filter-option">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(b)}
                        onChange={() => onToggleBrand(b)}
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-block">
                <div className="filter-title">Rango de Precio</div>
                <div className="filter-options price-range">
                  <input
                    type="number"
                    placeholder={minMaxPrice.min}
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        minPrice: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="number"
                    placeholder={minMaxPrice.max}
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        maxPrice: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="filter-block">
                <div className="filter-title">Color</div>
                <div className="filter-options colors">
                  {availableColors.length === 0 && (
                    <div className="no-options">No hay colores</div>
                  )}
                  {availableColors.map((c) => (
                    <label key={c} className="filter-option-color">
                      <input
                        type="checkbox"
                        checked={filters.colors.includes(c)}
                        onChange={() => onToggleColor(c)}
                      />
                      <span
                        className="color-dot"
                        style={{ background: c }}
                        aria-hidden="true"
                      ></span>
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-block">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) =>
                      setFilters((p) => ({
                        ...p,
                        inStock: e.target.checked,
                      }))
                    }
                  />
                  <span>Disponibilidad: Solo en stock</span>
                </label>
              </div>
            </aside>

            {/* --- Contenido principal --- */}
            <div className="catalog-content">
              <header className="catalog-header">
                <div className="catalog-breadcrumb">
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      {idx < breadcrumbs.length - 1 && crumb.to ? (
                        <Link to={crumb.to}>{crumb.label}</Link>
                      ) : (
                        <span
                          className={
                            idx === breadcrumbs.length - 1
                              ? 'current'
                              : undefined
                          }
                        >
                          {crumb.label}
                        </span>
                      )}
                      {idx < breadcrumbs.length - 1 && (
                        <span className="separator">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="catalog-title-row">
                  <div>
                    <h1 className="catalog-title">{titulo}</h1>
                    <p className="catalog-subtitle">{subtitulo}</p>

                    <div className="catalog-sort">
                      <label htmlFor="sort-select">Ordenar por:</label>
                      <div className="select-wrapper" ref={wrapperRef}>
                        <div
                          className={`custom-select ${
                            sortOpen ? 'open' : ''
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSortOpen((s) => !s)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ')
                              setSortOpen((s) => !s)
                          }}
                          aria-haspopup="listbox"
                          aria-expanded={sortOpen}
                        >
                          <span className="custom-select-label">
                            {
                              SORT_OPTIONS.find(
                                (o) => o.value === sortBy,
                              )?.label || 'Relevancia'
                            }
                          </span>
                          <img
                            src={downArrow}
                            alt="abrir"
                            className="select-arrow"
                            aria-hidden="true"
                          />
                        </div>

                        {sortOpen && (
                          <ul
                            className="custom-options"
                            role="listbox"
                            tabIndex={-1}
                          >
                            {SORT_OPTIONS.map((opt) => (
                              <li
                                key={opt.value}
                                role="option"
                                aria-selected={opt.value === sortBy}
                                className={`custom-option ${
                                  opt.value === sortBy ? 'selected' : ''
                                }`}
                                onClick={() => toggleOption(opt.value)}
                              >
                                {opt.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pill a la derecha, dinámica según modo */}
                  <div className="catalog-count">
                    <div className="catalog-pill">
                      {pillLabel}{' '}
                      <span className="catalog-pill-badge">
                        {pillValue}
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Estados de carga / error / vacío */}
              {loading && (
                <div className="catalog-state">
                  <div className="catalog-spinner" />
                  <p>Cargando productos...</p>
                </div>
              )}

              {!loading && error && (
                <div className="catalog-state catalog-error">
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && productos.length === 0 && (
                <div className="catalog-state">
                  <p>
                    {isSearchMode
                      ? `No se encontraron productos para "${searchText}".`
                      : isCategoryMode
                      ? 'No se encontraron productos para esta categoría.'
                      : 'No se encontraron productos.'}
                  </p>
                </div>
              )}

              {!loading &&
                !error &&
                productos.length > 0 &&
                filteredProducts.length === 0 && (
                  <div className="catalog-state">
                    <p>
                      No hay productos que coincidan con los filtros
                      aplicados.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                filteredProducts.length > 0 && (
                  <>
                    <section className="catalog-grid animated-grid">
                      {paginatedProducts.map((p, index) => (
                        <article
                          key={p.id}
                          className="product-card animated-card"
                          style={{ '--card-index': index }}
                        >
                          <div className="product-image-wrapper">
                            <img
                              src={p.ruta}
                              alt={p.name}
                              className="product-image"
                              loading="lazy"
                            />
                          </div>

                          <div className="product-body">
                            <h3 className="product-name">{p.name}</h3>
                            <p className="product-meta">
                              <span>{p.subcategory}</span>
                              {p.productType && (
                                <>
                                  <span className="dot">•</span>
                                  <span>{p.productType}</span>
                                </>
                              )}
                            </p>
                            <p className="product-price">
                              ₡
                              {Number(p.price).toLocaleString('es-CR')}
                            </p>
                          </div>

                          <div className="product-actions">
                            <button
                              type="button"
                              className="product-button primary"
                              onClick={() => agregarAlCarrito(p.id)}
                            >
                              Agregar al carrito
                            </button>
                            <button
                              type="button"
                              className="product-button ghost"
                              onClick={() =>
                                console.log('Ver detalles', p.id)
                              }
                            >
                              Ver detalles
                            </button>
                          </div>
                        </article>
                      ))}
                    </section>

                    {totalPages > 1 && (
                      <div
                        className="pagination"
                        role="navigation"
                        aria-label="Paginación de productos"
                      >
                        <button
                          className="page-btn"
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          aria-label="Página anterior"
                        >
                          ‹ Anterior
                        </button>

                        {(() => {
                          const items = []
                          if (totalPages <= 7) {
                            for (let i = 1; i <= totalPages; i++)
                              items.push(i)
                          } else {
                            items.push(1)
                            const start = Math.max(2, currentPage - 1)
                            const end = Math.min(
                              totalPages - 1,
                              currentPage + 1,
                            )
                            if (start > 2) items.push('...')
                            for (let i = start; i <= end; i++)
                              items.push(i)
                            if (end < totalPages - 1) items.push('...')
                            items.push(totalPages)
                          }

                          return items.map((it, idx) =>
                            typeof it === 'string' ? (
                              <span
                                key={idx}
                                className="pagination-ellipsis"
                              >
                                {it}
                              </span>
                            ) : (
                              <button
                                key={it}
                                className={`page-btn ${
                                  it === currentPage ? 'active' : ''
                                }`}
                                onClick={() => goToPage(it)}
                                aria-current={
                                  it === currentPage
                                    ? 'page'
                                    : undefined
                                }
                              >
                                {it}
                              </button>
                            ),
                          )
                        })()}

                        <button
                          className="page-btn"
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          aria-label="Página siguiente"
                        >
                          Siguiente ›
                        </button>
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
