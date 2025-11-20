import CartMemento from "./memento/CartMemento.js";

export default class Cart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity) {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
      if (existing.quantity <= 0) this.removeItem(product.id);
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.product.id !== productId);
  }

  updateItemQuantity(productId, quantity) {
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  clear() {
    this.items = [];
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  createMemento() {
    return new CartMemento(
      this.items.map(i => ({
        product: { ...i.product },
        quantity: i.quantity
      }))
    );
  }

  restore(memento) {
    this.items = memento.getState().map(i => ({
      product: { ...i.product },
      quantity: i.quantity
    }));
  }
}
