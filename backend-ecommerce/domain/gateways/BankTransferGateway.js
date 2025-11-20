// backend/domain/gateways/BankTransferGateway.js
import PaymentGateway from './PaymentGateway.js'

export default class BankTransferGateway extends PaymentGateway {
  async processPayment(amount, paymentData) {
    const { accountNumber, bankName, reference } = paymentData || {}

    if (!amount || amount <= 0) {
      return { ok: false, error: 'Monto invalido' }
    }

    if (!accountNumber || String(accountNumber).trim().length < 6) {
      return { ok: false, error: 'Numero de cuenta requerido' }
    }

    if (!bankName || bankName.trim().length < 3) {
      return { ok: false, error: 'Nombre del banco requerido' }
    }

    if (!reference || reference.trim().length < 4) {
      return { ok: false, error: 'Referencia de pago requerida' }
    }

    console.log('Registrando orden para transferencia bancaria', {
      amount,
      accountNumber,
      bankName,
      reference,
    })

    // En transferencias normalmente no se confirma de inmediato
    return {
      ok: true,
      transactionId: `BANK-${Date.now()}`,
      status: 'pendiente',
    }
  }
}
