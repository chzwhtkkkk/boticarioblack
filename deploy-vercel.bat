@echo off
echo ================================================
echo   DEPLOY DIRETO PARA VERCEL
echo ================================================
echo.

REM Verificar se npm está instalado
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js/NPM nao encontrado!
    echo Instale em: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar se vercel está instalado
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [AVISO] Vercel CLI nao encontrado!
    echo Instalando Vercel CLI...
    call npm install -g vercel
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar Vercel CLI
        pause
        exit /b 1
    )
)

echo.
echo [1/3] Instalando dependencias...
call npm install

echo.
echo [2/3] Fazendo build...
call npm run build

echo.
echo [3/3] Fazendo deploy na Vercel...
echo.
echo IMPORTANTE: 
echo - Se for primeira vez, faca login quando solicitar
echo - Confirme as opcoes padrao (aperte ENTER)
echo.
pause

call vercel --prod

echo.
echo ================================================
echo   DEPLOY CONCLUIDO!
echo ================================================
echo.
echo Seu site esta no ar!
echo Acesse o link mostrado acima.
echo.
pause
