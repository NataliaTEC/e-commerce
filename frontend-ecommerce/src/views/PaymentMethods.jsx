import React, { useEffect, useState } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "./paymentMethods.css"

// Iconos por tipo/brand/banco (Cloudinary)
const CARD_BRANDS = {
  visa: {
    key: "visa",
    label: "Visa",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672532/5baacb34-42f4-44fe-b3da-038bfc02f948.png",
    validate: (digits) => digits.length === 16 && digits.startsWith("4"),
  },
  mastercard: {
    key: "mastercard",
    label: "Mastercard",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672595/ab223c4b-5902-4804-ab96-ed10c274d250.png",
    // simplificado: 16 digitos y empieza en 5 o 2
    validate: (digits) =>
      digits.length === 16 && /^[25]/.test(digits),
  },
  amex: {
    key: "amex",
    label: "American Express",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672632/cfc69eca-0d77-4980-9ddb-23989c38dc34.png",
    validate: (digits) =>
      digits.length === 15 && /^3[47]/.test(digits),
  },
  discover: {
    key: "discover",
    label: "Discover",
    img: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672366/e4674dbe-2912-49cd-aa51-534a99ed17f6.png",
    validate: (digits) =>
      digits.length === 16 && /^6/.test(digits),
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
}

// Iconos para otros metodos
const EXTRA_ICONS = {
  paypal:
    "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672094/778277fc-ce07-4dd3-a405-d1fe8a148cba.png",
  sinpe:
    "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672046/1ef85718-e992-48b3-8028-27c361e78020.png",
  stripe:
    "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763672214/8fddd8ba-8b93-4225-a040-b3e30fc92d6f.png",
}

// Determina el icono a mostrar en la lista, segun el metodo guardado
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

export default function PaymentMethods() {
  const [methods, setMethods] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [tipo, setTipo] = useState("tarjeta")
  const [formData, setFormData] = useState({})
  const [error, setError] = useState("")
  const [removingIds, setRemovingIds] = useState([])
  const [cardBrand, setCardBrand] = useState("visa")
  const [bankKey, setBankKey] = useState("bcr")

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("metodosPago") || "[]")
    setMethods(saved)
  }, [])

  const guardarLocal = (data) => {
    localStorage.setItem("metodosPago", JSON.stringify(data))
  }

  const resetForm = () => {
    setFormData({})
    setError("")
    setTipo("tarjeta")
    setCardBrand("visa")
    setBankKey("bcr")
  }

  const abrirModal = () => {
    resetForm()
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setError("")
  }

  const handleDelete = (id) => {
    setRemovingIds((prev) => (prev.includes(id) ? prev : [...prev, id]))

    setTimeout(() => {
      setMethods((prev) => {
        const updated = prev.filter((m) => m.id !== id)
        guardarLocal(updated)
        return updated
      })
      setRemovingIds((prev) => prev.filter((x) => x !== id))
    }, 250)
  }

  const handleFieldChange = (name, value) => {
    let v = value

    if (name === "cardNumber") {
      v = v.replace(/\D/g, "").slice(0, 19)
    } else if (name === "phone") {
      v = v.replace(/\D/g, "").slice(0, 8)
    } else if (name === "accountNumber") {
      v = v.replace(/\D/g, "").slice(0, 22)
    }

    if (name === "cardHolder" || name === "bankName") {
      v = v.replace(/\d/g, "")
    }

    setFormData((prev) => ({
      ...prev,
      [name]: v,
    }))
    setError("")
  }

  const validarYCrearMetodo = () => {
    const data = formData || {}
    const trimmedTipo = tipo

    if (trimmedTipo === "tarjeta") {
      const digits = (data.cardNumber || "").replace(/\D/g, "")
      if (!cardBrand || !CARD_BRANDS[cardBrand]) {
        setError("Selecciona una marca de tarjeta.")
        return null
      }
      const brandCfg = CARD_BRANDS[cardBrand]

      if (!brandCfg.validate(digits)) {
        setError(
          `El numero no coincide con el formato de ${brandCfg.label}. Verifica la cantidad de digitos.`
        )
        return null
      }

      if (!data.cardHolder || data.cardHolder.trim().length < 3) {
        setError("Ingresa el nombre del titular (minimo 3 caracteres).")
        return null
      }

      return {
        tipo: "tarjeta",
        datos: {
          cardNumber: digits,
          cardHolder: data.cardHolder.trim(),
          brand: cardBrand,
        },
      }
    }

    if (trimmedTipo === "sinpe") {
      const digits = (data.phone || "").replace(/\D/g, "")
      if (!/^\d{8}$/.test(digits)) {
        setError("Ingresa un numero de telefono SINPE valido (8 digitos).")
        return null
      }
      return {
        tipo: "sinpe",
        datos: { phone: "506" + digits },
      }
    }

    if (trimmedTipo === "transferencia") {
      const digits = (data.accountNumber || "").replace(/\D/g, "")
      if (!digits || digits.length < 10) {
        setError("Ingresa un numero de cuenta valido (minimo 10 digitos).")
        return null
      }

      const bankCfg = BANKS[bankKey] || BANKS.bcr

      return {
        tipo: "transferencia",
        datos: {
          accountNumber: digits,
          bankKey: bankCfg.key,
          bankName: bankCfg.label,
        },
      }
    }

    if (trimmedTipo === "paypal") {
      const email = (data.email || "").trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Ingresa un correo electronico valido de PayPal.")
        return null
      }
      return {
        tipo: "paypal",
        datos: { email },
      }
    }

    if (trimmedTipo === "stripe") {
      const clientId = (data.clientId || "").trim()
      if (clientId.length < 6) {
        setError("Ingresa un ID de cliente Stripe valido (minimo 6 caracteres).")
        return null
      }
      return {
        tipo: "stripe",
        datos: { clientId },
      }
    }

    setError("Tipo de metodo de pago no soportado.")
    return null
  }

  const handleAdd = () => {
    const nuevoBase = validarYCrearMetodo()
    if (!nuevoBase) return

    const nuevo = {
      id: Date.now(),
      ...nuevoBase,
    }

    const updated = [...methods, nuevo]
    setMethods(updated)
    guardarLocal(updated)
    cerrarModal()
  }

  const renderCardBrandSwitch = () => {
    return (
      <div className="pm-switch-row">
        {Object.values(CARD_BRANDS).map((b) => (
          <button
            key={b.key}
            type="button"
            className={
              "pm-switch-option " + (cardBrand === b.key ? "active" : "")
            }
            onClick={() => {
              setCardBrand(b.key)
              setError("")
            }}
          >
            <img src={b.img} alt={b.label} />
            <span>{b.label}</span>
          </button>
        ))}
      </div>
    )
  }

  const renderBankSwitch = () => {
    return (
      <div className="pm-switch-row">
        {Object.values(BANKS).map((b) => (
          <button
            key={b.key}
            type="button"
            className={
              "pm-switch-option " + (bankKey === b.key ? "active" : "")
            }
            onClick={() => {
              setBankKey(b.key)
              setError("")
            }}
          >
            <img src={b.img} alt={b.label} />
            <span>{b.label}</span>
          </button>
        ))}
      </div>
    )
  }

  const renderFormFields = () => {
    if (tipo === "tarjeta") {
      return (
        <>
          <label>Marca de tarjeta</label>
          {renderCardBrandSwitch()}

          <label>Numero de tarjeta</label>
          <input
            name="cardNumber"
            inputMode="numeric"
            maxLength={19}
            placeholder="Digita el numero sin espacios"
            value={formData.cardNumber || ""}
            onChange={(e) => handleFieldChange("cardNumber", e.target.value)}
          />

          <label>Nombre del titular</label>
          <input
            name="cardHolder"
            placeholder="Como aparece en la tarjeta"
            value={formData.cardHolder || ""}
            onChange={(e) => handleFieldChange("cardHolder", e.target.value)}
          />
        </>
      )
    }

    if (tipo === "sinpe") {
      return (
        <>
          <label>Telefono (SINPE movil)</label>
          <div className="sinpe-wrapper">
            <span className="sinpe-prefix">+506</span>
            <input
              name="phone"
              inputMode="numeric"
              maxLength={8}
              placeholder="Ej: 88887777"
              value={formData.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
            />
          </div>
        </>
      )
    }

    if (tipo === "transferencia") {
      const bankCfg = BANKS[bankKey] || BANKS.bcr

      return (
        <>
          <label>Banco</label>
          {renderBankSwitch()}

          <label>Cuenta bancaria</label>
          <input
            name="accountNumber"
            inputMode="numeric"
            maxLength={22}
            placeholder="Numero de cuenta (solo digitos)"
            value={formData.accountNumber || ""}
            onChange={(e) => handleFieldChange("accountNumber", e.target.value)}
          />

          <p className="pm-hint">
            Guardaras esta cuenta como: <strong>{bankCfg.label}</strong>
          </p>
        </>
      )
    }

    if (tipo === "paypal") {
      return (
        <>
          <label>Correo de PayPal</label>
          <input
            name="email"
            placeholder="ejemplo@correo.com"
            value={formData.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
          />
        </>
      )
    }

    if (tipo === "stripe") {
      return (
        <>
          <label>ID de cliente Stripe</label>
          <input
            name="clientId"
            placeholder="Ej: cus_ABC123"
            value={formData.clientId || ""}
            onChange={(e) => handleFieldChange("clientId", e.target.value)}
          />
        </>
      )
    }

    return null
  }

  const getResumenTexto = (m) => {
    if (m.tipo === "tarjeta") {
      const digits = (m.datos.cardNumber || "").replace(/\D/g, "")
      const last4 = digits.slice(-4)
      const brand = m.datos.brand
        ? CARD_BRANDS[m.datos.brand]?.label || m.datos.brand
        : "Tarjeta"
      return last4
        ? `${brand} • terminacion ****${last4}`
        : `${brand} registrada`
    }
    if (m.tipo === "sinpe") {
      return `Telefono: +${m.datos.phone}`
    }
    if (m.tipo === "transferencia") {
      const digits = (m.datos.accountNumber || "").replace(/\D/g, "")
      const last4 = digits.slice(-4)
      return last4
        ? `${m.datos.bankName} • cuenta ****${last4}`
        : `${m.datos.bankName}`
    }
    if (m.tipo === "paypal") {
      return `Correo: ${m.datos.email}`
    }
    if (m.tipo === "stripe") {
      return `Cliente: ${m.datos.clientId}`
    }
    return ""
  }

  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        <section className="pm-page">
          <h1 className="pm-title">Tus metodos de pago</h1>
          <p className="pm-subtitle">
            Visualiza, agrega o elimina los metodos de pago que usas habitualmente en la tienda.
          </p>

          <button className="pm-add-btn" onClick={abrirModal}>
            + Agregar metodo de pago
          </button>

          <div className="pm-grid">
            {methods.map((m) => (
              <article
                key={m.id}
                className={
                  "pm-card " + (removingIds.includes(m.id) ? "pm-card-removing" : "")
                }
              >
                <div className="pm-card-top-border" />
                <div className="pm-icon-wrap">
                  <img
                    src={getIconForMethod(m)}
                    alt={m.tipo}
                    className="pm-icon"
                  />
                </div>
                <h3 className="pm-card-title">{m.tipo.toUpperCase()}</h3>
                <p className="pm-desc">{getResumenTexto(m)}</p>
                <button className="pm-delete" onClick={() => handleDelete(m.id)}>
                  Eliminar
                </button>
              </article>
            ))}

            {methods.length === 0 && (
              <p className="pm-empty">Todavia no tienes metodos de pago guardados.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {modalOpen && (
        <div className="pm-modal">
          <div className="pm-modal-content pm-modal-wide">
            <h2>Agregar metodo de pago</h2>

            <label>Tipo de metodo</label>
            <select
              value={tipo}
              onChange={(e) => {
                const val = e.target.value
                setTipo(val)
                setFormData({})
                setError("")
                if (val === "tarjeta" && !cardBrand) setCardBrand("visa")
                if (val === "transferencia" && !bankKey) setBankKey("bcr")
              }}
            >
              <option value="tarjeta">Tarjeta de credito/debito</option>
              <option value="sinpe">SINPE Movil</option>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
            </select>

            {renderFormFields()}

            {error && <p className="pm-error">{error}</p>}

            <div className="pm-modal-actions">
              <button className="pm-save" onClick={handleAdd}>
                Guardar
              </button>
              <button className="pm-cancel" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
