@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   FAZENDO PUSH DA CORRECAO
echo ========================================
echo.

cd /d "%~dp0"

echo Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .
if errorlevel 1 (
    echo ERRO: Nao foi possivel adicionar arquivos
    git add .
)

echo.
echo Fazendo commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Corrigido erro de sintaxe - faltava virgula no produto 79"
if errorlevel 1 (
    echo ERRO: Tentando com git global...
    git commit -m "Corrigido erro de sintaxe - faltava virgula no produto 79"
)

echo.
echo Fazendo push...
"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 (
    echo ERRO: Tentando com git global...
    git push
)

echo.
echo ========================================
echo   CONCLUIDO!
echo ========================================
echo.
echo Aguarde 2-3 minutos e acesse seu site!
echo O Vercel vai atualizar automaticamente.
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
