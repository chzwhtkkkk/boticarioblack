@echo off
chcp 65001 >nul
cls
echo.
echo ==========================================
echo   PUSH FINAL - CORRECAO DE IMAGENS
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/3] Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .
if errorlevel 1 git add .

echo.
echo [2/3] Criando commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Corrigido nomes de imagens dos produtos Natal 2026"
if errorlevel 1 git commit -m "Corrigido nomes de imagens dos produtos Natal 2026"

echo.
echo [3/3] Fazendo push...
"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 git push

echo.
echo ==========================================
echo   PUSH CONCLUIDO COM SUCESSO!
echo ==========================================
echo.
echo Aguarde 2-3 minutos para o Vercel atualizar
echo Depois limpe o cache do navegador: Ctrl+F5
echo.
pause
