// ============================================================
// controllers/transacoesController.js
// ------------------------------------------------------------
// Contém a lógica de negócio (CRUD) para as transações
// financeiras (entradas e saídas). As rotas em
// routes/transacoes.js apenas chamam estas funções.
// ============================================================

const Transacao = require('../models/Transacao');

/**
 * GET /api/transacoes
 * Lista todas as transações, das mais recentes para as mais antigas.
 * Aceita filtros opcionais via query string: ?mes=3&ano=2026&tipo=saida
 */
async function listarTransacoes(req, res) {
  try {
    const filtro = {};
    if (req.query.mes) filtro.mes = Number(req.query.mes);
    if (req.query.ano) filtro.ano = Number(req.query.ano);
    if (req.query.tipo) filtro.tipo = req.query.tipo;

    const transacoes = await Transacao.find(filtro).sort({ data: -1, createdAt: -1 });
    res.json(transacoes);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar transações.', detalhe: erro.message });
  }
}

/**
 * POST /api/transacoes
 * Cria uma nova transação (entrada ou saída).
 * Corpo esperado: { mes, ano, tipo, categoria, valor, descricao }
 */
async function criarTransacao(req, res) {
  try {
    const { mes, ano, tipo, categoria, valor, descricao } = req.body;

    const novaTransacao = await Transacao.create({
      mes,
      ano: ano || new Date().getFullYear(),
      tipo,
      categoria,
      valor,
      descricao,
    });

    res.status(201).json(novaTransacao);
  } catch (erro) {
    // Erros de validação do Mongoose (campo obrigatório, min, enum...)
    // retornam 400 (requisição inválida) em vez de 500.
    if (erro.name === 'ValidationError') {
      return res.status(400).json({ erro: 'Dados inválidos.', detalhe: erro.message });
    }
    res.status(500).json({ erro: 'Erro ao criar transação.', detalhe: erro.message });
  }
}

/**
 * DELETE /api/transacoes/:id
 * Remove uma única transação pelo seu ID.
 */
async function removerTransacao(req, res) {
  try {
    const removida = await Transacao.findByIdAndDelete(req.params.id);
    if (!removida) {
      return res.status(404).json({ erro: 'Transação não encontrada.' });
    }
    res.json({ mensagem: 'Transação removida com sucesso.', transacao: removida });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao remover transação.', detalhe: erro.message });
  }
}

/**
 * DELETE /api/transacoes
 * Limpa TODO o histórico de transações (equivalente ao antigo
 * botão "Limpar Histórico" do front-end, que só apagava em memória).
 */
async function limparTransacoes(req, res) {
  try {
    const resultado = await Transacao.deleteMany({});
    res.json({ mensagem: 'Histórico de transações limpo.', quantidadeRemovida: resultado.deletedCount });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao limpar histórico.', detalhe: erro.message });
  }
}

module.exports = {
  listarTransacoes,
  criarTransacao,
  removerTransacao,
  limparTransacoes,
};
