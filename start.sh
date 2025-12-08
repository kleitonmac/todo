#!/bin/bash

echo "===================================="
echo "  TodoList - Iniciando Aplicação"
echo "===================================="
echo ""

echo "[1/3] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não encontrado!"
    echo "Instale Node.js de https://nodejs.org"
    exit 1
fi
echo "OK: Node.js instalado"
echo ""

echo "[2/3] Iniciando Backend..."
cd server
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do backend..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERRO: Falha ao instalar dependências!"
        echo "Tentando limpar cache e reinstalar..."
        npm cache clean --force
        npm install
    fi
fi
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp env.example .env
    echo "Arquivo .env criado! MongoDB Atlas já configurado."
fi
npm run dev &
BACKEND_PID=$!
cd ..
sleep 5
echo ""

echo "[3/3] Iniciando Frontend..."
cd list
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..
echo ""

echo "===================================="
echo "  Aplicação iniciada!"
echo "===================================="
echo ""
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Pressione Ctrl+C para parar os servidores"
echo ""

# Aguardar Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

