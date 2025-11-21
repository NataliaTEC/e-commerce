// src/components/metrics.jsx
import React, { useEffect, useState } from "react"
import "./metrics.css"

// Importa los íconos que quieras usar (pueden ser PNG/SVG locales)
import StoresIcon from "../assets/icons/store-shop.svg"
import ShippingIcon from "../assets/icons/fast-delivery.svg"
import HappyIcon from "../assets/icons/recommended.svg"
import ProductsIcon from "../assets/icons/product.svg"

export default function Metrics() {
  return (
    <section className="metrics-modern">
      <div className="metrics-container">
        {/* TIENDAS */}
        <div className="metric-card">
          <div className="metric-icon">
            <img src={StoresIcon} alt="TIENDAS" className="metric-svg" />
          </div>
          <div className="metric-content">
            <div className="metric-number">
              +<Counter end={8} duration={2500} />
            </div>
            <div className="metric-label">TIENDAS</div>
          </div>
        </div>

        {/* ENVIOS */}
        <div className="metric-card">
          <div className="metric-icon">
            <img src={ShippingIcon} alt="ENVIOS" className="metric-svg" />
          </div>
          <div className="metric-content">
            <div className="metric-number">
              +<Counter end={4200} duration={2500} />
            </div>
            <div className="metric-label">ENVIOS</div>
          </div>
        </div>

        {/* CLIENTES SATISFECHOS */}
        <div className="metric-card">
          <div className="metric-icon">
            <img
              src={HappyIcon}
              alt="CLIENTES SATISFECHOS"
              className="metric-svg"
            />
          </div>
          <div className="metric-content">
            <div className="metric-number">
              +<Counter end={3200} duration={2500} />
            </div>
            <div className="metric-label">CLIENTES SATISFECHOS</div>
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="metric-card">
          <div className="metric-icon">
            <img src={ProductsIcon} alt="PRODUCTOS" className="metric-svg" />
          </div>
          <div className="metric-content">
            <div className="metric-number">
              +<Counter end={1500} duration={2500} />
            </div>
            <div className="metric-label">PRODUCTOS</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Contador animado simple
function Counter({ end = 0, duration = 2000 }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = null
    let start = null

    function step(ts) {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      const current = Math.round(progress * end)
      setValue(current)
      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [end, duration])

  return <>{value.toLocaleString()}</>
}
