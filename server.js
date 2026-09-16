// ============================================================
// server.js
// ------------------------------------------------------------
// Ponto de entrada da aplicação. Responsável por:
//  1. Carregar variáveis de ambiente (.env)
//  2. Conectar ao MongoDB
//  3. Configurar o servidor Express (middlewares, rotas, estáticos)
//  4. Subir o servidor HTTP na porta definida
//
// Para rodar localmente:   npm install && npm start
// Para rodar em modo dev:  npm run dev   (reinicia sozinho a cada mudança)
// ============================================================

// Carrega as variáveis do arquivo .env para process.env.
// Em produção (Render), as variáveis já vêm configuradas no painel,
// então esta chamada simplesmente não encontra um .env e é ignorada.
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const conectarBancoDeDados = require('./config/db');

// Rotas da API, separadas por recurso.
const rotasTransacoes = require('./routes/transacoes');
const rotasSaldoManual = require('./routes/saldo');
const rotasConfig = require('./routes/config');

const app = express();

// ------------------------------------------------------------
// MIDDLEWARES
// ------------------------------------------------------------

// Permite que o front-end (mesmo se hospedado em outro domínio)
// consiga chamar esta API.
app.use(cors());

// Faz o Express entender corpos de requisição em JSON
// (necessário para os POST/PUT das rotas abaixo).
app.use(express.json());

// Serve os arquivos estáticos do front-end (HTML, CSS, JS do dashboard)
// que ficam dentro da pasta "public".
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------
// ROTAS DA API
// ------------------------------------------------------------
app.use('/api/transacoes', rotasTransacoes);
app.use('/api/saldo-manual', rotasSaldoManual);
app.use('/api/config', rotasConfig);

// Rota simples de "saúde" da aplicação — útil para o Render
// verificar se o serviço está no ar.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', horario: new Date().toISOString() });
});

// Qualquer outra rota não reconhecida pela API devolve o index.html,
// garantindo que o dashboard (Single Page) sempre carregue.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------------------------------------------
// TRATAMENTO DE ERROS NÃO CAPTURADOS
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

// ------------------------------------------------------------
// INICIALIZAÇÃO: conecta ao banco e só então sobe o servidor
// ------------------------------------------------------------
const PORTA = process.env.PORT || 3000;

async function iniciar() {
  await conectarBancoDeDados();

  app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
  });
// 1. Importa a rota da IA
const rotasIA = require('./routes/ia');

// 2. Registra a rota da IA no Express
app.use('/', rotasIA);

async function iniciar() {
    await conectarBancoDeDados();
    
    app.listen(PORTA, () => {
        console.log(`Servidor rodando em http://localhost:${PORTA}`);
    });
}
}

iniciar();
