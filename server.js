const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// Inicializa a IA usando sua chave de ambiente privada
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/consultar', async (req, res) => {
    try {
        const { pergunta } = req.body; 

        if (!pergunta) {
            return res.status(400).json({ error: "A pergunta não foi fornecida." });
        }

        // Configura o modelo para pesquisar dados dinâmicos da internet
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: pergunta,
            config: {
                // Ativa a ferramenta nativa de busca do Google (Search Grounding)
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