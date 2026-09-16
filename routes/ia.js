const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// Criamos uma função para inicializar o Gemini apenas quando houver requisição
function obterInstanciaGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Chave de API do Gemini não configurada.");
    }
    return new GoogleGenAI({ apiKey: apiKey });
}

router.post('/consultar', async (req, res) => {
    try {
        const { pergunta } = req.body;

        if (!pergunta) {
            return res.status(400).json({ error: "A pergunta não foi fornecida." });
        }

        // Tenta obter a instância da IA de forma protegida
        let ai;
        try {
            ai = obterInstanciaGemini();
        } catch (erroChave) {
            console.error("⚠️ Configuração pendente:", erroChave.message);
            return res.status(500).json({ error: "Serviço temporariamente indisponível: Chave de API ausente." });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: pergunta,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        res.json({ resposta: response.text });

    } catch (error) {
        console.error("Erro na comunicação com o Gemini Conectado:", error);
        res.status(500).json({ error: "Erro interno ao consultar a IA." });
    }
});

module.exports = router;