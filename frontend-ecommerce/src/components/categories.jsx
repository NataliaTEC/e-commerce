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
    { id: 1, nombre: 'Celulares',     slug: 'celulares',     icono: new URL('../assets/Categories/phone.svg', import.meta.url).href },
    { id: 2, nombre: 'Computadoras',  slug: 'computadoras',  icono: new URL('../assets/Categories/laptop.svg', import.meta.url).href },
    { id: 3, nombre: 'Parlantes',     slug: 'parlantes',     icono: new URL('../assets/Categories/speaker.svg', import.meta.url).href },
    { id: 4, nombre: 'Controles',     slug: 'controles',     icono: new URL('../assets/Categories/gamecontroller.svg', import.meta.url).href },
    { id: 5, nombre: 'Cámaras',       slug: 'camaras',       icono: new URL('../assets/Categories/camera.svg', import.meta.url).href },
    { id: 6, nombre: 'Accesorios',    slug: 'accesorios',    icono: new URL('../assets/Categories/accessories.svg', import.meta.url).href },
    { id: 7, nombre: 'Smart watch',   slug: 'smartwatch',    icono: new URL('../assets/Categories/smartwatch.svg', import.meta.url).href },
    { id: 8, nombre: 'Impresoras',    slug: 'impresoras',    icono: new URL('../assets/Categories/printer.svg', import.meta.url).href },
    { id: 9, nombre: 'Vigilancia',    slug: 'vigilancia',    icono: new URL('../assets/Categories/securitycamera.svg', import.meta.url).href },
    { id: 10, nombre: 'Micrófonos',   slug: 'microfonos',    icono: new URL('../assets/Categories/microphone.svg', import.meta.url).href },
    { id: 11, nombre: 'Mouse',        slug: 'mouse',         icono: new URL('../assets/Categories/mouse.svg', import.meta.url).href },
    { id: 12, nombre: 'Volantes',     slug: 'volantes',      icono: new URL('../assets/Categories/gamesteeringwheel.svg', import.meta.url).href },
    { id: 13, nombre: 'Tv y Video',   slug: 'tv-video',      icono: new URL('../assets/Categories/tv.svg', import.meta.url).href },
    { id: 14, nombre: 'Audifonos',    slug: 'audifonos',     icono: new URL('../assets/Categories/headset.svg', import.meta.url).href },
    { id: 15, nombre: 'Teclados',     slug: 'teclados',      icono: new URL('../assets/Categories/keyboard.svg', import.meta.url).href }
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

  const goToCategory = (slug) => {
    navigate({
      pathname: '/CatalogoProductos',
      search: `?categoria=${encodeURIComponent(slug)}`
    })
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

      carousel.addEventListener('mousedown', mousedown)
      carousel.addEventListener('mouseleave', mouseleave)
      carousel.addEventListener('mouseup', mouseup)
      carousel.addEventListener('mousemove', mousemove)
      carousel.addEventListener('dragstart', dragstart)

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
              <div
                key={`${categoria.id}-${idx}`}
                className="category-card"
                onClick={() => goToCategory(categoria.slug)}
              >
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
