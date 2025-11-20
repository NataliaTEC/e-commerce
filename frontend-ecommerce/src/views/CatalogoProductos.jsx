import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/header'
import Footer from '../components/footer'
import {
  fetchProductsByCategory,
  fetchProducts,
  addToCart,
  fetchProductsBySearch,
} from '../services/ecommerceApi'
import './catalogoProductos.css'

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

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      setError('')

      try {
        let data = []

        if (isSearchMode) {
          data = await fetchProductsBySearch(searchText)
        } else if (isCategoryMode) {
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
          data = await fetchProducts()
        }

        setProductos(data)
      } catch (e) {
        setError('Error al cargar productos')
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [searchText, categoriaSlug, isSearchMode, isCategoryMode, isAllMode])

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

  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <section className="catalog-page">
          <header className="catalog-header">
            <div className="catalog-breadcrumb">
              <span>Inicio</span>
              <span className="separator">›</span>
              <span className="current">
                {isSearchMode
                  ? 'Resultados de búsqueda'
                  : isCategoryMode
                  ? 'Búsqueda por categoría'
                  : 'Todos los productos'}
              </span>
            </div>

            <div className="catalog-title-row">
              <div>
                <h1 className="catalog-title">{titulo}</h1>
                <p className="catalog-subtitle">{subtitulo}</p>
              </div>

              <div className="catalog-pill">
                {pillLabel}
                <span className="catalog-pill-badge">{pillValue}</span>
              </div>
            </div>
          </header>

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

          {!loading && !error && productos.length > 0 && (
            <section className="catalog-grid animated-grid">
              {productos.map((p, index) => (
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
                      ₡{Number(p.price).toLocaleString('es-CR')}
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
                      onClick={() => console.log('Ver detalles', p.id)}
                    >
                      Ver detalles
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
