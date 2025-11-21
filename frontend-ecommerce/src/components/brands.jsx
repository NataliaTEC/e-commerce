// src/components/brands.jsx
import React, { useRef } from "react"
import "./brands.css"

const BRANDS = [
  {
    name: "Lenovo",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699459/lenovo_zdup7q.png",
  },
  {
    name: "Xiaomi",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699459/xiaomi_klrwku.png",
  },
  {
    name: "Hp",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699459/hp_glg82v.webp",
  },
  {
    name: "Asus",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699460/asus_sypuio.png",
  },
  {
    name: "Canon",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699460/canon_lvlsfc.png",
  },
  {
    name: "Gopro",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763700665/gopro_qeaulp.png",
  },
  {
    name: "Dji",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699482/dji_b2lvsr.png",
  },
  {
    name: "Sony",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699503/sony_rd0gmt.png",
  },
  {
    name: "Redragon",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699539/redragon_jrtcap.png",
  },
  {
    name: "Gigabyte",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699539/gigabyte_wzc4s0.png",
  },
  {
    name: "Hiperx",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699541/hyperX_efqdkg.png",
  },
  {
    name: "Msi",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763699539/msi_zomznw.webp",
  },
  {
    name: "Viewsonic",
    logo: "https://res.cloudinary.com/dpuuo4mfh/image/upload/v1763700299/viewsonic_wqu7uo.png",
  }
]

export default function Brands({ title = "" }) {
  const trackRef = useRef(null)

  const scroll = (dir) => {
    const el = trackRef.current
    if (!el) return
    const amount = el.offsetWidth * 0.6 // cuánto se mueve por click
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section className="brands-section">
      {title && <h2 className="brands-title">{title}</h2>}

      <div className="brands-carousel">
        <button
          type="button"
          className="brands-arrow brands-arrow-left"
          aria-label="Marcas anteriores"
          onClick={() => scroll("left")}
        >
          ‹
        </button>

        <div className="brands-track" ref={trackRef}>
          {BRANDS.map((brand) => (
            <div className="brand-item" key={brand.name}>
              <img src={brand.logo} alt={brand.name} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="brands-arrow brands-arrow-right"
          aria-label="Más marcas"
          onClick={() => scroll("right")}
        >
          ›
        </button>
      </div>
    </section>
  )
}
