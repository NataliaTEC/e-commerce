import CartMemento from './CartMemento.js';

export default class CartHistory {
  constructor() {
    this.stack = [];
  }

  save(memento) {
    this.stack.push(memento);
  }

  getLast() {
    if (this.stack.length === 0) return null;
    const memento = this.stack.pop();
    return memento;
  }
}
