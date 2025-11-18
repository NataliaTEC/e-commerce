import PaymentGateway from './PaymentGateway.js';

export default class StripeGateway extends PaymentGateway {
  async processPayment(amount, paymentData) {
    // Simular el pago
    console.log('Procesando pago con Stripe', amount, paymentData);
    return { ok: true, transactionId: 'STRIPE-123' };
  }
}
