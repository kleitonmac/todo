# 🚀 Guia de Configuração Completo - TodoList com MongoDB e WhatsApp

## 📋 Pré-requisitos

- Node.js 16+ instalado
- MongoDB instalado localmente OU conta no MongoDB Atlas
- Navegador moderno

## 🔧 Instalação do Backend

### 1. Navegue até a pasta do servidor
```bash
cd server
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env com suas configurações
```

**Configuração do .env:**
```env
# MongoDB - Escolha uma opção:

# Opção 1: MongoDB Local
MONGODB_URI=mongodb://localhost:27017/todolist

# Opção 2: MongoDB Atlas (Recomendado para produção)
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/todolist

# Porta do servidor
PORT=3001

# WhatsApp (opcional)
WHATSAPP_ENABLED=false

# URL do Frontend (para CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Inicie o MongoDB (se usando local)
```bash
# Windows
net start MongoDB

# macOS/Linux
mongod
```

### 5. Inicie o servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

Você deve ver:
```
✅ MongoDB Conectado: localhost:27017
🚀 Servidor rodando na porta 3001
📡 API disponível em http://localhost:3001/api
```

## 🎨 Instalação do Frontend

### 1. Navegue até a pasta do frontend
```bash
cd list
```

### 2. Instale as dependências (se ainda não fez)
```bash
npm install
```

### 3. Configure a URL da API (opcional)
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite se necessário (padrão: http://localhost:3001/api)
```

### 4. Inicie o frontend
```bash
npm run dev
```

## 📱 Configuração do WhatsApp

### Opção 1: Integração Completa (WhatsApp Web.js)

1. Configure no `.env` do servidor:
```env
WHATSAPP_ENABLED=true
```

2. Reinicie o servidor
3. Na primeira execução, aparecerá um QR Code no terminal
4. Escaneie com seu WhatsApp (Menu > Dispositivos conectados > Conectar um dispositivo)
5. Nas próximas vezes, a conexão será automática

**Nota**: Esta opção requer que o servidor esteja sempre rodando.

### Opção 2: Link Direto (Recomendado)

A aplicação funciona com links diretos do WhatsApp Web mesmo sem a integração completa. Basta configurar o número no frontend.

## 🔄 Como Funciona a Sincronização

1. **Carregamento Inicial:**
   - Frontend carrega tarefas do localStorage (rápido)
   - Tenta sincronizar com API em background
   - Se API disponível, usa dados do banco
   - Se API indisponível, continua usando localStorage

2. **Criação/Edição:**
   - Atualiza localmente primeiro (otimista)
   - Sincroniza com API em background
   - Se API falhar, mantém no localStorage

3. **Completar Tarefa:**
   - Marca como completa localmente
   - Envia para API
   - Se WhatsApp configurado, envia mensagem automaticamente

## 🗄️ MongoDB Atlas (Cloud - Recomendado)

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster (Free tier disponível)
4. Configure acesso:
   - Database Access: Crie um usuário
   - Network Access: Adicione IP 0.0.0.0/0 (ou seu IP específico)
5. Clique em "Connect" > "Connect your application"
6. Copie a connection string
7. Cole no `.env` do servidor:
```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/todolist
```

## 🧪 Testando a API

### Verificar se está funcionando:
```bash
curl http://localhost:3001/api/health
```

### Criar uma tarefa:
```bash
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"Teste","category":"Trabalho"}'
```

### Listar todas as tarefas:
```bash
curl http://localhost:3001/api/todos
```

## 🐛 Solução de Problemas

### MongoDB não conecta
- Verifique se o MongoDB está rodando
- Confira a connection string no `.env`
- Teste a conexão: `mongosh` ou `mongo`

### API não responde
- Verifique se a porta 3001 está livre
- Confira os logs do servidor
- Teste: `curl http://localhost:3001/api/health`

### Frontend não conecta à API
- Verifique se o servidor está rodando
- Confira a URL no `.env` do frontend
- Verifique CORS no servidor

### WhatsApp não funciona
- Se usando WhatsApp Web.js, escaneie o QR Code
- Verifique se `WHATSAPP_ENABLED=true` no `.env`
- A aplicação funciona com links diretos mesmo sem integração completa

## 📦 Estrutura do Projeto

```
projetos/todolist/
├── list/              # Frontend React
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js # Cliente da API
│   │   └── ...
│   └── package.json
│
└── server/            # Backend Node.js
    ├── models/        # Modelos MongoDB
    ├── routes/        # Rotas da API
    ├── services/      # Serviços (WhatsApp)
    ├── config/        # Configurações
    └── server.js      # Servidor principal
```

## 🚀 Deploy em Produção

### Backend:
- Use serviços como Heroku, Railway, ou Render
- Configure variáveis de ambiente
- Use MongoDB Atlas (cloud)

### Frontend:
- Build: `npm run build`
- Deploy em Vercel, Netlify, ou similar
- Configure `VITE_API_URL` com URL do backend

## 📝 Próximos Passos

1. Configure seu número do WhatsApp no frontend
2. Teste criando algumas tarefas
3. Marque uma tarefa como completa e veja o WhatsApp funcionar
4. Verifique os dados no MongoDB

## 💡 Dicas

- Use MongoDB Atlas para ter backup automático
- Configure CORS adequadamente para produção
- Use variáveis de ambiente para dados sensíveis
- Monitore os logs do servidor para debug

