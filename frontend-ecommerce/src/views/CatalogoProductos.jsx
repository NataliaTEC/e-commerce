// src/views/CatalogoProductos.jsx
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/header'
import Footer from '../components/footer'
import { fetchProductsByCategory } from '../services/ecommerceApi'
import './catalogoProductos.css'

function useQuery() {
  const { search } = useLocation()
  return new URLSearchParams(search)
}

export default function CatalogoProductos() {
  const query = useQuery()
  // puede venir como "computadoras", "Laptops", etc.
  const categoriaSlug = query.get('categoria') || 'computadoras'

  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    fetchProductsByCategory(categoriaSlug.toLowerCase())
      .then((data) => {
        setProductos(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar productos')
        setLoading(false)
      })
  }, [categoriaSlug])

  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <section className="catalog-page">
          <header className="catalog-header">
            <div className="catalog-breadcrumb">
              <span>Inicio</span>
              <span className="separator">›</span>
              <span className="current">Búsqueda por categoría</span>
            </div>

            <div className="catalog-title-row">
              <div>
                <h1 className="catalog-title">
                  {categoriaSlug.charAt(0).toUpperCase() + categoriaSlug.slice(1)}
                </h1>
                <p className="catalog-subtitle">
                  Explora los productos disponibles en esta categoría seleccionada.
                </p>
              </div>

              <div className="catalog-pill">
                Categoría seleccionada:
                <span className="catalog-pill-badge">
                  {categoriaSlug}
                </span>
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
              <p>No se encontraron productos para esta categoría.</p>
            </div>
          )}

          {!loading && !error && productos.length > 0 && (
            <section className="catalog-grid">
              {productos.map((p) => (
                <article key={p.id} className="product-card">
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
                      onClick={() => {
                        // aquí luego llamas a addToCart(productId)
                        console.log('Agregar al carrito', p.id)
                      }}
                    >
                      Agregar al carrito
                    </button>
                    <button
                      type="button"
                      className="product-button ghost"
                      onClick={() => {
                        // aquí podrías navegar a detalle /producto/:id
                        console.log('Ver detalles', p.id)
                      }}
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
