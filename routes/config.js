// ============================================================
// routes/config.js
// ------------------------------------------------------------
// Define os endpoints HTTP para as configurações gerais
// (limite mensal de gastos e meta financeira alvo).
// ============================================================

const express = require('express');
const router = express.Router();
const { obterConfig, atualizarConfig } = require('../controllers/configController');

// GET /api/config -> retorna a configuração atual
// PUT /api/config -> atualiza limite e/ou meta

router.get('/', obterConfig);
router.put('/', atualizarConfig);

module.exports = router;
