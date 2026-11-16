@echo off
color 0A
echo ================================================
echo   VINCULAR GITHUB COM VERCEL
echo ================================================
echo.

echo Este script vai te guiar para conectar
echo seu repositorio GitHub com a Vercel
echo para deploy automatico!
echo.
echo ================================================
echo   PASSO A PASSO
echo ================================================
echo.
echo 1. Acesse: https://vercel.com/dashboard
echo.
echo 2. Se ja tem o projeto "oboticario-revendasss":
echo    a) Clique no projeto
echo    b) Va em Settings
echo    c) Va em Git
echo    d) Clique "Connect Git Repository"
echo    e) Escolha: charles15am/oboticario.revendasss
echo    f) Clique "Connect"
echo.
echo 3. Se NAO tem o projeto ainda:
echo    a) Clique "Add New" -^> "Project"
echo    b) Clique "Import Git Repository"
echo    c) Procure: oboticario.revendasss
echo    d) Clique "Import"
echo    e) Configure:
echo       - Framework Preset: Vite
echo       - Build Command: npm run build
echo       - Output Directory: dist
echo    f) Clique "Deploy"
echo.
echo 4. Aguarde o deploy (2-3 minutos)
echo.
echo 5. PRONTO! Deploy automatico configurado!
echo.
echo ================================================
echo   DEPOIS DE CONECTADO
echo ================================================
echo.
echo Sempre que voce fizer:
echo   git push
echo.
echo A Vercel vai detectar e fazer deploy automatico!
echo.
echo Ou use: 3-ATUALIZAR-SITE.bat
echo.
echo ================================================
echo.
echo Pressione qualquer tecla para abrir Vercel...
pause >nul

start https://vercel.com/dashboard

echo.
echo Dashboard Vercel aberto no navegador!
echo Siga os passos acima.
echo.
pause
