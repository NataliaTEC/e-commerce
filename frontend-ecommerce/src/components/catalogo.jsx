import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../services/ecommerceApi'
import { toggleWishlist, isInWishlist } from '../services/wishlistService'
import WishFill from '../assets/icons/heart.svg'
import PropTypes from "prop-types";
import "./catalogo.css";

export default function Catalogo({
	title,
	products = [],
	hero = null,
	initialItems = 4,
	fetchUrl = null,
	filter = null, // { category: 'computadoras' } or custom predicate
}) {
	const trackRef = useRef(null);
	const [page, setPage] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(initialItems);
	const [remoteProducts, setRemoteProducts] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;
		const onResize = () => {
			const w = window.innerWidth;
			let items = initialItems;
			if (w >= 1200) items = initialItems;
			else if (w >= 900) items = Math.max(1, Math.min(4, initialItems - 1));
			else if (w >= 600) items = Math.max(1, Math.min(3, initialItems - 2));
			else items = 1;
			setItemsPerPage(items);
			setPage(0);
			if (trackRef.current) trackRef.current.scrollTo({ left: 0, behavior: "smooth" });
		};

		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [initialItems]);

	// Fetch remote data if fetchUrl is provided
	useEffect(() => {
		if (!fetchUrl) return;
		let cancelled = false;
		setLoading(true);
		setError('');
		fetch(fetchUrl)
			.then((r) => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then((data) => {
				if (cancelled) return;
				// data may be an object with { products } or an array
				const list = Array.isArray(data) ? data : data.products || [];
				setRemoteProducts(list);
			})
			.catch((err) => {
				if (cancelled) return;
				setError(String(err));
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [fetchUrl]);

	// decide which source to use: remote (if any) or local `products` prop
	const sourceProducts = remoteProducts || products || [];

	// apply basic filter if provided
	const filtered = Array.isArray(sourceProducts)
		? sourceProducts.filter((p) => {
				if (!filter) return true;
				if (typeof filter === 'function') return filter(p);
				if (filter.category) return (p.category || p.productType || p.subcategory || '').toString().toLowerCase() === filter.category.toString().toLowerCase();
				return true;
			})
		: [];

	const pages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

	const goTo = (idx) => {
		const clamped = Math.max(0, Math.min(pages - 1, idx));
		setPage(clamped);
		if (!trackRef.current) return;
		const track = trackRef.current;
		const pageWidth = track.clientWidth;
		track.scrollTo({ left: clamped * pageWidth, behavior: "smooth" });
	};

	const next = () => goTo(page + 1);
	const prev = () => goTo(page - 1);

	const navigate = useNavigate()

	// rerender helper when wishlist changes
	const [, setWishChanged] = useState(0)
	useEffect(() => {
		const onW = () => setWishChanged((s) => s + 1)
		window.addEventListener('wishlist-updated', onW)
		return () => window.removeEventListener('wishlist-updated', onW)
	}, [])

	const agregarAlCarrito = (productId) => {
		addToCart(productId, 1)
			.then((data) => {
				if (data.ok) {
					alert('Producto agregado al carrito')
				} else {
					const errMsg = String(data.error || '').toLowerCase()
					if (errMsg.includes('iniciar') || errMsg.includes('sesión') || errMsg.includes('401')) {
						alert('Debes iniciar sesión para agregar productos al carrito.')
					} else {
						alert('Error al agregar el producto al carrito: ' + (data.error || ''))
					}
				}
			})
			.catch((err) => {
				const msg = String(err || '').toLowerCase()
				if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('sesión')) {
					alert('Debes iniciar sesión para agregar productos al carrito.')
				} else {
					alert('Error al agregar el producto al carrito: ' + err)
				}
			})
			.finally(() => window.dispatchEvent(new Event('cart-updated')))
	}

	const toggleFav = (p) => {
		toggleWishlist(p)
		// event will update via listener
	}

	return (
		<section className="catalogo">
			<div className="catalogo-header">
				<h3 className="catalogo-title">{title}</h3>
			</div>

			<div className="catalogo-body">
				{hero ? (
					<div className="catalogo-hero">
						<img src={hero.image} alt={hero.title || "hero"} />
						{hero.title && <div className="catalogo-hero-title">{hero.title}</div>}
					</div>
				) : null}

				<div className="catalogo-track-wrap">
					<button className="catalogo-nav prev" onClick={prev} aria-label="Anterior">
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
					</button>
					<div className="catalogo-track" ref={trackRef}>
						<div className="catalogo-items">
							{(loading ? [] : filtered).map((p) => (
								<article className="product-card catalogo-card" key={p.id}>
									<div className="product-image-wrapper catalogo-card-media">
										<button
											type="button"
											className={`product-wishlist-btn ${isInWishlist(p) ? 'active' : ''}`}
											aria-label={isInWishlist(p) ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
											onClick={() => toggleFav(p)}
										>
											{isInWishlist(p) ? (
												<img src={WishFill} alt="Favorito" />
											) : (
												<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="outline-heart" aria-hidden="true">
													<path d="M12 6C10.2 3.9 7.19 3.25 4.94 5.17 2.69 7.09 2.37 10.31 4.14 12.58 5.61 14.47 10.06 18.45 11.52 19.73 11.69 19.88 11.77 19.95 11.86 19.98 11.95 20.01 12.04 20.01 12.12 19.98 12.22 19.95 12.3 19.88 12.46 19.74 13.92 18.45 18.37 14.47 19.85 12.58 21.62 10.31 21.34 7.08 19.05 5.18 16.76 3.28 13.8 3.9 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											)}
										</button>

										<img
											src={p.image || p.ruta || p.img || p.imageUrl}
											alt={p.title || p.name}
											className="product-image"
											loading="lazy"
										/>
										{p.badge ? <span className="catalogo-badge">{p.badge}</span> : null}
									</div>
									<div className="product-body catalogo-card-body">
										<h3 className="product-name catalogo-product-title">{p.title || p.name}</h3>
										<p className="product-meta">
											<span>{p.subcategory || p.productType || ''}</span>
											{p.productType && <><span className="dot">•</span><span>{p.productType}</span></>}
										</p>
										<p className="product-price catalogo-price">
											{p.price != null ? (typeof p.price === 'number' ? `₡${Number(p.price).toLocaleString('es-CR')}` : p.price) : ''}
										</p>
									</div>
									<div className="product-actions catalogo-actions">
										<button
											type="button"
											className="product-button primary"
											onClick={() => agregarAlCarrito(p.id)}
										>
											Agregar al carrito
										</button>
										<button
											type="button"
											className="product-button ghost"
											onClick={() => navigate(`/detalleProducto/${p.id}`)}
										>
											Ver detalles
										</button>
									</div>
								</article>
							))}
						</div>
					</div>
					<button className="catalogo-nav next" onClick={next} aria-label="Siguiente">
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
					</button>
				</div>

				<div className="catalogo-dots">
					{Array.from({ length: pages }).map((_, i) => (
						<button
							key={i}
							className={`catalogo-dot ${i === page ? "active" : ""}`}
							onClick={() => goTo(i)}
							aria-label={`Página ${i + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

Catalogo.propTypes = {
	title: PropTypes.string,
	products: PropTypes.array,
	hero: PropTypes.object,
	initialItems: PropTypes.number,
	fetchUrl: PropTypes.string,
	filter: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

