// src/views/CarritoProductos.jsx
import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { fetchCart } from "../services/ecommerceApi";
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
      if (err.redirect) {
        navigate(err.redirect);
        return;
      }
        
      setError("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarCarrito();
  }, []);

  async function undoCart() {
    const res = await fetch("http://localhost:3000/api/cart/undo", {
      method: "POST",
      credentials: "include"
    });
    const data = await res.json();
    if (data.ok) cargarCarrito();
    window.dispatchEvent(new Event("cart-updated"));
  }

  async function clearCart() {
    const res = await fetch("http://localhost:3000/api/cart/clear", {
      method: "POST",
      credentials: "include"
    });
    const data = await res.json();
    if (data.ok) cargarCarrito();
    window.dispatchEvent(new Event("cart-updated"));
  }

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
                <button className="cart-btn ghost" onClick={undoCart}>
                  Deshacer
                </button>

                <button className="cart-btn danger" onClick={clearCart}>
                  Vaciar
                </button>
              </div>
            </div>
          </header>

          {loading && (
            <div className="catalog-state">
              <div className="catalog-spinner" />
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
                      <p className="cart-item-meta">
                        Cantidad: <strong>{item.quantity}</strong>
                      </p>
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
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
