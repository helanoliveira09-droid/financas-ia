// ============================================================
// public/js/app.js
// ------------------------------------------------------------
// Lógica do front-end do Dashboard Financeiro Inteligente.
//
// Diferente da versão original (que guardava tudo em um array
// dentro do próprio HTML), aqui os dados são persistidos no
// backend (Node/Express + MongoDB) e carregados via API REST
// usando fetch(). Isso garante que os dados NÃO se percam ao
// atualizar a página.
// ============================================================

// ------------------------------------------------------------
// ESTADO EM MEMÓRIA (cache local dos dados vindos da API)
// ------------------------------------------------------------
let transacoes = [];       // cache local das transações (entradas/saídas)
let saldoManualLista = [];  // cache local dos ajustes de saldo manual
let configAtual = { limiteGasto: 1500, metaAlvo: 5000 };

let graficoLinhasInstancia = null;
let graficoCategoriasInstancia = null;

// Base da API. Como o front-end é servido pelo próprio Express
// (pasta "public"), usamos caminho relativo — funciona tanto em
// localhost quanto já publicado no Render, sem precisar trocar nada.
const API_BASE = '/api';

// ============================================================
// NAVEGAÇÃO ENTRE ABAS
// ============================================================
function mudarAba(idAba) {
    ['geral', 'dados', 'saldo', 'investimentos', 'ia'].forEach(aba => {
        document.getElementById(`aba-${aba}`).classList.add('hidden');
        document.getElementById(`btn-${aba}`).className = "w-full text-left py-3 px-4 rounded-lg bg-gray-700 text-gray-300 font-medium hover:bg-gray-600 transition-all";
    });
    document.getElementById(`aba-${idAba}`).classList.remove('hidden');
    document.getElementById(`btn-${idAba}`).className = "w-full text-left py-3 px-4 rounded-lg bg-emerald-600 text-white font-medium transition-all";
}

// ============================================================
// FUNÇÕES DE ACESSO À API (fetch)
// ============================================================

/**
 * Função utilitária para chamar a API e já tratar erros de rede
 * ou de resposta HTTP (4xx/5xx) de forma padronizada.
 */
async function chamarApi(caminho, opcoes = {}) {
    const resposta = await fetch(`${API_BASE}${caminho}`, {
        headers: { 'Content-Type': 'application/json' },
        ...opcoes,
    });

    const corpo = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        const mensagem = corpo.erro || `Erro ${resposta.status} ao chamar ${caminho}`;
        throw new Error(mensagem);
    }

    return corpo;
}

async function buscarTransacoes() {
    transacoes = await chamarApi('/transacoes');
}

async function buscarSaldoManual() {
    saldoManualLista = await chamarApi('/saldo-manual');
}

async function buscarConfig() {
    configAtual = await chamarApi('/config');
    document.getElementById('input-limite').value = configAtual.limiteGasto;
}

/** Verifica se a API está respondendo e mostra na barra lateral. */
async function verificarStatusApi() {
    const elemento = document.getElementById('status-api');
    try {
        await chamarApi('/health');
        elemento.textContent = 'API conectada ✅';
    } catch (erro) {
        elemento.textContent = 'API offline ⚠️';
    }
}

// ============================================================
// AÇÕES DO USUÁRIO (CRUD via API)
// ============================================================

/** Cria uma nova transação (entrada ou saída) via API. */
async function adicionarTransacao(event) {
    event.preventDefault();

    const corpo = {
        mes: parseInt(document.getElementById('form-mes').value, 10),
        tipo: document.getElementById('form-tipo').value,
        categoria: document.getElementById('form-categoria').value,
        valor: parseFloat(document.getElementById('form-valor').value),
    };

    try {
        await chamarApi('/transacoes', { method: 'POST', body: JSON.stringify(corpo) });
        document.getElementById('form-transacao').reset();
        await recarregarTudo();
    } catch (erro) {
        alert(`Não foi possível salvar a transação: ${erro.message}`);
    }
}

