import PaymentGateway from './PaymentGateway.js';

export default class PaypalGateway extends PaymentGateway {
  async processPayment(amount, paymentData) {
    // Simular el pago
    console.log('Procesando pago con Paypal', amount, paymentData);
    return { ok: true, transactionId: 'PAYPAL-456' };
  }
}
