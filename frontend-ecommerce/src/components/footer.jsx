import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/nuevologo.png'
import CallCenterIcon from '../assets/icons/CallCenter.svg'
import './footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Features bar */}
      <div className="features-bar">
        <div className="feature">
          <div className="feature-icon">💲</div>
          <div className="feature-text">
            <strong>Precios Competitivos.</strong>
            <span>Tecnología a tu alcance.</span>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">🎧</div>
          <div className="feature-text">
            <strong>Soporte Experto.</strong>
            <span>La ayuda que necesitas.</span>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">💳</div>
          <div className="feature-text">
            <strong>Pago En Línea.</strong>
            <span>Paga con seguridad.</span>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">🚚</div>
          <div className="feature-text">
            <strong>Entrega Rápida.</strong>
            <span>A todo el territorio nacional.</span>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-col stores">
          <h5>NUESTRAS TIENDAS</h5>
          <div className="stores-grid">
            <ul>
              <li>San José Centro</li>
              <li>San Pedro</li>
              <li>Escazú</li>
              <li>Desamparados</li>
              <li>Cartago</li>
              <li>Lindora</li>
            </ul>
            <ul>
              <li>Plaza San Francisco (Heredia)</li>
              <li>Heredia</li>
              <li>La Valencia (Heredia)</li>
              <li>Alajuela</li>
            </ul>
          </div>
        </div>

        <div className="footer-col links">
          <h5>ENLACES RÁPIDOS</h5>
          <ul>
            <li><Link to="/shipping">Entregas y devoluciones</Link></li>
            <li><Link to="/faq">Preguntas Frecuentes</Link></li>
            <li><Link to="/contact">Contáctanos</Link></li>
            <li><Link to="/warranty">Garantías</Link></li>
            <li><Link to="/terms">Términos de Uso</Link></li>
            <li><Link to="/privacy">Política de Privacidad</Link></li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h5>Nuestro CALL CENTER:</h5>
          <div className="call-icon">
            <img src={CallCenterIcon} alt="Call Center" />
          </div>
          <div className="call-number">2222-2222</div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="payments">
          <h6>Formas de Pago:</h6>
          <div className="payment-logos">
            <img src="https://www.tiendamonge.com/static/version1757340799/frontend/Omnipro/monge_base/es_CR/images/visa.svg" alt="visa" />
            <img src="https://www.tiendamonge.com/static/version1757340799/frontend/Omnipro/monge_base/es_CR/images/mastercard.svg" alt="mastercard" />
            <img src="https://www.tiendamonge.com/static/version1757340799/frontend/Omnipro/monge_base/es_CR/images/Logo_PCI.png" alt="pci" />
          </div>
        </div>

        <div className="socials">
          <h6>Encuéntranos en nuestras redes sociales:</h6>
          <div className="social-icons">
            <a href="#" aria-label="facebook">FB</a>
            <a href="#" aria-label="instagram">IG</a>
            <a href="#" aria-label="youtube">YT</a>
            <a href="#" aria-label="linkedin">IN</a>
            <a href="#" aria-label="tiktok">TT</a>
          </div>
        </div>

      </div>

      <div className="footer-copy">
        <p>© {new Date().getFullYear()} Enigma. All rights reserved</p>
      </div>
    </footer>
  )
}
