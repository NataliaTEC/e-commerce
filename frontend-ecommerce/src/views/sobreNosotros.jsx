import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "./sobreNosotros.css";
import misionImg from "../assets/mision.jpg";
import visionImg from "../assets/vision.jpg";
import valoresImg from "../assets/valores.jpg";
import MissionIcon from "../assets/icons/mission-w.svg";
import VisionIcon from "../assets/icons/vission-w.svg";
import ValuesIcon from "../assets/icons/values-w.svg";
import BuyCartIcon from "../assets/icons/buy-cart.svg";
import BuyCreditIcon from "../assets/icons/buy-credit.svg";
import BuyDeliveryIcon from "../assets/icons/buy-delivery.svg";
import BuyCashierIcon from "../assets/icons/buy-cashier.svg";
import Brands from "../components/brands";
import PurchasingProcess from "../components/purchasingProcess";

export default function SobreNosotros() {
  const [flippedCards, setFlippedCards] = useState({ card1: false, card2: false, card3: false });

  const toggleFlip = (key) => {
    setFlippedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <div className="about-page-container">
      <Header />

      <main className="about-wrapper">
        <section className="about-hero">
          <div className="hero-content">
            <h1 className="hero-title">Somos <span>Enigma</span></h1>
            <p className="hero-subtitle">
              Innovación, tecnología y una experiencia de compra diseñada para ti.
            </p>
          </div>
        </section>

        <section className="about-section fade-in">
          <h2 className="section-title">¿Quiénes somos?</h2>
          <p className="section-text">
            Enigma es un e-commerce costarricense especializado en productos tecnológicos. Nuestro objetivo es brindar acceso a las mejores marcas, precios competitivos y una experiencia moderna, confiable y veloz.
          </p>

          {/* === MISIÓN / VISIÓN / VALORES - Tarjetas estilo servicios (flip) === */}
          <div className="service-grid">
            <article
              className={`service-card-flip ${flippedCards['card1'] ? 'flipped' : ''}`}
              onClick={() => toggleFlip('card1')}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className="image-container">
                    <img src={misionImg} alt="Misión" className="card-image" />
                    <div className="image-overlay">
                      <div className="service-icon">
                        <img src={MissionIcon} alt="Icono Misión" className="svg-icon" />
                      </div>
                      <h3>Misión</h3>
                      <span className="flip-hint">Más información</span>
                    </div>
                  </div>
                </div>

                <div className="card-back">
                  <div className="card-back-content">
                    <div className="service-icon">
                      <img src={MissionIcon} alt="Icono Misión" className="svg-icon" />
                    </div>
                    <h3>Misión</h3>
                    <ul className="service-details">
                      <li>Hacer accesible la tecnología de vanguardia a todas las personas en Costa Rica.</li>
                    </ul>
                    <a href="/" className="card-link">Ver más</a>
                  </div>
                </div>
              </div>
            </article>

            <article
              className={`service-card-flip ${flippedCards['card2'] ? 'flipped' : ''}`}
              onClick={() => toggleFlip('card2')}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className="image-container">
                    <img src={visionImg} alt="Visión" className="card-image" />
                    <div className="image-overlay">
                      <div className="service-icon">
                        <img src={VisionIcon} alt="Icono Visión" className="svg-icon" />
                      </div>
                      <h3>Visión</h3>
                      <span className="flip-hint">Más información</span>
                    </div>
                  </div>
                </div>

                <div className="card-back">
                  <div className="card-back-content">
                    <div className="service-icon">
                      <img src={VisionIcon} alt="Icono Visión" className="svg-icon" />
                    </div>
                    <h3>Visión</h3>
                    <ul className="service-details">
                      <li>Convertirnos en la plataforma tecnológica número uno del país.</li>
                    </ul>
                    <a href="/" className="card-link">Ver más</a>
                  </div>
                </div>
              </div>
            </article>

            <article
              className={`service-card-flip ${flippedCards['card3'] ? 'flipped' : ''}`}
              onClick={() => toggleFlip('card3')}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className="image-container">
                    <img src={valoresImg} alt="Valores" className="card-image" />
                    <div className="image-overlay">
                      <div className="service-icon">
                        <img src={ValuesIcon} alt="Icono Valores" className="svg-icon" />
                      </div>
                      <h3>Valores</h3>
                      <span className="flip-hint">Más información</span>
                    </div>
                  </div>
                </div>

                <div className="card-back">
                  <div className="card-back-content">
                    <div className="service-icon">
                      <img src={ValuesIcon} alt="Icono Valores" className="svg-icon" />
                    </div>
                    <h3>Valores</h3>
                    <ul className="service-details">
                      <li>Innovación, confianza, calidad y enfoque en la experiencia del cliente.</li>
                    </ul>
                    <a href="/" className="card-link">Ver más</a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="why-us-section fade-in">
          <h2 className="section-title">¿Por qué elegir Enigma?</h2>
          <div className="why-grid">
            <div className="why-item">
              <div className="icon">
                <img src={BuyCartIcon} alt="Compras rápidas" />
              </div>
              <h3>Compras rápidas</h3>
              <p>Una experiencia optimizada con navegación fluida y procesos claros.</p>
            </div>

            <div className="why-item">
              <div className="icon">
                <img src={BuyCreditIcon} alt="Pagos seguros" />
              </div>
              <h3>Pagos seguros</h3>
              <p>Tu información está protegida con los más altos estándares.</p>
            </div>

            <div className="why-item">
              <div className="icon">
                <img src={BuyDeliveryIcon} alt="Envíos en todo el país" />
              </div>
              <h3>Envíos en todo el país</h3>
              <p>Recibe tus productos donde estés, de manera rápida y confiable.</p>
            </div>

            <div className="why-item">
              <div className="icon">
                <img src={BuyCashierIcon} alt="Soporte real" />
              </div>
              <h3>Soporte real</h3>
              <p>Atención humana, rápida y enfocada en resolver.</p>
            </div>
          </div>
        </section>

        <PurchasingProcess />

        <Brands />
      </main>

      <Footer />
    </div>
  );
}
