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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: String(pergunta), // Garante que é uma string de texto pura
            config: {
                tools: [{ googleSearch: {} }] // Mantém a busca em tempo real ativa
            }
        });

        // Retorna o texto na propriedade 'resposta' para o app.js ler
        return res.json({ resposta: response.text });

    } catch (error) {
        console.error("Erro interno no servidor IA:", error);
        return res.status(500).json({ 
            error: "Erro ao processar a requisição da IA.", 
            details: error.message 
        });
    }
});

// NÃO ESQUEÇA DESTA LINHA NO FINAL DO ARQUIVO:
module.exports = router;