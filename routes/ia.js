const express = require('express');
const router = express.Router();
// Importa a biblioteca clássica e estável do Google
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/consultar', async (req, res) => {
    try {
        const { pergunta } = req.body;

        if (!pergunta) {
            return res.status(400).json({ error: "A pergunta não foi fornecida." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Chave de API do Gemini não configurada no Render." });
        }

        // Inicializa usando o método clássico
       const genAI = new GoogleGenerativeAI(apiKey);
        
        // ALTERADO: Adicionado "-latest" para compatibilidade com a rota v1beta
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // Executa a geração de conteúdo de forma simples
        const result = await model.generateContent(String(pergunta));
        const responseText = result.response.text();

        // Retorna a resposta estruturada para o seu app.js frontend
        return res.json({ resposta: responseText });

    } catch (error) {
        console.error("Erro interno no servidor IA (Método Alternativo):", error);
        return res.status(500).json({ 
            error: "Erro ao processar a requisição da IA alternativa.", 
            details: error.message 
        });
    }
});

module.exports = router;