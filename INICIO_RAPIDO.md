# ⚡ Início Rápido - 3 Comandos

## 🚀 Passo a Passo Simplificado

### 1. Criar arquivo .env no servidor

**Windows:**
```bash
cd server
copy env.example .env
```

**macOS/Linux:**
```bash
cd server
cp env.example .env
```

### 2. Instalar dependências

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd list
npm install
```

### 3. Iniciar aplicação

**Opção A: Script Automático**

Windows:
```bash
start.bat
```

macOS/Linux:
```bash
chmod +x start.sh
./start.sh
```

**Opção B: Manual**

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

### 4. Acessar

Abra: **http://localhost:5173**

## ✅ Verificar se está funcionando

### Backend:
```bash
curl http://localhost:3001/api/health
```

Deve retornar JSON com status OK.

### Frontend:
- Acesse http://localhost:5173
- Deve ver a interface
- Deve mostrar "✅ API conectada" se backend estiver rodando

## 🎯 MongoDB Atlas

Sua connection string já está configurada no `env.example`:
```
mongodb+srv://todolist:todotest123@cluster0.z0z40ib.mongodb.net/todolist
```

**Importante:** Configure Network Access no MongoDB Atlas:
1. Acesse: https://cloud.mongodb.com
2. Network Access > Add IP Address
3. Adicione: `0.0.0.0/0` (permite de qualquer IP)

## 🐛 Problemas?

### Erro ao instalar dependências:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### MongoDB não conecta:
- Verifique Network Access no Atlas
- Confirme usuário e senha
- Teste connection string

### Porta em uso:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill
```

---

**Pronto para usar!** 🎉

