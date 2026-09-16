const express = require('express');
const router = express.Router();
// Importa o cliente oficial do novo SDK do Google Gen AI
const { GoogleGenAI } = require('@google/genai');

// Inicializa a IA puxando a chave secreta guardada no ambiente do Render
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Rota POST que o seu front-end (app.js) chama via chamarApi('/consultar')
router.post('/consultar', async (req, res) => {
    try {
        // Captura a variável 'pergunta' enviada no corpo da requisição JSON
        const { pergunta } = req.body; 

        // Validação simples para garantir que o usuário digitou algo
        if (!pergunta) {
            return res.status(400).json({ error: "A pergunta não foi fornecida." });
        }

        // Faz a chamada ao modelo mais rápido e atualizado do Gemini (2.5 Flash)
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: pergunta,
            config: {
                // Ativa a ferramenta nativa de busca (Google Search Grounding)
                // Isso permite que a IA consulte a internet de forma autônoma
                tools: [{ googleSearch: {} }]
            }
        });

        // Retorna a resposta gerada em texto no formato JSON esperado pelo front-end
        res.json({ resposta: response.text });

    } catch (error) {
        // Exibe o erro detalhado nos logs do Render para debug se algo falhar
        console.error("Erro na comunicação com o Gemini Conectado:", error);
        res.status(500).json({ error: "Erro interno ao consultar a IA." });
    }
});

// Exporta o router para que o seu server.js consiga ler as rotas corretamente
module.exports = router;