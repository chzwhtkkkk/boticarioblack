@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   CORRIGINDO ERRO DE SINTAXE - productReviews.js
echo ========================================================
echo.
echo Erro corrigido:
echo - Linha 542: Faltava ] para fechar array do produto 99
echo - Mudado de "}," para "],"
echo.
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .
if errorlevel 1 git add .

echo.
echo [2/3] Criando commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Fix: Corrigido erro de sintaxe no productReviews.js linha 542"
if errorlevel 1 git commit -m "Fix: Corrigido erro de sintaxe no productReviews.js linha 542"

echo.
echo [3/3] Enviando para GitHub...
"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 git push

echo.
echo ========================================================
echo   PUSH CONCLUIDO!
echo ========================================================
echo.
echo O build do Vercel deve funcionar agora!
echo.
echo Aguarde 2-3 minutos e teste:
echo 1. Limpe o cache (Ctrl+Shift+R)
echo 2. Va ate /produto/80 (Uomini Black)
echo 3. Role ate o final da pagina
echo 4. Deve aparecer "Avaliacoes de Clientes"
echo.
pause
