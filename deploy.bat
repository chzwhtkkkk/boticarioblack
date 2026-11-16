@echo off
echo ================================================
echo   BLACK FRIDAY - DEPLOY PARA VERCEL
echo ================================================
echo.

REM Verificar se npm está instalado
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js/NPM nao encontrado!
    echo.
    echo Por favor, instale o Node.js:
    echo https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [1/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo [2/3] Fazendo build do projeto...
call npm run build
if %errorlevel% neq 0 (
    echo [ERRO] Falha no build!
    pause
    exit /b 1
)

echo.
echo [3/3] Build concluido com sucesso!
echo.
echo ================================================
echo   PASTA PRONTA: dist/
echo ================================================
echo.
echo Opcoes de deploy:
echo.
echo 1. VERCEL CLI (recomendado):
echo    npm install -g vercel
echo    vercel login
echo    vercel --prod
echo.
echo 2. VERCEL WEBSITE:
echo    Arraste a pasta "dist" em vercel.com
echo.
echo 3. GITHUB + VERCEL:
echo    git add .
echo    git commit -m "Black Friday deploy"
echo    git push
echo.
echo Leia DEPLOY-VERCEL.md para mais detalhes
echo.
pause
