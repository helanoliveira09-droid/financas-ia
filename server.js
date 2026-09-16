const express = require('express');
// 1. Importa a função do banco de dados (que estava faltando)
const conectarBancoDeDados = require('./config/db'); 

// 2. Cria a instância do Express
const app = express();

// 3. Importa e registra as rotas da IA
const rotasIA = require('./routes/ia');
app.use('/api', rotasIA);

// ... o restante do seu código (outras rotas, banco de dados e a função iniciar) 

// Configuração da porta única
const PORTA = process.env.PORT || 3000;

async function iniciar() {
    await conectarBancoDeDados();
    
    app.listen(PORTA, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    });
}

iniciar();