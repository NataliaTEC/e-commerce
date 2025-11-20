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
  if (!res.ok) throw new Error('Error obteniendo el carrito');
  return await res.json();
}

export async function undoCartChange() {
  const res = await fetch(`${API_BASE}/cart/undo`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Error deshaciendo el último cambio del carrito');
  return await res.json();
}

export async function clearCart() {
  const res = await fetch(`${API_BASE}/cart/clear`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Error vaciando el carrito');
  return await res.json();
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
