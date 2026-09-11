// ============================================================
// controllers/configController.js
// ------------------------------------------------------------
// Lógica de negócio para as configurações gerais do dashboard:
// limite mensal de gastos e meta financeira alvo.
// ============================================================

const Config = require('../models/Config');

/**
 * GET /api/config
 * Retorna a configuração atual (cria uma padrão se ainda não existir).
 */
async function obterConfig(req, res) {
  try {
    const config = await Config.obterOuCriar();
    res.json(config);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao obter configurações.', detalhe: erro.message });
  }
}

/**
 * PUT /api/config
 * Atualiza o limite de gastos e/ou a meta alvo.
 * Corpo esperado: { limiteGasto, metaAlvo } (ambos opcionais)
 */
async function atualizarConfig(req, res) {
  try {
    const config = await Config.obterOuCriar();

    if (req.body.limiteGasto !== undefined) config.limiteGasto = req.body.limiteGasto;
    if (req.body.metaAlvo !== undefined) config.metaAlvo = req.body.metaAlvo;

    await config.save();
    res.json(config);
  } catch (erro) {
    if (erro.name === 'ValidationError') {
      return res.status(400).json({ erro: 'Dados inválidos.', detalhe: erro.message });
    }
    res.status(500).json({ erro: 'Erro ao atualizar configurações.', detalhe: erro.message });
  }
}

module.exports = {
  obterConfig,
  atualizarConfig,
};
