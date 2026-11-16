@echo off
color 0A
title BLACK FRIDAY - INSTALACAO E DEPLOY

:MENU
cls
echo ================================================
echo   BLACK FRIDAY O BOTICARIO - MENU PRINCIPAL
echo ================================================
echo.
echo Escolha uma opcao:
echo.
echo [1] Verificar se Node.js esta instalado
echo [2] Abrir guia de instalacao do Node.js
echo [3] Instalar dependencias do projeto
echo [4] Testar site localmente
echo [5] Fazer build do projeto
echo [6] Deploy na Vercel
echo [7] Ver todos os guias disponiveis
echo [0] Sair
echo.
echo ================================================
set /p OPCAO=Digite o numero da opcao: 

if "%OPCAO%"=="1" goto VERIFICAR
if "%OPCAO%"=="2" goto GUIA_NODE
if "%OPCAO%"=="3" goto INSTALAR_DEP
if "%OPCAO%"=="4" goto TESTAR
if "%OPCAO%"=="5" goto BUILD
if "%OPCAO%"=="6" goto DEPLOY
if "%OPCAO%"=="7" goto GUIAS
if "%OPCAO%"=="0" goto SAIR
goto MENU

:VERIFICAR
cls
echo ================================================
echo   VERIFICANDO INSTALACAO
echo ================================================
echo.
call verificar-node.bat
pause
goto MENU

:GUIA_NODE
cls
echo ================================================
echo   ABRINDO GUIA DE INSTALACAO
echo ================================================
echo.
echo Abrindo INSTALAR-NODEJS.md...
start INSTALAR-NODEJS.md
echo.
echo Siga os passos do guia para instalar o Node.js
echo Depois volte aqui e escolha opcao [1] para verificar
echo.
pause
goto MENU

:INSTALAR_DEP
cls
echo ================================================
echo   INSTALANDO DEPENDENCIAS
echo ================================================
echo.

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado!
    echo Execute opcao [2] para instalar o Node.js primeiro
    pause
    goto MENU
)

echo Instalando pacotes do projeto...
echo Isso pode demorar alguns minutos...
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao instalar dependencias!
    pause
    goto MENU
)

echo.
echo [OK] Dependencias instaladas com sucesso!
echo.
pause
goto MENU

:TESTAR
cls
echo ================================================
echo   TESTANDO SITE LOCALMENTE
echo ================================================
echo.

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado!
    echo Execute opcao [2] para instalar o Node.js primeiro
    pause
    goto MENU
)

echo Iniciando servidor de desenvolvimento...
echo.
echo IMPORTANTE:
echo - O site vai abrir em http://localhost:5173
echo - Pressione Ctrl+C para parar o servidor
echo - Feche esta janela para voltar ao menu
echo.
pause
call npm run dev
pause
goto MENU

:BUILD
cls
echo ================================================
echo   FAZENDO BUILD DO PROJETO
echo ================================================
echo.

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado!
    echo Execute opcao [2] para instalar o Node.js primeiro
    pause
    goto MENU
)

echo Fazendo build de producao...
echo Isso pode demorar alguns minutos...
echo.
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha no build!
    pause
    goto MENU
)

echo.
echo [OK] Build concluido com sucesso!
echo A pasta "dist" foi criada
echo.
echo Agora voce pode:
echo 1. Usar opcao [6] para deploy automatico
echo 2. Ou arrastar a pasta "dist" em vercel.com
echo.
pause
goto MENU

:DEPLOY
cls
echo ================================================
echo   DEPLOY NA VERCEL
echo ================================================
echo.

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado!
    echo Execute opcao [2] para instalar o Node.js primeiro
    pause
    goto MENU
)

echo Escolha o metodo de deploy:
echo.
echo [1] Deploy automatico (Vercel CLI)
echo [2] Build manual (arrastar pasta)
echo [0] Voltar
echo.
set /p DEPLOY_OPCAO=Digite o numero: 

if "%DEPLOY_OPCAO%"=="1" goto DEPLOY_CLI
if "%DEPLOY_OPCAO%"=="2" goto DEPLOY_MANUAL
if "%DEPLOY_OPCAO%"=="0" goto MENU
goto DEPLOY

:DEPLOY_CLI
cls
echo ================================================
echo   DEPLOY AUTOMATICO - VERCEL CLI
echo ================================================
echo.
call deploy-vercel.bat
pause
goto MENU

:DEPLOY_MANUAL
cls
echo ================================================
echo   BUILD MANUAL PARA DEPLOY
echo ================================================
echo.
call deploy.bat
echo.
echo Agora:
echo 1. Acesse: https://vercel.com/new
echo 2. Faca login
echo 3. Arraste a pasta "dist" para o site
echo 4. Clique em "Deploy"
echo.
pause
goto MENU

:GUIAS
cls
echo ================================================
echo   GUIAS DISPONIVEIS
echo ================================================
echo.
echo [1] INSTALAR-NODEJS.md - Como instalar Node.js
echo [2] DEPLOY-SIMPLES.md - Guia de deploy simplificado
echo [3] DEPLOY-VERCEL.md - Guia completo de deploy
echo [4] POS-DEPLOY.md - O que fazer apos o deploy
echo [5] RESUMO-ATUALIZACAO-BLACK-FRIDAY.md - Mudancas feitas
echo [6] COMO-TESTAR-BLACK-FRIDAY.md - Como testar o site
echo [7] IDEIAS-EXTRAS-BLACK-FRIDAY.md - Melhorias extras
echo [0] Voltar
echo.
set /p GUIA=Digite o numero do guia: 

if "%GUIA%"=="1" start INSTALAR-NODEJS.md
if "%GUIA%"=="2" start DEPLOY-SIMPLES.md
if "%GUIA%"=="3" start DEPLOY-VERCEL.md
if "%GUIA%"=="4" start POS-DEPLOY.md
if "%GUIA%"=="5" start RESUMO-ATUALIZACAO-BLACK-FRIDAY.md
if "%GUIA%"=="6" start COMO-TESTAR-BLACK-FRIDAY.md
if "%GUIA%"=="7" start IDEIAS-EXTRAS-BLACK-FRIDAY.md
if "%GUIA%"=="0" goto MENU

echo.
echo Abrindo guia...
timeout /t 2 >nul
goto GUIAS

:SAIR
cls
echo.
echo Ate logo! Boa sorte com a Black Friday! 🖤
echo.
timeout /t 2 >nul
exit

