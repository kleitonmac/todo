# 🔧 Instalação Corrigida - Passo a Passo

## ✅ Configuração Rápida

### 1. Backend já está configurado!

O arquivo `.env` já foi criado com sua connection string do MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://todolist:todotest123@cluster0.z0z40ib.mongodb.net/todolist
```

### 2. Instalar Dependências do Backend

```bash
cd server
npm install
```

**Se der erro, tente:**
```bash
# Limpar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

### 3. Instalar Dependências do Frontend

```bash
cd ../list
npm install
```

### 4. Iniciar Backend

```bash
cd server
npm run dev
```

**Você deve ver:**
```
✅ MongoDB Conectado: cluster0-shard-00-02.z0z40ib.mongodb.net
📊 Banco de dados: todolist
🚀 Servidor rodando na porta 3001
📡 API disponível em http://localhost:3001/api
```

### 5. Iniciar Frontend (em outro terminal)

```bash
cd list
npm run dev
```

### 6. Acessar

Abra: **http://localhost:5173**

## 🐛 Problemas Comuns e Soluções

### Erro: "Cannot find module"
```bash
# Backend
cd server
rm -rf node_modules
npm install

# Frontend
cd list
rm -rf node_modules
npm install
```

### Erro: "MongoDB connection failed"

1. **Verifique a connection string:**
   - Deve estar no arquivo `server/.env`
   - Formato: `mongodb+srv://usuario:senha@cluster.mongodb.net/todolist`

2. **Verifique Network Access no MongoDB Atlas:**
   - Acesse: https://cloud.mongodb.com
   - Network Access > Add IP Address
   - Adicione: `0.0.0.0/0` (permite de qualquer IP)

3. **Verifique Database Access:**
   - Database Access > Verifique se o usuário existe
   - Senha deve estar correta

### Erro: "Port 3001 already in use"

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill
```

### Erro: "CORS policy"

Verifique se `FRONTEND_URL` no `.env` do servidor está correto:
```env
FRONTEND_URL=http://localhost:5173
```

### Frontend não conecta à API

1. Verifique se backend está rodando
2. Abra console do navegador (F12)
3. Verifique erros de conexão
4. Teste: `curl http://localhost:3001/api/health`

## ✅ Verificação Final

### Backend funcionando?
```bash
curl http://localhost:3001/api/health
```
Deve retornar:
```json
{
  "status": "OK",
  "timestamp": "...",
  "whatsapp": {...}
}
```

### MongoDB conectado?
Logs do backend devem mostrar:
```
✅ MongoDB Conectado: cluster0-shard-00-02.z0z40ib.mongodb.net
📊 Banco de dados: todolist
```

### Frontend funcionando?
- Acesse http://localhost:5173
- Deve ver a interface
- Deve mostrar "✅ API conectada" se backend estiver rodando

## 🎯 Teste Rápido

1. Crie uma tarefa no frontend
2. Verifique se aparece no MongoDB Atlas:
   - Acesse: https://cloud.mongodb.com
   - Collections > todolist > todos
   - Deve ver sua tarefa

3. Marque como completa
4. Verifique se sincronizou

## 📝 Notas Importantes

- MongoDB Atlas já está configurado
- Connection string está no `server/.env`
- Não precisa instalar MongoDB localmente
- Funciona direto com MongoDB Atlas

## 🆘 Ainda com problemas?

1. Verifique logs do backend
2. Verifique console do navegador (F12)
3. Teste a API diretamente:
   ```bash
   curl http://localhost:3001/api/todos
   ```

---

**Tudo configurado e pronto para usar!** 🚀

