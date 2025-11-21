import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import WishIcon from "../assets/icons/heart.svg"
import { addToCart, fetchCartCount, fetchProducts, fetchProductsByCategory, fetchProductsBySubcategory } from "../services/ecommerceApi"
import { addToWishlist, removeFromWishlist, isInWishlist } from "../services/wishlistService"
import "./detalleProducto.css"
import Header from "../components/header"
import Footer from "../components/footer"
import LoginRequiredModal from "../components/LoginRequiredModal"

export default function DetalleProducto() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [wish, setWish] = useState(false)
  const [similar, setSimilar] = useState([])

  const [modal, setModal] = useState({ open: false, title: '', message: '' })
  const closeModal = () => setModal({ open: false, title: '', message: '' })

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProducts().then(products => products.find(p => p.id === parseInt(id)))
        setProduct(data)
        console.log("Producto cargado:", data)

        // Favorito inicial
        setWish(isInWishlist(data.id))

        // Cargar similares
        let sim = await fetchProductsBySubcategory(data.subcategory)
        if (sim && sim.length > 0) {
            sim = await fetchProductsByCategory(data.category)
        }
        setSimilar(sim.filter(p => p.id !== data.id).slice(0, 4))

      } catch (e) {
        console.error("Error cargando producto", e)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const addItemToCart = async () => {
      await addToCart(product.id, quantity).then((data) => {
        if (data.ok) {
          alert(`Producto agregado al carrito`)
        } else {
          const errMsg = String(data.error || '')
          if (errMsg.toLowerCase().includes('iniciar') || errMsg.toLowerCase().includes('sesión')) {
            setModal({ open: true, title: 'Advertencia', message: 'Debes iniciar sesión para agregar productos al carrito.' })
          } else {
            alert(`Error al agregar el producto al carrito: ${data.error}`)
          }
        }
      })
      .catch((err) => {
        const msg = String(err || '')
        if (msg.toLowerCase().includes('401') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('sesión')) {
          setModal({ open: true, title: 'Advertencia', message: 'Debes iniciar sesión para agregar productos al carrito.' })
        } else {
          alert(`Error al agregar el producto al carrito: ${err}`)
        }
      })
      .finally(() => {
        window.dispatchEvent(new Event('cart-updated'))
      })
  }

  const toggleWishlist = () => {
    if (wish) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
    setWish(!wish)
    window.dispatchEvent(new Event("wishlist-updated"))
  }

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        Cargando producto...
      </div>
    )

  return (
    <div className="detalle-producto-page-main">
        <Header />

        {product ? (
            <div className="product-detail-page">
                <div className="product-detail-container">
                    
                    {/* Tarjeta principal */}
                    <div className="product-detail-card">
                    <div className="product-img-wrapper">
                        <img src={product.ruta} alt={product.name} className="product-main-img" />
                    </div>

                    <div className="product-info">
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-brand">
                        {product.marca}
                        <span className="separator">•</span>
                        {product.modelo}
                        </div>

                        <p className="product-description">{product.description}</p>

                        <div className="product-price">₡{product.price.toLocaleString("es-CR")}</div>

                        <div className="product-stock">
                        {product.stock > 0 ? (
                            <span className="in-stock">En stock ({product.stock} disponibles)</span>
                        ) : (
                            <span className="out-stock">Sin stock</span>
                        )}
                        </div>

                        {/* Cantidad */}
                        <div className="quantity-selector">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="qty-btn-detail"
                        >
                            −
                        </button>

                        <span className="qty-num">{quantity}</span>

                        <button
                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                            className="qty-btn-detail"
                        >
                            +
                        </button>
                        </div>

                        {/* Botón agregar al carrito */}
                        <button className="add-cart-btn" onClick={addItemToCart}>
                        Agregar al carrito
                        </button>

                        {/* Wishlist */}
                        <button className="wishlist-btn-detail" onClick={toggleWishlist}>
                        <img
                            src={WishIcon}
                            className={`wish-icon-detail ${wish ? "active" : ""}`}
                            alt="Favorito"
                        />
                        {wish ? "Quitar de favoritos" : "Agregar a favoritos"}
                        </button>
                    </div>
                    </div>

                    {/* Specs */}
                    <div className="product-specs">
                    <h2>Especificaciones</h2>

                    <div className="specs-grid">
                        <div className="spec-card">
                        <h4>Categoría</h4>
                        <p>{product.category}</p>
                        </div>

                        <div className="spec-card">
                        <h4>Subcategoría</h4>
                        <p>{product.subcategory}</p>
                        </div>

                        <div className="spec-card">
                        <h4>Marca</h4>
                        <p>{product.marca}</p>
                        </div>

                        <div className="spec-card">
                        <h4>Modelo</h4>
                        <p>{product.modelo}</p>
                        </div>
                    </div>
                    </div>

                    {/* Similares */}
                    <div className="similar-section">
                    <h2>Productos similares</h2>

                    <div className="similar-grid">
                        {similar.length === 0 && <p>No hay productos similares.</p>}

                        {similar.map(p => (
                        <div
                            key={p.id}
                            className="similar-card"
                            onClick={() => navigate(`/detalleProducto/${p.id}`)}
                        >
                            <img src={p.ruta} alt={p.name} />
                            <h4>{p.name}</h4>
                            <p>₡{p.price.toLocaleString("es-CR")}</p>
                        </div>
                        ))}
                    </div>
                    </div>

                </div>
            </div>
        ) : (
            <div className="product-detail-container">Producto no encontrado</div>
        )}

        <LoginRequiredModal
            open={modal.open}
            title={modal.title}
            message={modal.message}
            onClose={closeModal}
            onLogin={() => {
                closeModal();
                navigate("/Login");
            }}
        />

        <Footer />
    </div>
  )
}
