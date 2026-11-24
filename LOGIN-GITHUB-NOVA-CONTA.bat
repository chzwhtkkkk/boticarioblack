@echo off
echo ========================================
echo   LOGIN NO GITHUB - CONTA NOVA
echo ========================================
echo.
echo Este script vai:
echo 1. Limpar credenciais antigas do Git
echo 2. Abrir o GitHub para voce fazer login
echo 3. Configurar a nova conta
echo.
pause

echo.
echo [1/4] Limpando credenciais antigas do Windows...
cmdkey /list:target=git:https://github.com 2>nul
if %ERRORLEVEL% EQU 0 (
    cmdkey /delete:target=git:https://github.com
    echo Credenciais antigas removidas!
) else (
    echo Nenhuma credencial antiga encontrada.
)

echo.
echo [2/4] Limpando cache do Git Credential Manager...
git credential-manager-core erase
protocol=https
host=github.com


echo.
echo [3/4] Configurando Git para a nova conta...
git config --global user.name "contavercelchz-alt"
git config --global user.email "contavercelchz.alt@gmail.com"
git config --global credential.helper manager-core

echo.
echo [4/4] Abrindo GitHub para login...
echo.
echo IMPORTANTE:
echo - Uma janela do navegador vai abrir
echo - Faca login na conta: contavercelchz-alt
echo - Depois volte aqui e pressione qualquer tecla
echo.
start https://github.com/login
pause

echo.
echo ========================================
echo   CONFIGURACAO CONCLUIDA!
echo ========================================
echo.
echo Proximos passos:
echo 1. Execute: ENVIAR-PARA-GITHUB.bat
echo    OU
echo 2. Execute: git push -u origin main --force
echo.
echo Uma janela de autenticacao vai abrir.
echo Use a conta: contavercelchz-alt
echo.
pause