/** Consulta a IA via API para analisar finanças e dar sugestões. */
document.getElementById('btn-perguntar-ia').addEventListener('click', async () => {
    const pergunta = document.getElementById('ia-pergunta').value;
    const btn = document.getElementById('btn-perguntar-ia');
    const containerResposta = document.getElementById('ia-resposta-container');
    const textoResposta = document.getElementById('ia-resposta-texto');

    if (!pergunta.trim()) {
        alert('Por favor, digite uma pergunta ou informe o que comprou.');
        return;
    }

    try {
        btn.disabled = true;
        btn.innerText = 'Pensando...';
        containerResposta.classList.add('hidden');

        // Faz a requisição para a rota criada no seu back-end Node.js
         const data = await chamarApi('/consultar', {
            method: 'POST',
            body: JSON.stringify({ pergunta: pergunta })
        });

        // Exibe a resposta formatada na tela
        textoResposta.innerText = data.resposta;
        containerResposta.classList.remove('hidden');
        
        // Exibe a resposta formatada na tela
        textoResposta.innerText = data.resposta;
        containerResposta.classList.remove('hidden');

    } catch (error) {
        console.error('Erro ao consultar IA:', error);
        alert('Ocorreu um erro ao falar com a IA.');
    } finally {
        btn.disabled = false;
        btn.innerText = 'Analisar Finanças com IA';
    }
});

/** Remove uma transação específica pelo ID. */
async function removerTransacao(id) {
    if (!confirm('Remover esta transação?')) return;
    try {
        await chamarApi(`/transacoes/${id}`, { method: 'DELETE' });
        await recarregarTudo();
    } catch (erro) {
        alert(`Não foi possível remover a transação: ${erro.message}`);
    }
}

/** Limpa todo o histórico de transações no banco de dados. */
async function limparHistorico() {
    if (!confirm('Isso vai apagar TODAS as transações salvas no banco. Continuar?')) return;
    try {
        await chamarApi('/transacoes', { method: 'DELETE' });
        await recarregarTudo();
    } catch (erro) {
        alert(`Não foi possível limpar o histórico: ${erro.message}`);
    }
}

/** Cria um novo ajuste de SALDO MANUAL via API. */
async function adicionarSaldoManual(event) {
    event.preventDefault();

    const corpo = {
        descricao: document.getElementById('saldo-descricao').value,
        valor: parseFloat(document.getElementById('saldo-valor').value),
    };

    try {
        await chamarApi('/saldo-manual', { method: 'POST', body: JSON.stringify(corpo) });
        document.getElementById('form-saldo-manual').reset();
        await recarregarTudo();
    } catch (erro) {
        alert(`Não foi possível salvar o ajuste de saldo: ${erro.message}`);
    }
}

/** Remove um ajuste de saldo manual pelo ID. */
async function removerSaldoManual(id) {
    if (!confirm('Remover este ajuste de saldo manual?')) return;
    try {
        await chamarApi(`/saldo-manual/${id}`, { method: 'DELETE' });
        await recarregarTudo();
    } catch (erro) {
        alert(`Não foi possível remover o ajuste: ${erro.message}`);
    }
}

/** Atualiza o limite mensal de gastos definido pelo usuário. */
async function definirAlertaGasto() {
    const novoLimite = parseFloat(document.getElementById('input-limite').value) || 0;
    try {
        configAtual = await chamarApi('/config', {
            method: 'PUT',
            body: JSON.stringify({ limiteGasto: novoLimite }),
        });
        atualizarDashboard();
    } catch (erro) {
        alert(`Não foi possível salvar o limite: ${erro.message}`);
    }
}

// ============================================================
// FORMATAÇÃO
// ============================================================
function formatarBRL(valor) {
    return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString('pt-BR');
}

// ============================================================
// RENDERIZAÇÃO DO DASHBOARD
// ============================================================

/** Soma todos os ajustes de saldo manual cadastrados. */
function totalSaldoManual() {
    return saldoManualLista.reduce((acc, ajuste) => acc + ajuste.valor, 0);
}

