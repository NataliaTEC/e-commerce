export default class ECommerceFacade {
  constructor(productRepo, cart, paymentService, cartHistory) {
    this.productRepo = productRepo;
    this.cart = cart;
    this.paymentService = paymentService;
    this.cartHistory = cartHistory;
  }

  async listarProductos() {
    return await this.productRepo.getAll();
  }

  async obtenerProducto(id) {
    return await this.productRepo.getById(id);
  }

  async listarProductosPorCategoria(categorySlug) {
    return await this.productRepo.getByCategory(categorySlug);
  }

  async agregarAlCarrito(productId, quantity) {
    const product = await this.productRepo.getById(productId);
    if (!product) throw new Error('Producto no encontrado');

    this.cartHistory.save(this.cart.createMemento());
    this.cart.addItem(product, quantity);
    return this.cart.getItems();
  }

  deshacerUltimoCambioCarrito() {
    const memento = this.cartHistory.getLast();
    if (memento) {
      this.cart.restore(memento);
    }
    return this.cart.getItems();
  }

  obtenerCarrito() {
    return {
      items: this.cart.getItems(),
      total: this.cart.getTotal()
    };
  }

  vaciarCarrito() {
    this.cartHistory.save(this.cart.createMemento());
    this.cart.clear();
  }

  async pagar(tipoPago, datosPago) {
    // Cambiar de estrategia de pago
    const total = this.cart.getTotal();
    if (total <= 0) throw new Error('Carrito vacío');

    const resultado = await this.paymentService.pagar(tipoPago, total, datosPago);

    if (resultado.ok) {
      this.vaciarCarrito();
    }
    return resultado;
  }

  
}
