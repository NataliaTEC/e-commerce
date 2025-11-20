// src/views/CarritoProductos.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { fetchCart } from "../services/ecommerceApi";
import "./carritoProductos.css";

export default function CarritoProductos() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarCarrito() {
      try {
        setLoading(true);
        const data = await fetchCart();
        console.log("Carrito cargado:", data);
        setItems(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el carrito");
      } finally {
        setLoading(false);
      }
    }

    cargarCarrito();
  }, []);

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

            <h1 className="catalog-title">Tu carrito</h1>
          </header>

          {/* Cargando */}
          {loading && (
            <div className="catalog-state">
              <div className="catalog-spinner" />
              <p>Cargando carrito...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="catalog-state catalog-error">{error}</div>
          )}

          {/* Vacío */}
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