function atualizarDashboard() {
    const mesSelecionado = document.getElementById('filtro-mes').value;
    const dadosFiltrados = transacoes.filter(t => mesSelecionado === 'todos' || t.mes == mesSelecionado);

    let entradasFiltradas = dadosFiltrados.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
    let saidasFiltradas = dadosFiltrados.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);

    let totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
    let totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);

    // O saldo global agora também soma os ajustes manuais de saldo.
    const ajusteManual = totalSaldoManual();
    let saldoGlobal = totalEntradas - totalSaidas + ajusteManual;

    // A meta alvo vem da configuração salva no banco (editável futuramente).
    let metaAtual = configAtual.metaAlvo || 5000;
    const maiorMes = Math.max(...transacoes.map(t => t.mes), 1);
    if (maiorMes > 6 || parseInt(mesSelecionado) > 6) metaAtual = metaAtual + 500;

    document.getElementById('kpi-entradas').innerText = formatarBRL(entradasFiltradas);
    document.getElementById('kpi-saidas').innerText = formatarBRL(saidasFiltradas);
    document.getElementById('kpi-saldo-manual').innerText = formatarBRL(ajusteManual);
    document.getElementById('kpi-saldo').innerText = formatarBRL(saldoGlobal);
    document.getElementById('kpi-meta').innerText = formatarBRL(metaAtual);

    const limiteDefinidoUsuario = configAtual.limiteGasto || 0;
    const banner = document.getElementById('banner-alerta');
    banner.classList.remove('hidden');
    if (saidasFiltradas > limiteDefinidoUsuario) {
        banner.className = "p-4 rounded-xl bg-rose-950/40 border border-rose-500 text-rose-300 text-sm";
        banner.innerText = `⚠️ Limite Excedido! Gastos: ${formatarBRL(saidasFiltradas)} / Permitido: ${formatarBRL(limiteDefinidoUsuario)}`;
    } else {
        banner.className = "p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-sm";
        banner.innerText = `✅ Gastos sob controle. Margem tolerada: ${formatarBRL(limiteDefinidoUsuario)}`;
    }

    renderizarTabelas();
    renderizarSaldoManual();
    renderizarGraficoLinha(metaAtual);
    renderizarGraficoPizza(dadosFiltrados);
}

function renderizarTabelas() {
    // ---- Histórico de transações ----
    const corpo = document.getElementById('tabela-corpo');
    corpo.innerHTML = '';
    transacoes
        .slice()
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="p-3">Mês ${t.mes}</td>
                <td class="p-3"><span class="${t.tipo === 'entrada' ? 'text-emerald-400' : 'text-rose-400'}">${t.tipo.toUpperCase()}</span></td>
                <td class="p-3 text-gray-400">${t.categoria}</td>
                <td class="p-3 text-right ${t.tipo === 'entrada' ? 'text-emerald-400' : 'text-rose-400'}">${formatarBRL(t.valor)}</td>
                <td class="p-3 text-right">
                    <button onclick="removerTransacao('${t._id}')" class="text-rose-400 hover:text-rose-300 text-xs font-semibold">Excluir</button>
                </td>
            `;
            corpo.appendChild(tr);
        });

    // ---- Simulador de investimentos (1% ao mês sobre o saldo acumulado) ----
    const tableInvest = document.getElementById('tabela-investimentos');
    tableInvest.innerHTML = '';
    let acumulado = totalSaldoManual(); // o saldo manual entra como base inicial do simulador
    let jurosTotal = 0;
    for (let m = 1; m <= 6; m++) {
        let e = transacoes.filter(t => t.mes === m && t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
        let s = transacoes.filter(t => t.mes === m && t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
        acumulado += (e - s);
        let juros = acumulado > 0 ? acumulado * 0.01 : 0;
        let fim = acumulado + juros;
        jurosTotal += juros;

        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="p-3">Mês ${m}</td><td class="p-3">${formatarBRL(acumulado)}</td><td class="p-3 text-emerald-400">+${formatarBRL(juros)}</td><td class="p-3 text-right font-bold">${formatarBRL(fim)}</td>`;
        tableInvest.appendChild(tr);
        acumulado = fim;
    }
    document.getElementById('total-juros').innerText = formatarBRL(jurosTotal);
}

