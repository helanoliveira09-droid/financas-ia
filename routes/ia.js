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

        const ai = new GoogleGenAI({ apiKey: apiKey });

        // Chamada oficial estruturada para o Gemini 2.5 Flash
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: pergunta,
            config: {
                // Ativa a busca em tempo real no Google
                tools: [{ googleSearch: {} }]
            }
        });

        // O SDK atualizado retorna o texto diretamente em response.text
        if (response && response.text) {
            return res.json({ resposta: response.text });
        } 
        
        // Tratamento de segurança caso a resposta venha em outro formato do modelo
        const textoAlternativo = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textoAlternativo) {
            return res.json({ resposta: textoAlternativo });
        }

        throw new Error("O modelo não retornou um formato de texto válido.");

    } catch (error) {
        console.error("Erro detalhado na rota da IA:", error);
        res.status(500).json({ error: "Erro interno ao processar a resposta da IA." });
    }
});

module.exports = router;