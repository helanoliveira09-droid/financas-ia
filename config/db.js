// ============================================================
// config/db.js
// ------------------------------------------------------------
// Responsável por abrir a conexão com o MongoDB usando Mongoose.
// A string de conexão vem da variável de ambiente MONGODB_URI
// (definida no arquivo .env localmente, ou nas variáveis de
// ambiente do Render em produção).
// ============================================================

const mongoose = require('mongoose');

/**
 * Conecta a aplicação ao banco de dados MongoDB.
 * Se a conexão falhar, o processo é encerrado (é inútil manter
 * a API no ar sem banco de dados).
 */
async function conectarBancoDeDados() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ Variável de ambiente MONGODB_URI não foi definida. Configure o arquivo .env (veja .env.example).');
    process.exit(1);
  }

  try {
    // Mongoose 8+ já usa os parsers/topology novos por padrão,
    // então não é necessário passar useNewUrlParser/useUnifiedTopology.
    await mongoose.connect(uri);
    console.log('✅ Conectado ao MongoDB com sucesso.');
  } catch (erro) {
    console.error('❌ Erro ao conectar ao MongoDB:', erro.message);
    process.exit(1);
  }
}

module.exports = conectarBancoDeDados;
