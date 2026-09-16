const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

router.post('/consultar', async (req, res) => {
    try {
        const { pergunta } = req.body;

        if (!pergunta) {
            return res.status(400).json({ error: "A pergunta não foi fornecida." });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Chave de API do Gemini não configurada no servidor." });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

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