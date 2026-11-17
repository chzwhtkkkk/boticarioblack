@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   FIX: CORRIGINDO AVALIACOES + DEBUG
echo ========================================================
echo.
echo Adicionando console.log para debug...
echo Isso vai mostrar no console do navegador se as avaliacoes
echo estao sendo carregadas corretamente.
echo.
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .
if errorlevel 1 git add .

echo.
echo [2/3] Criando commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Fix: Adicionado debug para avaliacoes + arquivos de troubleshooting"
if errorlevel 1 git commit -m "Fix: Adicionado debug para avaliacoes + arquivos de troubleshooting"

echo.
echo [3/3] Enviando para GitHub...
"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 git push

echo.
echo ========================================================
echo   PUSH CONCLUIDO!
echo ========================================================
echo.
echo COMO TESTAR AGORA:
echo.
echo 1. Aguarde 2-3 minutos para o Vercel fazer deploy
echo.
echo 2. Abra o site em modo anonimo ou limpe o cache
echo    Chrome: Ctrl+Shift+N (anonimo)
echo    Ou: Ctrl+Shift+R (limpar cache)
echo.
echo 3. Va ate um produto de NATAL (IDs 80-107)
echo    Exemplo: /produto/80 (Uomini Black)
echo.
echo 4. Pressione F12 para abrir o console
echo.
echo 5. Procure pelas mensagens:
echo    - Product ID: 80
echo    - Reviews found: 3
echo    - Reviews data: [...]
echo.
echo 6. Role a pagina ate o final
echo    - Se Reviews found: 3, deve aparecer "Avaliacoes de Clientes"
echo    - Se Reviews found: 0, o produto nao tem avaliacoes
echo.
echo IMPORTANTE:
echo - Produtos de Natal: IDs 80 ate 107 (TEM avaliacoes)
echo - Produtos antigos: IDs 1-79 (NAO TEM avaliacoes)
echo.
echo Se nao aparecer, execute: .\TESTAR-AVALIACOES.bat
echo.
pause
