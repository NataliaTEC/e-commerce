import React, { useEffect, useState } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "./checkout.css"
import CustomSelect from "../components/CustomSelect"
import { isUserLoggedIn } from "../services/ecommerceApi"
import { useNavigate } from "react-router-dom"
import LoginRequiredModal from "../components/LoginRequiredModal"

// Iconos por tipo/brand/banco (Cloudinary)
const CARD_BRANDS = {
  visa: {
    key: "visa",
    label: "Visa",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672532/5baacb34-42f4-44fe-b3da-038bfc02f948.png",
  },
  mastercard: {
    key: "mastercard",
    label: "Mastercard",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672595/ab223c4b-5902-4804-ab96-ed10c274d250.png",
  },
  amex: {
    key: "amex",
    label: "American Express",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672632/cfc69eca-0d77-4980-9ddb-23989c38dc34.png",
  },
  discover: {
    key: "discover",
    label: "Discover",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672366/e4674dbe-2912-49cd-aa51-534a99ed17f6.png",
  },
}

const BANKS = {
  bcr: {
    key: "bcr",
    label: "Banco de Costa Rica",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763675492/1959d900-782d-484c-b7c8-62c9ff1fcc0b.png",
  },
  popular: {
    key: "popular",
    label: "Banco Popular",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672408/b2efb527-df46-4f43-a4eb-20249cd19854.png",
  },
  bac: {
    key: "bac",
    label: "BAC Credomatic",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763681235/bac_j6dfyh.png",
  },
  bn: {
    key: "bn",
    label: "Banco Nacional",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763681234/bn_cxb29q.png",
  }
}

const EXTRA_ICONS = {
  paypal: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672094/778277fc-ce07-4dd3-a405-d1fe8a148cba.png",
  sinpe: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672046/1ef85718-e992-48b3-8028-27c361e78020.png",
  stripe: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672214/8fddd8ba-8b93-4225-a040-b3e30fc92d6f.png",
}

function getIconForMethod(m) {
  if (m.tipo === "tarjeta") {
    const brandKey = m.datos?.brand
    if (brandKey && CARD_BRANDS[brandKey]) {
      return CARD_BRANDS[brandKey].img
    }
    return CARD_BRANDS.visa.img
  }
  if (m.tipo === "sinpe") {
    return EXTRA_ICONS.sinpe
  }
  if (m.tipo === "paypal") {
    return EXTRA_ICONS.paypal
  }
  if (m.tipo === "stripe") {
    return EXTRA_ICONS.stripe
  }
  if (m.tipo === "transferencia") {
    const bankKey = m.datos?.bankKey
    if (bankKey && BANKS[bankKey]) {
      return BANKS[bankKey].img
    }
    return BANKS.bcr.img
  }
  return EXTRA_ICONS.stripe
}

function getResumenTexto(m) {
  if (m.tipo === "tarjeta") {
    const digits = (m.datos.cardNumber || "").replace(/\D/g, "")
    const last4 = digits.slice(-4)
    const brand = m.datos.brand ? CARD_BRANDS[m.datos.brand]?.label || m.datos.brand : "Tarjeta"
    return last4 ? `${brand} • ****${last4}` : `${brand} registrada`
  }
  if (m.tipo === "sinpe") {
    return `Teléfono: +${m.datos.phone}`
  }
  if (m.tipo === "transferencia") {
    const digits = (m.datos.accountNumber || "").replace(/\D/g, "")
    const last4 = digits.slice(-4)
    return last4 ? `${m.datos.bankName} • ****${last4}` : `${m.datos.bankName}`
  }
  if (m.tipo === "paypal") {
    return `Correo: ${m.datos.email}`
  }
  if (m.tipo === "stripe") {
    return `Cliente: ${m.datos.clientId}`
  }
  return ""
}

