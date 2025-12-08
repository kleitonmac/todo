# ⚡ Início Rápido - 2 Minutos

## 🚀 Início Automático

### Windows:
```bash
start.bat
```

### macOS/Linux:
```bash
chmod +x start.sh
./start.sh
```

## 📝 Configuração Mínima

### 1. Backend (server/.env)
```env
MONGODB_URI=mongodb://localhost:27017/todolist
PORT=3001
```

### 2. Iniciar MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux  
mongod
```

### 3. Pronto!
Os scripts `start.bat` ou `start.sh` fazem o resto automaticamente!

## 🎯 Acesse

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## 💡 Dica Rápida

Para usar MongoDB Atlas (cloud, sem instalação):
1. Crie conta em mongodb.com/cloud/atlas
2. Copie connection string
3. Cole no `server/.env` como `MONGODB_URI`

---

**Pronto para usar!** 🎉

