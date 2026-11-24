@echo off
echo ========================================
echo   ENVIAR PROJETO PARA GITHUB COM TOKEN
echo ========================================
echo.
echo Repositorio: https://github.com/contavercelchz-alt/botiboti2k26
echo.
echo PASSO 1: Criar Token de Acesso Pessoal
echo ----------------------------------------
echo 1. Faca login na conta: contavercelchz-alt
echo 2. Va em: https://github.com/settings/tokens/new
echo 3. Marque: repo (todas as opcoes)
echo 4. Clique em "Generate token"
echo 5. COPIE o token gerado
echo.
set /p TOKEN="Cole o token aqui e pressione ENTER: "

if "%TOKEN%"=="" (
    echo.
    echo ERRO: Token nao pode estar vazio!
    pause
    exit /b 1
)

echo.
echo Configurando Git...
git config user.name "contavercelchz-alt"
git config user.email "contavercelchz.alt@gmail.com"

echo.
echo Configurando remote com token...
git remote remove origin 2>nul
git remote add origin https://%TOKEN%@github.com/contavercelchz-alt/botiboti2k26.git

echo.
echo Enviando codigo para o GitHub...
git push -u origin main --force

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo   SUCESSO! Codigo enviado para o GitHub
    echo   Acesse: https://github.com/contavercelchz-alt/botiboti2k26
    echo.
    echo IMPORTANTE: Guarde o token em lugar seguro!
) else (
    echo   ERRO! Verifique se o token esta correto
)
echo ========================================
echo.
pause
