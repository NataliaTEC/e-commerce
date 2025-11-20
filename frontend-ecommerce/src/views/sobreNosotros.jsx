import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "./sobreNosotros.css";

export default function SobreNosotros() {
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

          <div className="about-cards">
            <div className="about-card">
              <h3>Misión</h3>
              <p>Hacer accesible la tecnología de vanguardia a todas las personas en Costa Rica.</p>
            </div>

            <div className="about-card">
              <h3>Visión</h3>
              <p>Convertirnos en la plataforma tecnológica número uno del país, reconocida por su servicio impecable y diseño moderno.</p>
            </div>

            <div className="about-card">
              <h3>Valores</h3>
              <p>Innovación, confianza, calidad y una obsesión total por la experiencia del cliente.</p>
            </div>
          </div>
        </section>

        <section className="why-us-section fade-in">
          <h2 className="section-title">¿Por qué elegir Enigma?</h2>
          <div className="why-grid">
            <div className="why-item">
              <span className="icon">⚡</span>
              <h3>Compras rápidas</h3>
              <p>Una experiencia optimizada con navegación fluida y procesos claros.</p>
            </div>

            <div className="why-item">
              <span className="icon">🔒</span>
              <h3>Pagos seguros</h3>
              <p>Tu información está protegida con los más altos estándares.</p>
            </div>

            <div className="why-item">
              <span className="icon">🚚</span>
              <h3>Envíos en todo el país</h3>
              <p>Recibe tus productos donde estés, de manera rápida y confiable.</p>
            </div>

            <div className="why-item">
              <span className="icon">💬</span>
              <h3>Soporte real</h3>
              <p>Atención humana, rápida y enfocada en resolver.</p>
            </div>
          </div>
        </section>

        <section className="cta-section fade-in">
          <h2>Forma parte del futuro tecnológico</h2>
          <p>Explorá nuestro catálogo y descubrí productos diseñados para inspirar.</p>
          <a href="/" className="cta-btn">Ir al catálogo</a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
