@echo off
chcp 65001 > nul
color 0B
title 🚀 Atualizar Site - GitHub + Vercel

:MENU
cls
echo.
echo ═══════════════════════════════════════════════════════
echo    🚀 ATUALIZAR SITE NO GITHUB + VERCEL
echo ═══════════════════════════════════════════════════════
echo.
echo  1. 📤 Enviar alterações para GitHub (Deploy automático)
echo  2. 📋 Ver alterações antes de enviar
echo  3. ❌ Sair
echo.
echo ═══════════════════════════════════════════════════════
echo.

set /p opcao="Escolha uma opção (1-3): "

if "%opcao%"=="1" goto ENVIAR
if "%opcao%"=="2" goto VER_ALTERACOES
if "%opcao%"=="3" goto SAIR
goto MENU

:VER_ALTERACOES
cls
echo.
echo 📋 Verificando alterações...
echo.
git status
if errorlevel 1 (
    echo.
    echo ❌ Git não está instalado!
    echo.
    echo 📥 Instale o Git:
    echo    https://git-scm.com/download/win
    echo.
    echo Ou use GitHub Desktop (mais fácil):
    echo    https://desktop.github.com/
    echo.
    pause
    goto MENU
)
echo.
pause
goto MENU

:ENVIAR
cls
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
    echo 📥 OPÇÃO 1 - Git (linha de comando):
    echo    Baixe: https://git-scm.com/download/win
    echo    Instale e rode este .bat novamente
    echo.
    echo 📥 OPÇÃO 2 - GitHub Desktop (RECOMENDADO - mais fácil):
    echo    Baixe: https://desktop.github.com/
    echo    1. Instale e abra
    echo    2. File -^> Add Local Repository
    echo    3. Escolha esta pasta
    echo    4. Commit -^> Push
    echo.
    pause
    goto MENU
)

echo ✅ Git instalado
echo.

echo 📋 Verificando alterações...
git status
echo.

set /p confirma="Deseja enviar estas alterações? (S/N): "
if /i not "%confirma%"=="S" goto MENU

echo.
echo 📦 Adicionando arquivos...
git add .
echo ✅ Arquivos adicionados
echo.

echo 💬 Criando commit...
set /p mensagem="Digite a mensagem do commit (ou Enter para padrão): "
if "%mensagem%"=="" set mensagem=Atualização automática - Integração Avenpay + DiaLOG

git commit -m "%mensagem%"
if errorlevel 1 (
    echo.
    echo ⚠️  Nenhuma alteração para commitar
    echo.
    pause
    goto MENU
)
echo ✅ Commit criado
echo.

echo 📤 Enviando para GitHub...
echo.
git push
if errorlevel 1 (
    echo.
    echo ═══════════════════════════════════════════════════════
    echo    ❌ ERRO AO ENVIAR PARA GITHUB
    echo ═══════════════════════════════════════════════════════
    echo.
    echo Possíveis causas:
    echo  - Primeira vez usando Git (precisa configurar)
    echo  - Sem permissão no repositório
    echo  - Problema de conexão
    echo.
    echo 🔧 SOLUÇÃO RÁPIDA - Use GitHub Desktop:
    echo    1. Baixe: https://desktop.github.com/
    echo    2. Faça login com sua conta GitHub
    echo    3. File -^> Add Local Repository
    echo    4. Escolha esta pasta do projeto
    echo    5. Commit -^> Push
    echo.
    echo 🔧 OU configure o Git (avançado):
    echo    git config --global user.name "Seu Nome"
    echo    git config --global user.email "seu@email.com"
    echo.
    pause
    goto MENU
)

echo.
echo ═══════════════════════════════════════════════════════
echo    ✅ ENVIADO COM SUCESSO PARA GITHUB!
echo ═══════════════════════════════════════════════════════
echo.
echo 🎉 Próximos passos automáticos:
echo.
echo  1. ✅ GitHub recebeu as alterações
echo  2. 🔄 Vercel detecta automaticamente
echo  3. 🚀 Deploy inicia sozinho (1-2 min)
echo  4. ✅ Site atualizado!
echo.
echo 📊 Acompanhe o deploy:
echo    https://vercel.com/dashboard
echo.
echo 📝 IMPORTANTE: Configurar webhook Avenpay
echo    Painel Avenpay -^> Webhooks:
echo    https://seu-site.vercel.app/api/webhooks/avenpay
echo.
echo.

timeout /t 10
goto MENU

:SAIR
cls
echo.
echo ✅ Até logo!
echo.
timeout /t 2
exit

