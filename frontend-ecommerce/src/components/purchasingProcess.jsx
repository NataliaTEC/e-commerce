// src/components/purchasingProcess.jsx
import React, { useState } from "react"
import "./purchasingProcess.css"

// Íconos de ejemplo (cámbialos por los tuyos)
import BrowseIcon from "../assets/icons/browse.svg"
import CartIcon from "../assets/icons/cart.svg"
import CheckoutIcon from "../assets/icons/checkout.svg"
import DeliveryIcon from "../assets/icons/delivery.svg"

export default function PurchasingProcess() {
  const [current, setCurrent] = useState(1)

  const steps = [
    {
      id: 1,
      title: "Explora productos",
      text:
        "Navega por nuestras categorías, filtra por marca, precio o características y elige los productos que necesitas.",
      icon: BrowseIcon,
    },
    {
      id: 2,
      title: "Agrega al carrito",
      text:
        "Añade tus productos favoritos al carrito, revisa cantidades, precios y aplica cupones o descuentos.",
      icon: CartIcon,
    },
    {
      id: 3,
      title: "Completa tus datos",
      text:
        "Ingresa la dirección de envío, selecciona el método de entrega y el medio de pago que prefieras.",
      icon: CheckoutIcon,
    },
    {
      id: 4,
      title: "Confirmación y envío",
      text:
        "Recibe la confirmación de tu compra, sigue el estado del pedido en tiempo real y recibe tu producto en casa.",
      icon: DeliveryIcon,
    },
  ]

  const goNext = () => setCurrent((c) => Math.min(4, c + 1))
  const goPrev = () => setCurrent((c) => Math.max(1, c - 1))

  return (
    <section className="purchasing-process section">
      <h2 className="pp-title">Proceso de compra</h2>
      <p className="pp-subtitle">Compra en línea de forma rápida y segura</p>

      <div className="pp-steps-container">
        {steps.map((s) => {
          const completed = s.id < current
          const active = s.id === current
          return (
            <div
              key={s.id}
              className={`pp-step-card ${completed ? "completed" : ""} ${
                active ? "active" : ""
              }`}
              data-step={s.id}
              onClick={() => setCurrent(s.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setCurrent(s.id)
              }}
            >
            
              <div className="pp-step-icon">
                <img src={s.icon} alt={s.title} className="pp-step-svg" />
              </div>
              <div className="pp-step-number">{s.id}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {s.id < 4 && <div className="pp-step-connector"></div>}
            </div>
          )
        })}
      </div>

      
    </section>
  )
}
