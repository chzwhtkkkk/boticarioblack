@echo off
chcp 65001 > nul
color 0E
title 🔍 Verificar Status Git

cls
echo.
echo ═══════════════════════════════════════════════
echo    🔍 DIAGNÓSTICO GIT
echo ═══════════════════════════════════════════════
echo.

echo 1️⃣ Verificando se Git está instalado...
git --version
if errorlevel 1 (
    echo ❌ Git NÃO instalado
    echo.
    echo 📥 Baixe: https://git-scm.com/download/win
    echo Ou GitHub Desktop: https://desktop.github.com/
    pause
    exit
)
echo ✅ Git instalado
echo.
echo.

echo 2️⃣ Verificando configuração Git...
git config user.name
git config user.email
echo.
echo.

echo 3️⃣ Verificando repositório remoto...
git remote -v
echo.
echo.

echo 4️⃣ Verificando branch atual...
git branch
echo.
echo.

echo 5️⃣ Verificando arquivos alterados...
git status
echo.
echo.

echo 6️⃣ Verificando últimos commits...
git log --oneline -5
echo.
echo.

echo ═══════════════════════════════════════════════
echo    📋 RESUMO
echo ═══════════════════════════════════════════════
echo.
echo Se aparecer erros acima, o problema pode ser:
echo.
echo ❌ Git não configurado:
echo    git config --global user.name "Seu Nome"
echo    git config --global user.email "seu@email.com"
echo.
echo ❌ Repositório sem remote:
echo    Precisa conectar ao GitHub primeiro
echo.
echo ❌ Sem permissão:
echo    Precisa autenticar no GitHub
echo.
echo 💡 SOLUÇÃO MAIS FÁCIL:
echo    Use GitHub Desktop: https://desktop.github.com/
echo    Ele configura tudo automaticamente!
echo.
pause
