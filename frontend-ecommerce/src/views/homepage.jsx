import React from 'react'
import Header from '../components/header'
import Categories from '../components/categories'
import Brands from '../components/brands'
import Footer from '../components/footer'
import './homepage.css'
import Metrics from '../components/metrics'
import Catalogo from '../components/catalogo'

export default function PaginaPrincipal() {
  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <Categories />
        {/* Ejemplo: catálogo de computadoras */}
          <Catalogo
            title="Computadoras destacadas"
            fetchUrl={"http://localhost:3000/api/products/category/computadoras"}
            filter={{ category: 'computadoras' }}
          />
        <Metrics />
        
        {/* Ejemplo: catálogo de computadoras */}
          <Catalogo
            title="Computadoras destacadas"
            fetchUrl={"http://localhost:3000/api/products/category/computadoras"}
            filter={{ category: 'computadoras' }}
          />
        <Brands />
      </main>

      {/* Benefits component not available yet */}
      <Footer />
    </div>
  )
}
