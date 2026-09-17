// ============================================================
// routes/saldo.js
// ------------------------------------------------------------
// Define os endpoints HTTP para os ajustes de SALDO MANUAL.
// ============================================================

const express = require('express');
const router = express.Router();
const {
  listarSaldoManual,
  criarSaldoManual,
  removerSaldoManual,
} = require('../controllers/saldoController');

// GET    /api/saldo-manual      -> lista todos os ajustes manuais
// POST   /api/saldo-manual      -> cria um novo ajuste manual de saldo
// DELETE /api/saldo-manual/:id  -> remove um ajuste manual específico

router.get('/saldo-manual', listarSaldoManual);
router.post('/saldo-manual', criarSaldoManual);
router.delete('/saldo-manual/:id', removerSaldoManual);

module.exports = router;
