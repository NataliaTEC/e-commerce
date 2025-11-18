import CartMemento from './CartMemento.js';

export default class CartHistory {
  constructor() {
    this.stack = [];
  }

  save(state) {
    this.stack.push(new CartMemento(state));
  }

  getLast() {
    if (this.stack.length === 0) return null;
    const memento = this.stack.pop();
    return memento.getState();
  }
}
