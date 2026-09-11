// ============================================================
// models/SaldoManual.js
// ------------------------------------------------------------
// Representa um AJUSTE DE SALDO MANUAL: um valor que o usuário
// digita diretamente (não vindo de uma transação de entrada/saída)
// para corrigir ou definir o saldo acumulado do sistema.
//
// Exemplos de uso:
//  - "Saldo inicial da conta" ao começar a usar o app (ex: R$ 3.200,00)
//  - Um ajuste manual porque o app não registrou algo (ex: -R$ 50,00)
//
// Cada lançamento manual tem um valor (pode ser positivo ou negativo)
// e é somado diretamente ao saldo total calculado a partir das
// transações registradas.
// ============================================================

const mongoose = require('mongoose');

const saldoManualSchema = new mongoose.Schema(
  {
    // Descrição do motivo do ajuste manual.
    descricao: {
      type: String,
      required: [true, 'Informe uma descrição para o ajuste de saldo.'],
      trim: true,
    },

    // Valor do ajuste. Pode ser positivo (aumenta o saldo) ou
    // negativo (diminui o saldo) — por isso NÃO tem um "min" como
    // em Transacao, diferente das entradas/saídas normais.
    valor: {
      type: Number,
      required: [true, 'O valor do ajuste de saldo é obrigatório.'],
      validate: {
        validator: (v) => v !== 0,
        message: 'O valor do ajuste não pode ser zero.',
      },
    },

    // Data em que o ajuste foi feito/deve valer.
    data: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SaldoManual', saldoManualSchema);
