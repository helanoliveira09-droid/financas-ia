// ============================================================
// routes/transacoes.js
// ------------------------------------------------------------
// Define os endpoints HTTP relacionados a transações (entradas
// e saídas), ligando cada rota à função correspondente do
// controller.
// ============================================================

const express = require('express');
const router = express.Router();
const {
  listarTransacoes,
  criarTransacao,
  removerTransacao,
  limparTransacoes,
} = require('../controllers/transacoesController');

// GET    /api/transacoes         -> lista (com filtros opcionais)
// POST   /api/transacoes         -> cria uma nova transação
// DELETE /api/transacoes         -> limpa TODO o histórico
// DELETE /api/transacoes/:id     -> remove uma transação específica

router.get('/', listarTransacoes);
router.post('/', criarTransacao);
router.delete('/', limparTransacoes);
router.delete('/:id', removerTransacao);

module.exports = router;
