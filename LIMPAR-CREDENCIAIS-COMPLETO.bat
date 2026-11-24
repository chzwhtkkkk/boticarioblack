@echo off
echo ========================================
echo   LIMPEZA COMPLETA DE CREDENCIAIS GIT
echo ========================================
echo.
echo Este script vai remover TODAS as credenciais do Git
echo para forcar um novo login.
echo.
pause

echo.
echo [1/5] Removendo credenciais do Windows Credential Manager...
for /f "tokens=1,2 delims=:" %%a in ('cmdkey /list ^| findstr /i "git:https://github.com"') do (
    echo Removendo: %%a:%%b
    cmdkey /delete:%%a:%%b 2>nul
)
cmdkey /delete:target=git:https://github.com 2>nul
echo Feito!

echo.
echo [2/5] Removendo credenciais globais do Git...
git config --global --unset credential.helper 2>nul
git config --system --unset credential.helper 2>nul
git config --local --unset credential.helper 2>nul
echo Feito!

echo.
echo [3/5] Limpando cache do Git Credential Manager...
git credential-manager erase 2>nul
git credential reject 2>nul
echo Feito!

echo.
echo [4/5] Configurando Git para a nova conta...
git config --global user.name "contavercelchz-alt"
git config --global user.email "contavercelchz.alt@gmail.com"
git config --global credential.helper wincred
echo Feito!

echo.
echo [5/5] Testando acesso ao GitHub...
echo.
echo Agora vou testar o acesso. Uma janela vai abrir.
echo FACA LOGIN COM: contavercelchz-alt
echo.
pause

git ls-remote https://github.com/contavercelchz-alt/botiboti2k26.git >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCESSO! Login realizado com sucesso!
    echo ========================================
    echo.
    echo Agora execute: ENVIAR-PARA-GITHUB.bat
) else (
    echo.
    echo ========================================
    echo   ERRO! Nao foi possivel autenticar.
    echo ========================================
    echo.
    echo Tente a opcao com TOKEN:
    echo Execute: ENVIAR-COM-TOKEN.bat
)

echo.
pause
