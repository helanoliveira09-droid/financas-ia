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
            return res.status(500).json({ error: "Chave de API do Gemini não configurada no Render." });
        }

        // Inicializa o SDK com a chave correta
        const ai = new GoogleGenAI({ apiKey: apiKey });

        // Chamada oficial corrigida para o pacote @google/genai
      // Chamada oficial corrigida com o modelo atualizado e disponível
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // O pacote mais recente gerencia este identificador nativamente
            contents: String(pergunta), 
            config: {
                tools: [{ googleSearch: {} }] 
            }
        });

        // Retorna o texto na propriedade 'resposta' para o app.js ler
        return res.json({ resposta: response.text });

    } catch (error) {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: String(pergunta)
        });
    }
});

// NÃO ESQUEÇA DESTA LINHA NO FINAL DO ARQUIVO:
module.exports = router;