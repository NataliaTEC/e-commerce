export default class Payment {
  constructor(gateway) {
    this.gateway = gateway;
  }

  async pay(amount, paymentData) {
    return this.gateway.processPayment(amount, paymentData);
  }
}
