// backend/domain/gateways/SinpeMovilGateway.js
import PaymentGateway from './PaymentGateway.js'

export default class SinpeMovilGateway extends PaymentGateway {
  async processPayment(amount, paymentData) {
    const { phone, name, idNumber } = paymentData || {}

    if (!amount || amount <= 0) {
      return { ok: false, error: 'Monto invalido' }
    }

    if (!phone || typeof phone !== 'string') {
      return { ok: false, error: 'Numero de telefono requerido' }
    }

    const digits = phone.replace(/\s|-/g, '')
    if (!/^\d{8}$/.test(digits)) {
      return { ok: false, error: 'Numero de telefono invalido para Sinpe Movil' }
    }

    if (!name || name.trim().length < 3) {
      return { ok: false, error: 'Nombre del titular requerido' }
    }

    if (!idNumber || String(idNumber).trim().length < 8) {
      return { ok: false, error: 'Identificacion requerida' }
    }

    console.log('Procesando pago con Sinpe Movil', {
      amount,
      phone: digits,
      name,
      idNumber,
    })

    return {
      ok: true,
      transactionId: `SINPE-${Date.now()}`,
    }
  }
}
