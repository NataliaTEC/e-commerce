import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import './homepage.css'
import Register from '../components/register'

export default function RegisterPage() {
  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <Register />
      </main>

      <Footer />
    </div>
  )
}