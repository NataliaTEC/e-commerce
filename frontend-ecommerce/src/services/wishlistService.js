// Simple wishlist service using localStorage and window events

const KEY = 'wishlist_items_v1'

export function getWishlist() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) || []
  } catch {
    return []
  }
}

function resolveId(product) {
  if (!product) return null
  return product.id || product.sku || product.ruta || product.slug || null
}

function saveList(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
    window.dispatchEvent(new Event('wishlist-updated'))
  } catch {
    // ignore
  }
}

export function addToWishlist(product) {
  const list = getWishlist()
  const key = resolveId(product)
  const exists = list.find((p) => resolveId(p) === key)
  if (!exists) {
    list.unshift(product)
    saveList(list)
  }
  return list
}

export function removeFromWishlist(productId) {
  const list = getWishlist().filter((p) => resolveId(p) !== productId)
  saveList(list)
  return list
}

export function toggleWishlist(product) {
  const key = resolveId(product)
  if (!product || !key) return getWishlist()
  const list = getWishlist()
  const exists = list.find((p) => resolveId(p) === key)
  if (exists) {
    const filtered = list.filter((p) => resolveId(p) !== key)
    saveList(filtered)
    return filtered
  } else {
    list.unshift(product)
    saveList(list)
    return list
  }
}

export function isInWishlist(productOrId) {
  if (!productOrId) return false
  const list = getWishlist()
  const key = typeof productOrId === 'object' ? resolveId(productOrId) : productOrId
  if (!key) return false
  return list.some((p) => resolveId(p) === key)
}

export function wishlistCount() {
  return getWishlist().length
}
