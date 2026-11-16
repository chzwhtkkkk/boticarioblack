@echo off
echo ================================================
echo   VERIFICADOR NODE.JS E NPM
echo ================================================
echo.

REM Verificar se Node.js está instalado
echo [1/3] Verificando Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js NAO encontrado!
    echo.
    echo O que fazer:
    echo 1. Baixe em: https://nodejs.org
    echo 2. Instale seguindo INSTALAR-NODEJS.md
    echo 3. REINICIE o computador
    echo 4. Execute este script novamente
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js encontrado: %NODE_VERSION%
)

echo.
echo [2/3] Verificando npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] npm NAO encontrado!
    echo.
    echo Reinstale o Node.js seguindo INSTALAR-NODEJS.md
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm encontrado: %NPM_VERSION%
)

echo.
echo [3/3] Verificando Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Vercel CLI nao encontrado
    echo.
    echo Deseja instalar agora? (S/N)
    set /p INSTALL_VERCEL=
    if /i "%INSTALL_VERCEL%"=="S" (
        echo.
        echo Instalando Vercel CLI...
        call npm install -g vercel
        echo [OK] Vercel CLI instalado!
    ) else (
        echo [!] Voce pode instalar depois com: npm install -g vercel
    )
) else (
    for /f "tokens=*" %%i in ('vercel --version') do set VERCEL_VERSION=%%i
    echo [OK] Vercel CLI encontrado: %VERCEL_VERSION%
)

echo.
echo ================================================
echo   RESUMO DA INSTALACAO
echo ================================================
echo.
echo Node.js:  %NODE_VERSION%
echo npm:      %NPM_VERSION%
echo Vercel:   %VERCEL_VERSION%
echo.
echo ================================================
echo   TUDO PRONTO!
echo ================================================
echo.
echo Agora voce pode:
echo.
echo 1. Instalar dependencias:
echo    npm install
echo.
echo 2. Rodar o site localmente:
echo    npm run dev
echo.
echo 3. Fazer build:
echo    npm run build
echo.
echo 4. Deploy na Vercel:
echo    deploy-vercel.bat
echo.
pause
