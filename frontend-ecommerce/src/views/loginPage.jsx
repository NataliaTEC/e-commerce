import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import './homepage.css'
import Login from '../components/login'

export default function LoginPage() {
  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <Login />
      </main>

      <Footer />
    </div>
  )
}
