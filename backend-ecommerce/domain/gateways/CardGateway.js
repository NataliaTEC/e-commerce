// backend/domain/gateways/CardGateway.js
import PaymentGateway from './PaymentGateway.js'

export default class CardGateway extends PaymentGateway {
  async processPayment(amount, paymentData) {
    const {
      cardNumber,
      cardHolder,
      expMonth,
      expYear,
      cvv,
      brand,
    } = paymentData || {}

    if (!amount || amount <= 0) {
      return { ok: false, error: 'Monto invalido' }
    }

    if (!cardNumber || typeof cardNumber !== 'string') {
      return { ok: false, error: 'Numero de tarjeta requerido' }
    }

    const digits = cardNumber.replace(/\s|-/g, '')
    if (!/^\d{13,19}$/.test(digits)) {
      return { ok: false, error: 'Numero de tarjeta invalido' }
    }

    if (!cardHolder || cardHolder.trim().length < 3) {
      return { ok: false, error: 'Nombre del titular invalido' }
    }

    if (!expMonth || !/^(0?[1-9]|1[0-2])$/.test(String(expMonth))) {
      return { ok: false, error: 'Mes de expiracion invalido' }
    }

    if (!expYear || !/^\d{2,4}$/.test(String(expYear))) {
      return { ok: false, error: 'Ano de expiracion invalido' }
    }

    const year4 = String(expYear).length === 2 ? `20${expYear}` : String(expYear)
    const now = new Date()
    const cardDate = new Date(Number(year4), Number(expMonth) - 1, 1)

    if (cardDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
      return { ok: false, error: 'La tarjeta esta vencida' }
    }

    if (!cvv || !/^\d{3,4}$/.test(String(cvv))) {
      return { ok: false, error: 'CVV invalido' }
    }

    // simulacion de procesador
    console.log('Procesando pago con tarjeta', {
      amount,
      brand: brand || 'DESCONOCIDA',
      last4: digits.slice(-4),
    })

    return {
      ok: true,
      transactionId: `CARD-${Date.now()}`,
    }
  }
}
