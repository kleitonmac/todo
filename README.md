# 📋 TodoList - Aplicação Completa de Gerenciamento de Tarefas

Uma aplicação moderna e completa de gerenciamento de tarefas com React, Node.js, MongoDB e integração WhatsApp.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)

## ✨ Funcionalidades

### 🎯 Principais Recursos

- ✅ **Gerenciamento Completo de Tarefas**
  - Criar, editar, deletar e completar tarefas
  - Categorias: Trabalho, Pessoal, Estudos
  - Data de vencimento e lembretes

- 📅 **Calendário Visual**
  - Visualização mensal de tarefas
  - Criação rápida por data
  - Indicadores visuais

- 🔔 **Sistema de Lembretes**
  - Notificações do navegador
  - Lembretes diários até completar
  - Integração com WhatsApp

- 📱 **Integração WhatsApp**
  - Envio automático ao completar tarefas
  - Lembretes personalizados
  - Mensagens formatadas

- 💾 **Armazenamento Híbrido**
  - MongoDB para persistência
  - localStorage para cache local
  - Sincronização automática

- 🎨 **Interface Moderna**
  - Design responsivo
  - Ícones Tabler
  - Animações suaves
  - Tema profissional

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 16+ instalado
- MongoDB (local ou Atlas)
- Navegador moderno

### Instalação Completa

#### 1. Clone ou baixe o projeto

#### 2. Configure o Backend

```bash
cd server
npm install
cp env.example .env
```

Edite o arquivo `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/todolist
PORT=3001
WHATSAPP_ENABLED=false
FRONTEND_URL=http://localhost:5173
```

#### 3. Configure o Frontend

```bash
cd ../list
npm install
```

Opcional - criar `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

#### 4. Inicie o MongoDB

**Local:**
```bash
# Windows
net start MongoDB

# macOS/Linux
mongod
```

**Ou use MongoDB Atlas (Cloud):**
1. Crie conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie cluster gratuito
3. Copie connection string para `.env`

#### 5. Inicie os Servidores

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd list
npm run dev
```

#### 6. Acesse a Aplicação

Abra seu navegador em: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
todolist/
├── list/                    # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # API Client
│   │   └── App.jsx         # Componente principal
│   └── package.json
│
├── server/                  # Backend Node.js
│   ├── models/              # Modelos MongoDB
│   ├── routes/              # Rotas da API
│   ├── services/            # Serviços (WhatsApp)
│   ├── config/              # Configurações
│   └── server.js           # Servidor principal
│
└── README.md               # Este arquivo
```

## 🔧 Configuração Detalhada

### MongoDB

#### Opção 1: MongoDB Local

1. Instale MongoDB:
   - Windows: [Download](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. Inicie o serviço:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   mongod
   ```

3. Configure no `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todolist
   ```

#### Opção 2: MongoDB Atlas (Recomendado)

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie conta gratuita
3. Crie um cluster (Free tier)
4. Configure acesso:
   - Database Access: Crie usuário
   - Network Access: Adicione IP `0.0.0.0/0`
5. Clique em "Connect" > "Connect your application"
6. Copie a connection string
7. Configure no `.env`:
   ```env
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/todolist
   ```

### WhatsApp

#### Configuração Básica (Link Direto)

1. No frontend, ative "Enviar lembretes via WhatsApp"
2. Digite seu número (ex: `5511999999999`)
3. Ao completar tarefas, receberá links do WhatsApp

#### Configuração Avançada (WhatsApp Web.js)

1. No `.env` do servidor:
   ```env
   WHATSAPP_ENABLED=true
   ```

2. Reinicie o servidor
3. Escaneie o QR Code exibido no terminal
4. WhatsApp conectado automaticamente

**Nota:** WhatsApp Web.js requer servidor sempre rodando.

## 📡 API Endpoints

### Tarefas

- `GET /api/todos` - Listar todas as tarefas
- `GET /api/todos/:id` - Buscar tarefa específica
- `POST /api/todos` - Criar nova tarefa
- `PUT /api/todos/:id` - Atualizar tarefa
- `DELETE /api/todos/:id` - Deletar tarefa
- `POST /api/todos/sync` - Sincronizar múltiplas tarefas
- `POST /api/todos/:id/reminder` - Enviar lembrete WhatsApp

### Sistema

- `GET /api/health` - Status do servidor

## 🎨 Funcionalidades da Interface

### Visualização

- **Lista**: Visualização tradicional de tarefas
- **Calendário**: Visualização mensal com indicadores
- Alternância entre modos com um clique

### Filtros e Busca

- Busca em tempo real
- Filtro por status (Todas, Completas, Incompletas)
- Ordenação alfabética (A-Z / Z-A)

### Estatísticas

- Total de tarefas
- Tarefas completas
- Tarefas pendentes

### Lembretes

- Ativar/desativar por tarefa
- Horário personalizado
- Notificações do navegador
- Integração WhatsApp

## 🔄 Sincronização

A aplicação usa sincronização híbrida:

1. **LocalStorage**: Cache local para performance
2. **MongoDB**: Armazenamento persistente
3. **Sincronização Automática**: 
   - Ao carregar página
   - Ao criar/editar/deletar
   - Em background

### Como Funciona

- Tarefas são salvas localmente primeiro (rápido)
- Sincronização com API em background
- Se API indisponível, continua usando localStorage
- Ao reconectar, sincroniza automaticamente

## 🐛 Solução de Problemas

### MongoDB não conecta

```bash
# Verificar se está rodando
mongosh

# Ou testar conexão
mongo --eval "db.version()"
```

### API não responde

```bash
# Verificar se servidor está rodando
curl http://localhost:3001/api/health

# Verificar logs do servidor
# Deve mostrar: "🚀 Servidor rodando na porta 3001"
```

### Frontend não conecta à API

1. Verifique se backend está rodando
2. Confira CORS no servidor
3. Verifique URL no `.env` do frontend
4. Abra console do navegador para erros

### WhatsApp não funciona

- **Link Direto**: Sempre funciona, apenas abre WhatsApp Web
- **WhatsApp Web.js**: Requer QR Code escaneado
- Verifique número no formato correto (sem espaços)

## 📦 Scripts Disponíveis

### Backend

```bash
npm start      # Produção
npm run dev    # Desenvolvimento (com nodemon)
```

### Frontend

```bash
npm run dev    # Desenvolvimento
npm run build  # Build para produção
npm run preview # Preview do build
```

## 🚀 Deploy

### Backend (Heroku/Railway/Render)

1. Configure variáveis de ambiente
2. Use MongoDB Atlas
3. Deploy do código

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Configure `VITE_API_URL` com URL do backend
3. Deploy da pasta `dist`

## 📝 Licença

MIT

## 👨‍💻 Autor

Desenvolvido para portfólio

## 🙏 Agradecimentos

- React Team
- MongoDB
- Comunidade open source

---

⭐ Se gostou, considere dar uma estrela!

