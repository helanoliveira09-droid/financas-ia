# 💰 FinançasIA — Dashboard Financeiro Inteligente

Dashboard financeiro completo com registro de entradas/saídas, **entrada de saldo manual**, simulador de investimentos, gráficos e uma sugestão simples de IA (brain.js) sobre quanto gastar/guardar. Agora com backend em **Node.js + Express** e persistência em **MongoDB**, pronto para rodar localmente, subir no **GitHub** e publicar no **Render**.

---

## 📂 Estrutura do projeto

```
financas-ia/
├── config/
│   └── db.js                  # conexão com o MongoDB
├── controllers/
│   ├── transacoesController.js
│   ├── saldoController.js     # lógica do saldo manual
│   └── configController.js
├── models/
│   ├── Transacao.js
│   ├── SaldoManual.js         # model do saldo manual
│   └── Config.js
├── routes/
│   ├── transacoes.js
│   ├── saldo.js
│   └── config.js
├── public/                    # front-end (servido pelo Express)
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── server.js                  # ponto de entrada da aplicação
├── seed.js                    # popula o banco com dados de exemplo
├── package.json
├── render.yaml                # blueprint de deploy no Render
├── .env.example
└── .gitignore
```

Todo o código está comentado em português explicando o que cada trecho faz.

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuito) **ou** MongoDB instalado localmente
- Conta no [GitHub](https://github.com/) e no [Render](https://render.com/) (ambos gratuitos)

---

## 🚀 Rodando localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` e preencha `MONGODB_URI` com a string de conexão do seu banco (veja seção MongoDB abaixo).

3. *(Opcional)* **Popule o banco com dados de exemplo:**
   ```bash
   npm run seed
   ```

4. **Inicie o servidor:**
   ```bash
   npm start
   ```
   Ou, em modo desenvolvimento (reinicia sozinho a cada alteração):
   ```bash
   npm run dev
   ```

5. Acesse **http://localhost:3000** no navegador.

---

## 🍃 Configurando o MongoDB (Atlas)

1. Crie uma conta gratuita em https://www.mongodb.com/atlas.
2. Crie um **Cluster gratuito** (M0).
3. Em **Database Access**, crie um usuário com senha.
4. Em **Network Access**, libere o acesso (para testes, `0.0.0.0/0` — depois restrinja se quiser mais segurança).
5. Em **Database > Connect > Drivers**, copie a *connection string*, algo como:
   ```
   mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Cole essa string na variável `MONGODB_URI` do seu `.env` (adicione `/financas-ia` antes do `?` para nomear o banco).

---

## 🐙 Publicando no GitHub

```bash
git init
git add .
git commit -m "Dashboard financeiro com saldo manual, API Node e MongoDB"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/financas-ia.git
git push -u origin main
```

> O arquivo `.gitignore` já garante que `node_modules/` e `.env` (com suas credenciais) **não** sejam enviados ao repositório.

---

## ☁️ Publicando no Render

### Opção A — usando o `render.yaml` (recomendado)

1. Suba o projeto para o GitHub (passo acima).
2. No Render, clique em **New +** → **Blueprint**.
3. Selecione o repositório. O Render vai ler o `render.yaml` automaticamente e propor a criação do serviço `financas-ia-dashboard`.
4. Antes de finalizar, defina a variável de ambiente **`MONGODB_URI`** com a sua string de conexão do MongoDB Atlas (ela não vem no `render.yaml` por segurança).
5. Clique em **Apply** / **Deploy**.

### Opção B — manualmente

1. No Render, clique em **New +** → **Web Service**.
2. Conecte seu repositório do GitHub.
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Em **Environment**, adicione:
   - `MONGODB_URI` → sua string de conexão do MongoDB Atlas
   - `NODE_ENV` → `production`
5. Clique em **Create Web Service**.

O Render define a porta automaticamente pela variável `PORT`, que o `server.js` já lê corretamente (`process.env.PORT`).

Após o deploy, sua aplicação (front-end + API) estará disponível em uma URL do tipo `https://financas-ia-dashboard.onrender.com`.

---

## 🧾 Sobre a "Entrada de Saldo Manual"

Essa é a principal funcionalidade adicionada ao projeto original. Ela permite lançar ajustes de saldo que **não** são transações normais de entrada/saída, mas correções diretas no saldo total — por exemplo, o saldo que você já tinha em conta antes de começar a usar o app.

- Acesse a aba **"✍️ Saldo Manual"** no menu lateral.
- Preencha uma descrição e um valor (positivo para somar, negativo para subtrair).
- O valor entra automaticamente no cálculo do **Saldo Acumulado**, no simulador de investimentos e no gráfico "Linha de Base para Meta".
- Todos os ajustes ficam salvos no MongoDB e podem ser excluídos a qualquer momento.

---

## 🔌 Endpoints da API

| Método | Rota                    | Descrição                                   |
|--------|--------------------------|----------------------------------------------|
| GET    | `/api/health`            | Verifica se a API está no ar                  |
| GET    | `/api/transacoes`        | Lista transações (aceita `?mes=&ano=&tipo=`)  |
| POST   | `/api/transacoes`        | Cria uma transação                            |
| DELETE | `/api/transacoes/:id`    | Remove uma transação                          |
| DELETE | `/api/transacoes`        | Limpa todo o histórico de transações          |
| GET    | `/api/saldo-manual`      | Lista os ajustes de saldo manual              |
| POST   | `/api/saldo-manual`      | Cria um ajuste de saldo manual                |
| DELETE | `/api/saldo-manual/:id`  | Remove um ajuste de saldo manual              |
| GET    | `/api/config`            | Retorna limite de gastos e meta alvo          |
| PUT    | `/api/config`            | Atualiza limite de gastos e/ou meta alvo      |

---

## 🛠️ Tecnologias usadas

- **Front-end:** HTML + Tailwind CSS (via CDN) + Chart.js + brain.js
- **Back-end:** Node.js + Express
- **Banco de dados:** MongoDB + Mongoose
- **Deploy:** Render (blueprint incluído em `render.yaml`)

---

## 📝 Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](./LICENSE).
