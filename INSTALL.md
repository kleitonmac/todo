# 📦 Guia de Instalação Passo a Passo

## 🎯 Instalação Completa em 5 Minutos

### Passo 1: Verificar Pré-requisitos

#### Node.js
```bash
node --version
# Deve mostrar v16 ou superior
```

Se não tiver Node.js:
- Download: https://nodejs.org
- Instale a versão LTS

#### MongoDB (Escolha uma opção)

**Opção A: MongoDB Local**
```bash
# Windows (com Chocolatey)
choco install mongodb

# macOS
brew install mongodb-community

# Linux
sudo apt-get install mongodb
```

**Opção B: MongoDB Atlas (Recomendado - Gratuito)**
1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie conta gratuita
3. Crie cluster (Free tier)
4. Anote a connection string

### Passo 2: Configurar Backend

```bash
# Navegue até a pasta do servidor
cd server

# Instale dependências
npm install

# Copie arquivo de configuração
cp env.example .env
```

Edite o arquivo `.env`:
```env
# Se MongoDB Local:
MONGODB_URI=mongodb://localhost:27017/todolist

# Se MongoDB Atlas:
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/todolist

PORT=3001
WHATSAPP_ENABLED=false
FRONTEND_URL=http://localhost:5173
```

### Passo 3: Configurar Frontend

```bash
# Volte para a raiz e entre na pasta do frontend
cd ../list

# Instale dependências
npm install
```

### Passo 4: Iniciar MongoDB (se local)

```bash
# Windows
net start MongoDB

# macOS/Linux
mongod
```

### Passo 5: Iniciar Aplicação

**Windows:**
```bash
# Na raiz do projeto
start.bat
```

**macOS/Linux:**
```bash
# Na raiz do projeto
chmod +x start.sh
./start.sh
```

**Ou manualmente:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd list
npm run dev
```

### Passo 6: Acessar Aplicação

Abra seu navegador em: **http://localhost:5173**

## ✅ Verificação

### Backend funcionando?
```bash
curl http://localhost:3001/api/health
```
Deve retornar JSON com status.

### Frontend funcionando?
Acesse http://localhost:5173 e veja a interface.

### MongoDB conectado?
Verifique os logs do backend. Deve mostrar:
```
✅ MongoDB Conectado: ...
```

## 🎉 Pronto!

Sua aplicação está rodando! Agora você pode:

1. Criar tarefas
2. Configurar WhatsApp (opcional)
3. Usar o calendário
4. Ativar lembretes

## 🆘 Problemas?

### Erro: "Cannot find module"
```bash
# Reinstale dependências
cd server && npm install
cd ../list && npm install
```

### Erro: "MongoDB connection failed"
- Verifique se MongoDB está rodando
- Confira a connection string no `.env`
- Teste: `mongosh` ou `mongo`

### Erro: "Port already in use"
- Feche outros servidores na porta 3001 ou 5173
- Ou mude a porta no `.env`

### Frontend não conecta à API
- Verifique se backend está rodando
- Confira CORS no servidor
- Verifique console do navegador

## 📚 Próximos Passos

1. Configure seu número do WhatsApp
2. Crie algumas tarefas de teste
3. Teste completar uma tarefa
4. Veja o WhatsApp funcionar!

---

**Dúvidas?** Consulte o `README.md` ou `SETUP.md`

