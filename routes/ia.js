// routes/ia.js
const express = require('express');
const router = express.Router();

// Aqui você cria a rota POST que estava faltando
router.post('/consultar', async (req, res) => {
    try {
        const { mensagem } = req.body; // ou o termo usado no seu app.js
        
        // TODO: Insira aqui a lógica de integração com a sua API de IA (OpenAI, Gemini, etc.)
        const respostaDaIA = "Aqui vai a resposta gerada pela inteligência artificial.";

        res.json({ resposta: respostaDaIA });
    } catch (error) {
        console.error("Erro na rota de IA:", error);
        res.status(500).json({ error: "Erro interno no servidor ao consultar a IA." });
    }
});

module.exports = router;