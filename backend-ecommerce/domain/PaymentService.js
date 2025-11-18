// backend/domain/PaymentService.js
import Payment from './Payment.js';
import StripeGateway from './gateways/StripeGateway.js';
import PaypalGateway from './gateways/PayPalGateway.js';

export default class PaymentService {
  constructor() {
    this.gateways = {
      stripe: new StripeGateway(),
      paypal: new PaypalGateway()
    };
  }

  async pagar(tipoPago, total, datosPago) {
    const gateway = this.gateways[tipoPago];
    if (!gateway) {
      throw new Error('Tipo de pago no soportado');
    }

    const payment = new Payment(gateway);
    return payment.pay(total, datosPago);
  }
}
