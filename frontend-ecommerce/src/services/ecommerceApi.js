// frontend-ecommerce\src\services\ecommerceApi.js
const API_BASE = 'http://localhost:3000/api';

// Productos
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Error cargando productos');
  return await res.json();
}

export async function fetchProductsByCategory(categorySlug) {
  const res = await fetch(`${API_BASE}/products/category/${categorySlug}`);
  if (!res.ok) throw new Error('Error cargando productos por categoría');
  return await res.json();
}

export async function fetchProductsBySubcategory(subcategorySlug) {
  const res = await fetch(`${API_BASE}/products/subcategory/${subcategorySlug}`);
  if (!res.ok) throw new Error('Error cargando productos por subcategoría');
  return await res.json();
}

export async function fetchProductsBySearch(q) {
  const params = new URLSearchParams();
  if (q) params.append('q', q);

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Error al buscar productos');
  }
  return await res.json();
}

// Carrito
export async function addToCart(productId, quantity = 1) {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
    credentials: 'include'
  });
  return await res.json();
}

export async function fetchCart() {
  const res = await fetch(`${API_BASE}/cart/get`, {
    credentials: 'include'
  });
  return await res.json();
}

export async function undoCartChange() {
  const res = await fetch(`${API_BASE}/cart/undo`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Error deshaciendo el último cambio del carrito');
  return await res.json();
}

export async function clearCart() {
  const res = await fetch(`${API_BASE}/cart/clear`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Error vaciando el carrito');
  return await res.json();
}

export async function removeProductFromCart(productId) {
  const res = await fetch(`${API_BASE}/cart/remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
    credentials: 'include'
  });
  return await res.json();
}

export async function updateCartItem(productId, quantity, increment = false) {
  const res = await fetch(`${API_BASE}/cart/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity, increment }),
    credentials: "include"
  });
  return await res.json();
}

export async function fetchCartCount() {
  const cart = await fetchCart();
  return cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
}

export async function isUserLoggedIn() {
  const res = await fetch(`${API_BASE}/session/check`, {
    credentials: 'include'
  });
  return res.ok;
}

// Pagos
export async function pay(tipoPago, datosPago) {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipoPago, datosPago })
  });
  return await res.json();
}
