import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './categories.css'

export default function Categories() {
  const carouselRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const navigate = useNavigate()

  const categories = [
    { id: 1, nombre: 'Celulares', icono: new URL('../assets/Categories/phone.svg', import.meta.url).href, ruta: 'Celulares' },
    { id: 2, nombre: 'Computadoras', icono: new URL('../assets/Categories/laptop.svg', import.meta.url).href, ruta: 'Computadoras' },
    { id: 3, nombre: 'Tv y Video', icono: new URL('../assets/Categories/tv.svg', import.meta.url).href, ruta: 'Tv y Video' },
    { id: 4, nombre: 'Parlantes', icono: new URL('../assets/Categories/speaker.svg', import.meta.url).href, ruta: 'Parlantes' },
    { id: 5, nombre: 'Controles', icono: new URL('../assets/Categories/gamecontroller.svg', import.meta.url).href, ruta: 'Controles' },
    { id: 6, nombre: 'Cámaras', icono: new URL('../assets/Categories/camera.svg', import.meta.url).href, ruta: 'Cámaras' },
    { id: 7, nombre: 'Audifonos', icono: new URL('../assets/Categories/headset.svg', import.meta.url).href, ruta: 'Audifonos' },
    { id: 8, nombre: 'Teclados', icono: new URL('../assets/Categories/keyboard.svg', import.meta.url).href, ruta: 'Teclados' },
    { id: 9, nombre: 'Mouse', icono: new URL('../assets/Categories/mouse.svg', import.meta.url).href, ruta: 'Mouse' },
    { id: 10, nombre: 'Volantes', icono: new URL('../assets/Categories/gamesteeringwheel.svg', import.meta.url).href, ruta: 'Volantes' },
    { id: 11, nombre: 'Impresoras', icono: new URL('../assets/Categories/printer.svg', import.meta.url).href, ruta: 'Impresoras' },
    { id: 12, nombre: 'Vigilancia', icono: new URL('../assets/Categories/securitycamera.svg', import.meta.url).href, ruta: 'Vigilancia' },
    { id: 13, nombre: 'Micrófonos', icono: new URL('../assets/Categories/microphone.svg', import.meta.url).href, ruta: 'Microfonos' },
    { id: 14, nombre: 'Smart watch', icono: new URL('../assets/Categories/smartwatch.svg', import.meta.url).href, ruta: 'Smart watch' },
    { id: 15, nombre: 'Accesorios', icono: new URL('../assets/Categories/accessories.svg', import.meta.url).href, ruta: 'Accesorios' },
  ]

  const infiniteCategories = [...categories, ...categories, ...categories]

  const getPageX = (e) => (e.touches ? e.touches[0].pageX : e.pageX)

  const startDragging = (e) => {
    const carousel = carouselRef.current
    if (!carousel) return
    isDragging.current = true
    startX.current = getPageX(e) - carousel.offsetLeft
    scrollLeft.current = carousel.scrollLeft
    carousel.style.cursor = 'grabbing'
    carousel.style.scrollBehavior = 'auto'
  }

  const stopDragging = () => {
    const carousel = carouselRef.current
    isDragging.current = false
    if (carousel) {
      carousel.style.cursor = 'grab'
      carousel.style.scrollBehavior = 'smooth'
    }
  }

  const onDrag = (e) => {
    const carousel = carouselRef.current
    if (!isDragging.current || !carousel) return
    e.preventDefault()
    const x = getPageX(e) - carousel.offsetLeft
    const walk = (x - startX.current) * 2
    carousel.scrollLeft = scrollLeft.current - walk

    // Scroll infinito
    const firstSetWidth = carousel.scrollWidth / 3
    const currentScroll = carousel.scrollLeft

    if (currentScroll >= firstSetWidth * 2) {
      const newScrollLeft = currentScroll - firstSetWidth
      carousel.scrollLeft = newScrollLeft
      scrollLeft.current = newScrollLeft
      startX.current = getPageX(e) - carousel.offsetLeft
    }

    if (currentScroll <= firstSetWidth) {
      const newScrollLeft = currentScroll + firstSetWidth
      carousel.scrollLeft = newScrollLeft
      scrollLeft.current = newScrollLeft
      startX.current = getPageX(e) - carousel.offsetLeft
    }
  }

  const scroll = (direction) => {
    const container = carouselRef.current
    if (container) {
      const scrollAmount = 200
      container.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount

      const firstSetWidth = container.scrollWidth / 3
      setTimeout(() => {
        if (container.scrollLeft >= (firstSetWidth * 2) - container.clientWidth) {
          container.style.scrollBehavior = 'auto'
          container.scrollLeft -= firstSetWidth
          container.style.scrollBehavior = 'smooth'
        }
        if (container.scrollLeft <= firstSetWidth) {
          container.style.scrollBehavior = 'auto'
          container.scrollLeft += firstSetWidth
          container.style.scrollBehavior = 'smooth'
        }
      }, 300)
    }
  }

  const setupInfiniteScroll = (carousel) => {
    if (!carousel) return
    const firstSetWidth = carousel.scrollWidth / 3
    carousel.scrollLeft = firstSetWidth
  }

  const goToCategory = (categoria) => {
    // navegar a catálogo con query param
    navigate({ pathname: '/CatalogoProductos', search: `?categoria=${encodeURIComponent(categoria)}` })
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.style.cursor = 'grab'

      const mousedown = (e) => startDragging(e)
      const mouseleave = () => stopDragging()
      const mouseup = () => stopDragging()
      const mousemove = (e) => onDrag(e)
      const dragstart = (e) => e.preventDefault()

      // Mouse events
      carousel.addEventListener('mousedown', mousedown)
      carousel.addEventListener('mouseleave', mouseleave)
      carousel.addEventListener('mouseup', mouseup)
      carousel.addEventListener('mousemove', mousemove)
      carousel.addEventListener('dragstart', dragstart)

      // Touch events
      carousel.addEventListener('touchstart', startDragging, { passive: false })
      carousel.addEventListener('touchend', stopDragging)
      carousel.addEventListener('touchmove', onDrag, { passive: false })

      setTimeout(() => setupInfiniteScroll(carousel), 100)

      return () => {
        carousel.removeEventListener('mousedown', mousedown)
        carousel.removeEventListener('mouseleave', mouseleave)
        carousel.removeEventListener('mouseup', mouseup)
        carousel.removeEventListener('mousemove', mousemove)
        carousel.removeEventListener('dragstart', dragstart)

        carousel.removeEventListener('touchstart', startDragging)
        carousel.removeEventListener('touchend', stopDragging)
        carousel.removeEventListener('touchmove', onDrag)
      }
    }
  }, [])

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">Encuentra todo lo que necesitas en un solo lugar</h2>
      </div>

      <div className="carousel-container">
        <button onClick={() => scroll('left')} className="carousel-btn carousel-btn-left" aria-label="Anterior">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="carousel-wrapper">
          <div className="categories-carousel" ref={carouselRef}>
            {infiniteCategories.map((categoria, idx) => (
              <div key={`${categoria.id}-${idx}`} className="category-card" onClick={() => goToCategory(categoria.ruta)}>
                <div className="category-icon">
                  <img src={categoria.icono} alt={categoria.nombre} />
                </div>
                <p className="category-name">{categoria.nombre}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => scroll('right')} className="carousel-btn carousel-btn-right" aria-label="Siguiente">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  )
}
