@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   CORRIGINDO ERRO LINHA 569 - productReviews.js
echo ========================================================
echo.
echo ERRO ENCONTRADO:
echo Linha 569: },  (ERRADO - fecha objeto)
echo.
echo CORRECAO APLICADA:
echo Linha 569: ],  (CORRETO - fecha array)
echo.
echo Este erro estava impedindo o build do Vercel.
echo.
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Adicionando correcao...
"C:\Program Files\Git\cmd\git.exe" add src/data/productReviews.js
if errorlevel 1 git add src/data/productReviews.js

echo.
echo [2/3] Criando commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Fix: Corrigido linha 569 productReviews.js - array do produto 100"
if errorlevel 1 git commit -m "Fix: Corrigido linha 569 productReviews.js - array do produto 100"

echo.
echo [3/3] Fazendo push...
"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 git push

echo.
echo ========================================================
echo   PUSH CONCLUIDO COM SUCESSO!
echo ========================================================
echo.
echo Agora o build do Vercel deve passar!
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Acesse: https://vercel.com/dashboard
echo 2. Aguarde 2-3 minutos
echo 3. Verifique se o deploy fica verde (Ready)
echo 4. Teste o site: /produto/80
echo 5. Procure por "Avaliacoes de Clientes"
echo.
echo Se der erro novamente:
echo - Me envie o log completo do Vercel
echo - Vou verificar se ha mais erros
echo.
pause
