// ============================================================
// models/Transacao.js
// ------------------------------------------------------------
// Define o "molde" (schema) de uma transação financeira no banco
// MongoDB: uma entrada (receita) ou saída (gasto) de dinheiro,
// vinculada a um mês, categoria e valor.
// ============================================================

const mongoose = require('mongoose');

const transacaoSchema = new mongoose.Schema(
  {
    // Mês da transação (1 a 12). Usado para os filtros e gráficos.
    mes: {
      type: Number,
      required: [true, 'O mês é obrigatório.'],
      min: 1,
      max: 12,
    },

    // Ano da transação. Permite o dashboard funcionar corretamente
    // em anos diferentes (o front-end antigo só considerava o mês).
    ano: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },

    // Tipo da movimentação: entrada (dinheiro que chega) ou
    // saída (dinheiro que sai).
    tipo: {
      type: String,
      required: true,
      enum: {
        values: ['entrada', 'saida'],
        message: 'O tipo deve ser "entrada" ou "saida".',
      },
    },

    // Categoria da movimentação (ex: Alimentação, Moradia, Salário...).
    categoria: {
      type: String,
      required: [true, 'A categoria é obrigatória.'],
      trim: true,
    },

    // Valor monetário da transação. Sempre armazenado como número
    // positivo; o "tipo" é que define se soma ou subtrai do saldo.
    valor: {
      type: Number,
      required: [true, 'O valor é obrigatório.'],
      min: [0.01, 'O valor deve ser maior que zero.'],
    },

    // Descrição livre opcional (ex: "Supermercado do mês").
    descricao: {
      type: String,
      trim: true,
      default: '',
    },

    // Data real de criação/lançamento (diferente de mês/ano, que são
    // usados para os agrupamentos do dashboard).
    data: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Adiciona automaticamente os campos createdAt/updatedAt.
    timestamps: true,
  }
);

// Índice para acelerar consultas por mês/ano/tipo, que é o padrão
// de acesso mais comum do dashboard.
transacaoSchema.index({ ano: 1, mes: 1, tipo: 1 });

module.exports = mongoose.model('Transacao', transacaoSchema);
