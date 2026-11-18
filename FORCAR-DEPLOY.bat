@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   FORCANDO NOVO DEPLOY NO VERCEL
echo ========================================================
echo.
echo Este script vai:
echo 1. Fazer um commit vazio (para forcar rebuild)
echo 2. Fazer push para o GitHub
echo 3. Vercel vai detectar e fazer novo deploy
echo.
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Criando commit vazio...
"C:\Program Files\Git\cmd\git.exe" commit --allow-empty -m "Force rebuild - Vercel deploy"
if errorlevel 1 git commit --allow-empty -m "Force rebuild - Vercel deploy"

echo.
echo [2/2] Fazendo push...
"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 git push

echo.
echo ========================================================
echo   PUSH CONCLUIDO!
echo ========================================================
echo.
echo Agora:
echo.
echo 1. Acesse o dashboard do Vercel
echo 2. Aguarde o deploy terminar (2-3 minutos)
echo 3. Verifique se aparece "Ready" (verde)
echo.
echo Se o erro persistir:
echo - Copie o log completo do erro
echo - Me envie para eu analisar
echo.
echo Logs do Vercel em:
echo https://vercel.com/seu-projeto/deployments
echo.
pause
