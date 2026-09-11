// ============================================================
// controllers/saldoController.js
// ------------------------------------------------------------
// Lógica de negócio para os AJUSTES DE SALDO MANUAL: permite ao
// usuário registrar um valor de saldo digitado manualmente
// (ex: saldo inicial de uma conta) que soma/subtrai do saldo
// calculado a partir das transações normais.
// ============================================================

const SaldoManual = require('../models/SaldoManual');

/**
 * GET /api/saldo-manual
 * Lista todos os ajustes manuais de saldo já cadastrados.
 */
async function listarSaldoManual(req, res) {
  try {
    const ajustes = await SaldoManual.find().sort({ data: -1, createdAt: -1 });
    res.json(ajustes);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar ajustes de saldo manual.', detalhe: erro.message });
  }
}

/**
 * POST /api/saldo-manual
 * Cria um novo ajuste manual de saldo.
 * Corpo esperado: { descricao, valor, data }
 * O "valor" pode ser positivo (soma) ou negativo (subtrai).
 */
async function criarSaldoManual(req, res) {
  try {
    const { descricao, valor, data } = req.body;

    const novoAjuste = await SaldoManual.create({
      descricao,
      valor,
      data: data || Date.now(),
    });

    res.status(201).json(novoAjuste);
  } catch (erro) {
    if (erro.name === 'ValidationError') {
      return res.status(400).json({ erro: 'Dados inválidos.', detalhe: erro.message });
    }
    res.status(500).json({ erro: 'Erro ao criar ajuste de saldo manual.', detalhe: erro.message });
  }
}

/**
 * DELETE /api/saldo-manual/:id
 * Remove um ajuste manual de saldo específico.
 */
async function removerSaldoManual(req, res) {
  try {
    const removido = await SaldoManual.findByIdAndDelete(req.params.id);
    if (!removido) {
      return res.status(404).json({ erro: 'Ajuste de saldo manual não encontrado.' });
    }
    res.json({ mensagem: 'Ajuste de saldo manual removido com sucesso.', ajuste: removido });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao remover ajuste de saldo manual.', detalhe: erro.message });
  }
}

module.exports = {
  listarSaldoManual,
  criarSaldoManual,
  removerSaldoManual,
};
