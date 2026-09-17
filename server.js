const express = require('express');
// 1. Importa a função do banco de dados
const conectarBancoDeDados = require('./config/db'); 

// 2. Cria a instância do Express
const app = express();

// ==========================================
// CONFIGURAÇÕES DO EXPRESS (ADICIONE ESTAS 3 LINHAS AQUI):
// ==========================================
app.use(express.json()); // Permite que o servidor entenda o JSON enviado pelo chat
app.use(express.urlencoded({ extended: true })); // Permite ler dados de formulários
app.use(express.static('public')); // Entrega a pasta public (HTML, CSS, JS) para o navegador

// 3. Importa e registra as rotas da IA
const rotasIA = require('./routes/ia');
app.use('/api', rotasIA);

// Configuração da porta única
const PORTA = process.env.PORT || 3000;

async function iniciar() {
    await conectarBancoDeDados();
    
    app.listen(PORTA, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    });
}

iniciar();