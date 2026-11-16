@echo off
color 0A
echo ================================================
echo   CORRIGIR EMAIL DO GIT
echo ================================================
echo.
echo O email do Git precisa ser o MESMO email
echo que voce usa na sua conta do GitHub!
echo.
echo Digite o email da sua conta GitHub:
echo (o mesmo que voce usa para fazer login)
echo.
set /p GIT_EMAIL=Email GitHub: 

echo.
echo Atualizando configuracao do Git...
git config --global user.email "%GIT_EMAIL%"

echo.
echo [OK] Email atualizado!
echo.
echo Agora vamos refazer o commit com o email correto...
echo.

REM Refazer o ultimo commit com o email correto
git commit --amend --reset-author --no-edit

echo.
echo [OK] Commit corrigido!
echo.
echo Agora vamos enviar novamente para o GitHub...
echo.
git push origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   SUCESSO! EMAIL CORRIGIDO!
    echo ================================================
    echo.
    echo Agora sim! Tudo certo.
    echo.
    echo Proximos passos:
    echo 1. Execute: DEPLOY-DIRETO-VERCEL.bat
    echo    OU
    echo 2. Va na Vercel e clique "Retry Deployment"
    echo.
) else (
    echo.
    echo [AVISO] Pode ser que precise de autenticacao
    echo Tente executar novamente
    echo.
)

pause
