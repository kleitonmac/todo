@echo off
echo ====================================
echo   TodoList - Iniciando Aplicacao
echo ====================================
echo.

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale Node.js de https://nodejs.org
    pause
    exit /b 1
)
echo OK: Node.js instalado
echo.

echo [2/3] Iniciando Backend...
cd server
if not exist node_modules (
    echo Instalando dependencias do backend...
    call npm install
    if errorlevel 1 (
        echo ERRO: Falha ao instalar dependencias do backend!
        echo Tentando limpar cache e reinstalar...
        call npm cache clean --force
        call npm install
    )
)
if not exist .env (
    echo Criando arquivo .env...
    copy env.example .env >nul
    echo Arquivo .env criado! MongoDB Atlas ja configurado.
)
start "Backend Server" cmd /k "npm run dev"
cd ..
timeout /t 5 /nobreak >nul
echo.

echo [3/3] Iniciando Frontend...
cd list
if not exist node_modules (
    echo Instalando dependencias do frontend...
    call npm install
)
start "Frontend Server" cmd /k "npm run dev"
cd ..
echo.

echo ====================================
echo   Aplicacao iniciada!
echo ====================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul

