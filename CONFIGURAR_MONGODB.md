# 🔧 Configuração do MongoDB - JÁ FEITA!

## ✅ Sua Connection String

Sua connection string do MongoDB Atlas já está configurada:

```
mongodb+srv://todolist:todotest123@cluster0.z0z40ib.mongodb.net/todolist
```

## 📝 Criar Arquivo .env

### Windows:
```bash
cd server
copy env.example .env
```

### macOS/Linux:
```bash
cd server
cp env.example .env
```

O arquivo `.env` será criado com sua connection string já configurada!

## ✅ Verificar Configuração

Abra o arquivo `server/.env` e verifique se contém:

```env
MONGODB_URI=mongodb+srv://todolist:todotest123@cluster0.z0z40ib.mongodb.net/todolist?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
WHATSAPP_ENABLED=false
FRONTEND_URL=http://localhost:5173
```

## 🔒 Configurar Network Access no MongoDB Atlas

1. Acesse: https://cloud.mongodb.com
2. Faça login
3. Selecione seu cluster: **Cluster0**
4. Vá em **Network Access**
5. Clique em **Add IP Address**
6. Selecione **Allow Access from Anywhere** (0.0.0.0/0)
7. Clique em **Confirm**

## ✅ Verificar Database Access

1. Vá em **Database Access**
2. Verifique se o usuário **todolist** existe
3. Se não existir, crie:
   - Username: `todolist`
   - Password: `todotest123`
   - Database User Privileges: **Read and write to any database**

## 🚀 Testar Conexão

Após configurar, inicie o servidor:

```bash
cd server
npm run dev
```

Você deve ver:
```
✅ MongoDB Conectado: cluster0-shard-00-02.z0z40ib.mongodb.net
📊 Banco de dados: todolist
🚀 Servidor rodando na porta 3001
```

## 🎯 Pronto!

Sua aplicação está conectada ao MongoDB Atlas! 🎉

