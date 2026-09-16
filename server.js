const express = require('express');
// ... mantenha as outras importações padrão que já existem aqui (como cors, path, etc.) ...

// 1. PRIMEIRO: Cria a instância do app (Geralmente está na linha 3 ou 4)
const app = express();

// 2. SEGUNDO: Importa e registra as rotas da IA (Abaixo da criação do app)
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