/** Renderiza a tabela de ajustes de saldo manual cadastrados. */
function renderizarSaldoManual() {
    const corpo = document.getElementById('tabela-saldo-manual');
    corpo.innerHTML = '';
    saldoManualLista
        .slice()
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .forEach(ajuste => {
            const positivo = ajuste.valor >= 0;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="p-3 text-gray-400">${formatarData(ajuste.data)}</td>
                <td class="p-3">${ajuste.descricao}</td>
                <td class="p-3 text-right ${positivo ? 'text-emerald-400' : 'text-rose-400'}">${formatarBRL(ajuste.valor)}</td>
                <td class="p-3 text-right">
                    <button onclick="removerSaldoManual('${ajuste._id}')" class="text-rose-400 hover:text-rose-300 text-xs font-semibold">Excluir</button>
                </td>
            `;
            corpo.appendChild(tr);
        });
}

function renderizarGraficoLinha(metaFim) {
    const ctx = document.getElementById('graficoLinhaBase').getContext('2d');
    if (graficoLinhasInstancia) graficoLinhasInstancia.destroy();

    const passos = Array.from({ length: 6 }, (_, i) => ((metaFim / 6) * (i + 1)));
    const progresso = [];
    let total = totalSaldoManual();
    for (let m = 1; m <= 6; m++) {
        let e = transacoes.filter(t => t.mes === m && t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
        let s = transacoes.filter(t => t.mes === m && t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
        total += (e - s);
        progresso.push(total);
    }

    graficoLinhasInstancia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
            datasets: [
                { label: 'Ideal', data: passos, borderColor: '#4b5563', fill: false },
                { label: 'Real', data: progresso, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderizarGraficoPizza(dadosFiltrados) {
    const ctx = document.getElementById('graficoCategorias').getContext('2d');
    if (graficoCategoriasInstancia) graficoCategoriasInstancia.destroy();

    const gastos = dadosFiltrados.filter(t => t.tipo === 'saida');
    const agrupado = {};
    gastos.forEach(g => { agrupado[g.categoria] = (agrupado[g.categoria] || 0) + g.valor; });

    graficoCategoriasInstancia = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(agrupado).length ? Object.keys(agrupado) : ['Sem Gastos'],
            datasets: [{ data: Object.values(agrupado).length ? Object.values(agrupado) : [0], backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// ============================================================
// INTELIGÊNCIA ARTIFICIAL (brain.js) — sugestão simples de
// quanto gastar e quanto guardar, com base no histórico.
// ============================================================
function executarMachineLearning() {
    try {
        const net = new brain.NeuralNetwork();
        const dados = [];
        for (let m = 1; m <= 6; m++) {
            let ent = transacoes.filter(t => t.mes === m && t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
            let sai = transacoes.filter(t => t.mes === m && t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
            if (ent > 0) dados.push({ input: { ent: ent / 10000, sai: sai / 10000 }, output: { g: (ent * 0.3) / 10000, p: (ent * 0.7) / 10000 } });
        }
        if (dados.length > 0) {
            net.train(dados, { iterations: 200 });
            const res = net.run({ ent: 0.3, sai: 0.1 });
            document.getElementById('ia-sugestao-gasto').innerText = formatarBRL(res.g * 10000);
            document.getElementById('ia-sugestao-guardar').innerText = formatarBRL(res.p * 10000);
            document.getElementById('ia-status').innerText = '● Treinado e Ativo';
        } else {
            document.getElementById('ia-status').innerText = '● Aguardando dados suficientes';
        }
    } catch (erro) {
        console.error('Erro ao treinar o modelo de IA:', erro);
        document.getElementById('ia-status').innerText = '● Erro ao treinar modelo';
    }
}

// ============================================================
// CARREGAMENTO INICIAL
// ============================================================

/** Busca tudo de novo na API e re-renderiza o dashboard inteiro. */
async function recarregarTudo() {
    await Promise.all([buscarTransacoes(), buscarSaldoManual(), buscarConfig()]);
    atualizarDashboard();
    executarMachineLearning();
}

window.onload = async function () {
    await verificarStatusApi();
    try {
        await recarregarTudo();
    } catch (erro) {
        console.error('Erro ao carregar dados iniciais:', erro);
        alert('Não foi possível carregar os dados do servidor. Verifique se a API e o MongoDB estão configurados corretamente (veja o README).');
    }
};
