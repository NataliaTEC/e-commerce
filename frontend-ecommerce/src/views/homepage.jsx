import React from 'react'
import Header from '../components/header'
import Categories from '../components/categories'
import Footer from '../components/footer'
import './homepage.css'

export default function PaginaPrincipal() {
  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <Categories />
        {/* Catalog component not available yet — render categories only for now */}
      </main>

      {/* Benefits component not available yet */}
      <Footer />
    </div>
  )
}
