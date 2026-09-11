// ============================================================
// models/Config.js
// ------------------------------------------------------------
// Guarda as configurações gerais do dashboard: o limite mensal de
// gastos definido pelo usuário e a meta financeira alvo.
//
// Esse "documento único" (singleton) evita a necessidade de criar
// um sistema de usuários/login só para salvar essas duas preferências.
// Sempre existirá no máximo 1 documento nesta coleção.
// ============================================================

const mongoose = require('mongoose');

const configSchema = new mongoose.Schema(
  {
    // Limite mensal de gastos definido pelo usuário no topo do dashboard.
    limiteGasto: {
      type: Number,
      default: 1500,
      min: 0,
    },

    // Meta financeira que o usuário quer atingir (usada no gráfico
    // "Linha de Base para Meta").
    metaAlvo: {
      type: Number,
      default: 5000,
      min: 0,
    },
  },
  { timestamps: true }
);

/**
 * Busca a configuração única do sistema. Se ainda não existir
 * nenhuma no banco, cria uma com os valores padrão.
 */
configSchema.statics.obterOuCriar = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model('Config', configSchema);
