// ============================================================
// seed.js
// ------------------------------------------------------------
// Script opcional para popular o banco de dados com dados de
// exemplo (os mesmos que existiam fixos no HTML original), útil
// para testar o dashboard rapidamente após configurar o MongoDB.
//
// Como usar:
//   npm run seed
//
// ATENÇÃO: este script APAGA as transações existentes antes de
// inserir os dados de exemplo. Não rode em produção com dados reais.
// ============================================================

require('dotenv').config();
const mongoose = require('mongoose');
const conectarBancoDeDados = require('./config/db');
const Transacao = require('./models/Transacao');
const SaldoManual = require('./models/SaldoManual');
const Config = require('./models/Config');

const anoAtual = new Date().getFullYear();

const transacoesExemplo = [
  { mes: 1, ano: anoAtual, tipo: 'entrada', categoria: 'Salário/Renda', valor: 2500 },
  { mes: 1, ano: anoAtual, tipo: 'saida', categoria: 'Moradia', valor: 900 },
  { mes: 1, ano: anoAtual, tipo: 'saida', categoria: 'Alimentação', valor: 400 },
  { mes: 2, ano: anoAtual, tipo: 'entrada', categoria: 'Salário/Renda', valor: 2700 },
  { mes: 2, ano: anoAtual, tipo: 'saida', categoria: 'Transporte', valor: 350 },
  { mes: 2, ano: anoAtual, tipo: 'saida', categoria: 'Lazer', valor: 300 },
];

async function popularBanco() {
  await conectarBancoDeDados();

  console.log('🧹 Limpando coleções existentes...');
  await Transacao.deleteMany({});
  await SaldoManual.deleteMany({});

  console.log('🌱 Inserindo transações de exemplo...');
  await Transacao.insertMany(transacoesExemplo);

  console.log('🌱 Inserindo um saldo manual inicial de exemplo...');
  await SaldoManual.create({
    descricao: 'Saldo inicial em conta (exemplo)',
    valor: 1000,
  });

  console.log('⚙️  Garantindo configuração padrão...');
  await Config.obterOuCriar();

  console.log('✅ Banco de dados populado com sucesso!');
  await mongoose.connection.close();
}

popularBanco().catch((erro) => {
  console.error('❌ Erro ao popular o banco:', erro);
  process.exit(1);
});
