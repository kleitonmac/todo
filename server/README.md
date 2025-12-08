# TodoList Server API

Backend API para a aplicação de lista de tarefas com MongoDB e integração WhatsApp.

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
- `MONGODB_URI`: URL de conexão do MongoDB
- `PORT`: Porta do servidor (padrão: 3001)
- `WHATSAPP_ENABLED`: true/false para habilitar WhatsApp
- `FRONTEND_URL`: URL do frontend para CORS

3. Inicie o servidor:
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

## 📡 Endpoints da API

### GET /api/todos
Busca todas as tarefas
- Query params: `userId` (opcional)

### GET /api/todos/:id
Busca uma tarefa específica

### POST /api/todos
Cria uma nova tarefa
- Body: `{ text, category, dueDate, reminderEnabled, ... }`

### PUT /api/todos/:id
Atualiza uma tarefa
- Body: campos a atualizar
- Se `isCompleted: true` e `whatsappPhone` fornecido, envia WhatsApp

### DELETE /api/todos/:id
Deleta uma tarefa

### POST /api/todos/sync
Sincroniza múltiplas tarefas
- Body: `{ todos: [...], userId }`

### POST /api/todos/:id/reminder
Envia lembrete via WhatsApp
- Body: `{ phoneNumber }`

### GET /api/health
Status do servidor e WhatsApp

## 📱 Integração WhatsApp

Para usar a integração completa do WhatsApp:

1. Configure `WHATSAPP_ENABLED=true` no `.env`
2. Na primeira execução, escaneie o QR Code exibido no terminal
3. O WhatsApp será conectado automaticamente nas próximas vezes

**Nota**: A integração usa WhatsApp Web.js que requer um navegador headless. Em produção, considere usar a API oficial do WhatsApp Business.

## 🗄️ MongoDB

### Instalação Local
```bash
# Windows (com Chocolatey)
choco install mongodb

# macOS (com Homebrew)
brew install mongodb-community

# Linux
sudo apt-get install mongodb
```

### MongoDB Atlas (Cloud)
1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Copie a connection string para `MONGODB_URI`

## 🔒 Segurança

- Configure CORS adequadamente para produção
- Use variáveis de ambiente para dados sensíveis
- Implemente autenticação para múltiplos usuários
- Use HTTPS em produção

