@echo off
chcp 65001 > nul
color 0A
title 📤 Enviar Atualizações para GitHub

echo.
echo ═══════════════════════════════════════════════════════
echo    📤 ENVIANDO PARA GITHUB
echo ═══════════════════════════════════════════════════════
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não está instalado!
    echo.
    echo 📥 Baixe em: https://git-scm.com/download/win
    echo.
    echo Ou use GitHub Desktop: https://desktop.github.com/
    echo.
    pause
    exit /b 1
)

echo ✅ Git instalado
echo.

echo 📋 Verificando alterações...
git status
echo.

echo 📦 Adicionando arquivos...
git add .
echo ✅ Arquivos adicionados
echo.

echo 💬 Criando commit...
git commit -m "Atualização: Integração Avenpay + DiaLOG"
if errorlevel 1 (
    echo ⚠️  Nenhuma alteração para commitar ou erro no commit
    echo.
) else (
    echo ✅ Commit criado
    echo.
)

echo 📤 Enviando para GitHub...
git push
if errorlevel 1 (
    echo.
    echo ❌ Erro ao enviar para GitHub
    echo.
    echo Possíveis causas:
    echo - Você não está autenticado
    echo - Não tem permissão no repositório
    echo - Problema de conexão
    echo.
    echo 🔧 Solução:
    echo 1. Configure suas credenciais Git:
    echo    git config --global user.name "Seu Nome"
    echo    git config --global user.email "seu@email.com"
    echo.
    echo 2. Ou use GitHub Desktop: https://desktop.github.com/
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════
echo    ✅ ENVIADO COM SUCESSO!
echo ═══════════════════════════════════════════════════════
echo.
echo 🚀 Vercel vai detectar automaticamente e fazer deploy
echo.
echo 📊 Acompanhe em: https://vercel.com/dashboard
echo.
echo ⏱️  Deploy leva 1-2 minutos
echo.

timeout /t 5
exit
