export default class Cart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity) {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
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
    // clonar el estado actual
    return {
      items: this.items.map(i => ({
        product: { ...i.product },
        quantity: i.quantity
      }))
    };
  }

  restore(memento) {
    this.items = memento.items.map(i => ({
      product: { ...i.product },
      quantity: i.quantity
    }));
  }
}
