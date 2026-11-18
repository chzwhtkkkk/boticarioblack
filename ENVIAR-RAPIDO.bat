@echo off
chcp 65001 > nul
title 📤 Enviar para GitHub

REM Verificar se Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    cls
    echo.
    echo ═══════════════════════════════════════════════
    echo    ❌ GIT NÃO INSTALADO
    echo ═══════════════════════════════════════════════
    echo.
    echo Baixe GitHub Desktop (mais fácil):
    echo https://desktop.github.com/
    echo.
    echo Depois:
    echo 1. Instale e faça login
    echo 2. File -^> Add Local Repository
    echo 3. Escolha esta pasta
    echo 4. Commit + Push
    echo.
    start https://desktop.github.com/
    pause
    exit
)

cls
echo.
echo 📤 Enviando para GitHub...
echo.

git add .
git commit -m "Atualização: APIs Avenpay + DiaLOG"
git push

if errorlevel 1 (
    echo.
    echo ❌ Erro! Use GitHub Desktop:
    echo https://desktop.github.com/
    echo.
    pause
    exit
)

cls
echo.
echo ═══════════════════════════════════════════════
echo    ✅ ENVIADO COM SUCESSO!
echo ═══════════════════════════════════════════════
echo.
echo 🚀 Vercel vai fazer deploy automático
echo.
echo Acompanhe: https://vercel.com/dashboard
echo.

timeout /t 5