export default function Checkout() {
  const navigate = useNavigate()
  const [modal, setModal] = useState({ open: false, title: '', message: '' })
  const [deliveryType, setDeliveryType] = useState("enviar")
  const [invoiceType, setInvoiceType] = useState("personal")
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [formData, setFormData] = useState({
    provincia: "",
    canton: "",
    distrito: "",
    direccion: "",
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    nombreEmpresa: "",
    cedulaJuridica: "",
    correoFacturacion: ""
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await isUserLoggedIn()
      if (!loggedIn) {
        setModal({ 
          open: true, 
          title: 'Advertencia', 
          message: 'Debes iniciar sesión para realizar el checkout.' 
        })
      }
    }
    checkLogin()

    const saved = JSON.parse(localStorage.getItem("metodosPago") || "[]")
    setPaymentMethods(saved)
  }, [])

  const closeModal = () => setModal({ open: false, title: '', message: '' })

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (deliveryType === "enviar") {
      if (!formData.provincia.trim()) newErrors.provincia = "Requerido"
      if (!formData.canton.trim()) newErrors.canton = "Requerido"
      if (!formData.distrito.trim()) newErrors.distrito = "Requerido"
      if (!formData.direccion.trim()) newErrors.direccion = "Requerido"
    }

    if (!formData.nombre.trim()) newErrors.nombre = "Requerido"
    if (!formData.apellido.trim()) newErrors.apellido = "Requerido"
    if (!formData.cedula.trim()) newErrors.cedula = "Requerido"
    if (!formData.telefono.trim()) newErrors.telefono = "Requerido"

    if (invoiceType === "empresa") {
      if (!formData.nombreEmpresa.trim()) newErrors.nombreEmpresa = "Requerido"
      if (!formData.cedulaJuridica.trim()) newErrors.cedulaJuridica = "Requerido"
      if (!formData.correoFacturacion.trim()) newErrors.correoFacturacion = "Requerido"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoFacturacion)) {
        newErrors.correoFacturacion = "Correo inválido"
      }
    }

    if (!selectedPayment) {
      newErrors.payment = "Selecciona un método de pago"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    alert("Orden completada exitosamente!")
  }

  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <section className="checkout-page">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Completa tu información para finalizar la compra</p>

          <div className="checkout-sections">
            {/* ENTREGA */}
            <div className="checkout-card">
              <h2 className="checkout-section-title">Entrega</h2>
              
              <label>Tipo de entrega</label>
              <CustomSelect
                value={deliveryType}
                onChange={(val) => setDeliveryType(val)}
                options={[
                  { value: "enviar", label: "Envío a domicilio" },
                  { value: "retiro", label: "Retiro en tienda" }
                ]}
              />

              {deliveryType === "enviar" && (
                <>
                  <label>Provincia</label>
                  <input
                    placeholder="Ej: San José"
                    value={formData.provincia}
                    onChange={(e) => handleFieldChange("provincia", e.target.value)}
                  />
                  {errors.provincia && <span className="checkout-error">{errors.provincia}</span>}

                  <label>Cantón</label>
                  <input
                    placeholder="Ej: Central"
                    value={formData.canton}
                    onChange={(e) => handleFieldChange("canton", e.target.value)}
                  />
                  {errors.canton && <span className="checkout-error">{errors.canton}</span>}

                  <label>Distrito</label>
                  <input
                    placeholder="Ej: Carmen"
                    value={formData.distrito}
                    onChange={(e) => handleFieldChange("distrito", e.target.value)}
                  />
                  {errors.distrito && <span className="checkout-error">{errors.distrito}</span>}

                  <label>Dirección exacta</label>
                  <textarea
                    placeholder="Incluye señas exactas"
                    value={formData.direccion}
                    onChange={(e) => handleFieldChange("direccion", e.target.value)}
                    rows={3}
                  />
                  {errors.direccion && <span className="checkout-error">{errors.direccion}</span>}
                </>
              )}

              {deliveryType === "retiro" && (
                <p className="checkout-hint">Podrás retirar tu pedido en nuestra tienda física.</p>
              )}
            </div>

            {/* FACTURACIÓN */}
            <div className="checkout-card">
              <h2 className="checkout-section-title">Facturación</h2>

              <label>Tipo de factura</label>
              <CustomSelect
                value={invoiceType}
                onChange={(val) => setInvoiceType(val)}
                options={[
                  { value: "personal", label: "Personal" },
                  { value: "empresa", label: "Empresa" }
                ]}
              />

              <label>Nombre</label>
              <input
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => handleFieldChange("nombre", e.target.value)}
              />
              {errors.nombre && <span className="checkout-error">{errors.nombre}</span>}

              <label>Apellido</label>
              <input
                placeholder="Apellido"
                value={formData.apellido}
                onChange={(e) => handleFieldChange("apellido", e.target.value)}
              />
              {errors.apellido && <span className="checkout-error">{errors.apellido}</span>}

              <label>Cédula</label>
              <input
                placeholder="Número de cédula"
                value={formData.cedula}
                onChange={(e) => handleFieldChange("cedula", e.target.value)}
              />
              {errors.cedula && <span className="checkout-error">{errors.cedula}</span>}

              <label>Teléfono</label>
              <input
                placeholder="Número de teléfono"
                value={formData.telefono}
                onChange={(e) => handleFieldChange("telefono", e.target.value)}
              />
              {errors.telefono && <span className="checkout-error">{errors.telefono}</span>}

              {invoiceType === "empresa" && (
                <>
                  <label>Nombre de empresa</label>
                  <input
                    placeholder="Razón social"
                    value={formData.nombreEmpresa}
                    onChange={(e) => handleFieldChange("nombreEmpresa", e.target.value)}
                  />
                  {errors.nombreEmpresa && <span className="checkout-error">{errors.nombreEmpresa}</span>}

                  <label>Cédula jurídica</label>
                  <input
                    placeholder="Número de cédula jurídica"
                    value={formData.cedulaJuridica}
                    onChange={(e) => handleFieldChange("cedulaJuridica", e.target.value)}
                  />
                  {errors.cedulaJuridica && <span className="checkout-error">{errors.cedulaJuridica}</span>}

                  <label>Correo de facturación</label>
                  <input
                    placeholder="correo@empresa.com"
                    value={formData.correoFacturacion}
                    onChange={(e) => handleFieldChange("correoFacturacion", e.target.value)}
                  />
                  {errors.correoFacturacion && <span className="checkout-error">{errors.correoFacturacion}</span>}
                </>
              )}
            </div>

            {/* MÉTODO DE PAGO */}
            <div className="checkout-card full-width">
              <h2 className="checkout-section-title">Método de pago</h2>

              {paymentMethods.length === 0 && (
                <p className="checkout-hint">No tienes métodos de pago guardados. <a href="/payment-methods" style={{color: "#14bab9"}}>Agregar uno</a></p>
              )}

              <div className="payment-grid">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-option ${selectedPayment === method.id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedPayment(method.id)
                      setErrors(prev => ({ ...prev, payment: "" }))
                    }}
                  >
                    <div className="payment-icon-wrap">
                      <img src={getIconForMethod(method)} alt={method.tipo} className="payment-icon" />
                    </div>
                    <div className="payment-info">
                      <h4 className="payment-type">{method.tipo.toUpperCase()}</h4>
                      <p className="payment-desc">{getResumenTexto(method)}</p>
                    </div>
                    <div className="payment-radio">
                      {selectedPayment === method.id && <div className="payment-radio-dot" />}
                    </div>
                  </div>
                ))}
              </div>

              {errors.payment && <span className="checkout-error">{errors.payment}</span>}
            </div>
          </div>

          <button className="checkout-submit" onClick={handleSubmit}>
            Completar orden
          </button>
        </section>
      </main>

      <Footer />

      <LoginRequiredModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onLogin={() => {
          closeModal()
          navigate("/Login")
        }}
      />
    </div>
  )
}