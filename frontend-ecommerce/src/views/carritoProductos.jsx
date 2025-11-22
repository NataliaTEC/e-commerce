import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import removeIcon from '../assets/icons/remove.svg'
import Footer from "../components/footer";

import { 
  fetchCart,
  removeProductFromCart,
  undoCartChange,
  clearCart,
  updateCartItem
} from "../services/ecommerceApi";

import "./carritoProductos.css";

export default function CarritoProductos() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargarCarrito() {
    try {
      setLoading(true);
      const data = await fetchCart();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setError("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarCarrito();
  }, []);

  async function incrementar(productId, actual) {
    const data = await updateCartItem(productId, 1, true);
    if (data.ok) cargarCarrito();
    window.dispatchEvent(new Event("cart-updated"));
  }

  async function decrementar(productId, actual) {
    if (actual === 1) {
      await eliminarItem(productId);
      return;
    }
    const data = await updateCartItem(productId, -1, true);
    if (data.ok) cargarCarrito();
    window.dispatchEvent(new Event("cart-updated"));
  }

  async function eliminarItem(productId) {
    try {
      const data = await removeProductFromCart(productId);
      if (data.ok) cargarCarrito();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  }

  async function undoCart() {
    try {
      const data = await undoCartChange();
      if (data.ok) cargarCarrito();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  }

  async function clearCartAction() {
    try {
      const data = await clearCart();
      if (data.ok) cargarCarrito();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  }

  const impuesto = total * 0.13;
  const totalFinal = total + impuesto;

  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <section className="cart-page">

          <header className="catalog-header">
            <div className="catalog-breadcrumb">
              <span>Inicio</span>
              <span className="separator">›</span>
              <span className="current">Carrito</span>
            </div>

            <div className="cart-header-row">
              <h1 className="catalog-title">Tu carrito</h1>

              <div className="cart-actions">
                <button className="cart-btn ghost" onClick={undoCart}>Deshacer</button>
                <button className="cart-btn danger" onClick={clearCartAction}>Vaciar</button>
              </div>
            </div>
          </header>

          {loading && (
            <div className="catalog-state">
              <div className="catalog-spinner"></div>
              <p>Cargando carrito...</p>
            </div>
          )}

          {!loading && error && (
            <div className="catalog-state catalog-error">{error}</div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="catalog-state">Tu carrito está vacío.</div>
          )}

          {!loading && !error && items.length > 0 && (
            <>
              <div className="cart-list">
                {items.map((item, idx) => {
                  const product = item.product || item;

                  return (
                    <article key={idx} className="cart-item">
                      <img
                        src={product.ruta}
                        alt={product.name}
                        className="cart-item-img"
                      />

                      <div className="cart-item-body">
                        <h3 className="cart-item-name">{product.name}</h3>

                        {/* BOTONES DE CANTIDAD */}
                        <div className="qty-controls">
                          <button onClick={() => decrementar(product.id, item.quantity)} className="qty-btn">−</button>
                          <span className="qty-number">{item.quantity}</span>
                          <button onClick={() => incrementar(product.id, item.quantity)} className="qty-btn">+</button>
                          {/* trash next to + */}
                          <button
                            className="trash-btn small"
                            onClick={() => eliminarItem(product.id)}
                            aria-label="Eliminar producto"
                          >
                            <img src={removeIcon} alt="Eliminar" className="trash-icon" />
                          </button>
                        </div>

                        <p className="cart-item-price">
                          ₡{Number(product.price).toLocaleString("es-CR")}
                        </p>
                      </div>

                      <div className="cart-item-total">
                        ₡{(product.price * item.quantity).toLocaleString("es-CR")}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <strong>₡{total.toLocaleString("es-CR")}</strong>
                </div>

                <div className="summary-row">
                  <span>Impuestos (13%):</span>
                  <strong>₡{impuesto.toLocaleString("es-CR")}</strong>
                </div>

                <div className="summary-total">
                  <span>Total:</span>
                  <strong>₡{totalFinal.toLocaleString("es-CR")}</strong>
                </div>

                <button className="pay-btn" onClick={() => navigate("/checkout")}>
                  Pagar ahora
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
