@echo off
color 0A
title CONFIGURAR GITHUB + VERCEL

:MENU
cls
echo ================================================
echo   GITHUB + VERCEL - CONFIGURACAO AUTOMATICA
echo ================================================
echo.
echo [1] Verificar se Git esta instalado
echo [2] Abrir guia de instalacao do Git
echo [3] Configurar Git (nome e email)
echo [4] Inicializar repositorio local
echo [5] Fazer primeiro commit
echo [6] Conectar com GitHub
echo [7] Ver status do Git
echo [8] Abrir guia completo
echo [0] Voltar
echo.
echo ================================================
set /p OPCAO=Escolha uma opcao: 

if "%OPCAO%"=="1" goto VERIFICAR_GIT
if "%OPCAO%"=="2" goto GUIA_GIT
if "%OPCAO%"=="3" goto CONFIGURAR_GIT
if "%OPCAO%"=="4" goto INIT_GIT
if "%OPCAO%"=="5" goto COMMIT
if "%OPCAO%"=="6" goto CONECTAR_GITHUB
if "%OPCAO%"=="7" goto STATUS
if "%OPCAO%"=="8" goto GUIA_COMPLETO
if "%OPCAO%"=="0" goto FIM
goto MENU

:VERIFICAR_GIT
cls
echo ================================================
echo   VERIFICANDO GIT
echo ================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Git NAO encontrado!
    echo.
    echo Instale o Git:
    echo 1. Escolha opcao [2] para ver guia
    echo 2. Ou baixe em: https://git-scm.com/download/win
    echo.
) else (
    for /f "tokens=*" %%i in ('git --version') do echo [OK] %%i
    echo.
    echo Git esta instalado e funcionando!
)

pause
goto MENU

:GUIA_GIT
cls
echo ================================================
echo   ABRINDO GUIA
echo ================================================
echo.
echo Abrindo CONFIGURAR-GITHUB-VERCEL.md...
start CONFIGURAR-GITHUB-VERCEL.md
echo.
echo Siga o PASSO 1 para instalar o Git
pause
goto MENU

:CONFIGURAR_GIT
cls
echo ================================================
echo   CONFIGURAR GIT
echo ================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Git nao esta instalado!
    echo Escolha opcao [2] para instalar primeiro
    pause
    goto MENU
)

echo Digite seu nome completo:
set /p GIT_NAME=Nome: 

echo.
echo Digite seu email (use o mesmo do GitHub):
set /p GIT_EMAIL=Email: 

echo.
echo Configurando...
git config --global user.name "%GIT_NAME%"
git config --global user.email "%GIT_EMAIL%"

echo.
echo [OK] Git configurado!
echo.
echo Suas configuracoes:
git config --list | findstr "user"
echo.
pause
goto MENU

:INIT_GIT
cls
echo ================================================
echo   INICIALIZAR REPOSITORIO
echo ================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Git nao esta instalado!
    pause
    goto MENU
)

if exist .git (
    echo [AVISO] Repositorio ja inicializado!
    echo.
) else (
    echo Inicializando repositorio Git...
    git init
    
    if %errorlevel% equ 0 (
        echo [OK] Repositorio inicializado!
    ) else (
        echo [ERRO] Falha ao inicializar
    )
)

echo.
pause
goto MENU

:COMMIT
cls
echo ================================================
echo   FAZER PRIMEIRO COMMIT
echo ================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Git nao esta instalado!
    pause
    goto MENU
)

if not exist .git (
    echo [ERRO] Repositorio nao inicializado!
    echo Escolha opcao [4] primeiro
    pause
    goto MENU
)

echo Adicionando arquivos...
git add .

echo.
echo Fazendo commit...
git commit -m "Black Friday 2024 - Deploy inicial"

if %errorlevel% equ 0 (
    echo.
    echo [OK] Commit realizado com sucesso!
    echo.
    echo Agora:
    echo 1. Va em: https://github.com/new
    echo 2. Crie um repositorio
    echo 3. Copie os comandos de "push existing repository"
    echo 4. Volte e escolha opcao [6]
    echo.
) else (
    echo.
    echo [AVISO] Nada para commitar ou erro
)

pause
goto MENU

:CONECTAR_GITHUB
cls
echo ================================================
echo   CONECTAR COM GITHUB
echo ================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Git nao esta instalado!
    pause
    goto MENU
)

if not exist .git (
    echo [ERRO] Repositorio nao inicializado!
    echo Escolha opcao [4] primeiro
    pause
    goto MENU
)

echo IMPORTANTE:
echo 1. Va em: https://github.com/new
echo 2. Crie um repositorio (ex: loja-boticario-black-friday)
echo 3. NAO marque nenhuma opcao
echo 4. Clique "Create repository"
echo 5. Copie a URL que aparece
echo.
echo Exemplo: https://github.com/SEU_USUARIO/loja-boticario-black-friday.git
echo.
echo Digite a URL do seu repositorio:
set /p REPO_URL=URL: 

echo.
echo Conectando...
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Enviando para GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   SUCESSO!
    echo ================================================
    echo.
    echo Codigo enviado para GitHub!
    echo.
    echo Agora:
    echo 1. Acesse: https://vercel.com
    echo 2. Faca login com GitHub
    echo 3. Clique "Import Project"
    echo 4. Escolha seu repositorio
    echo 5. Clique "Deploy"
    echo.
    echo PRONTO! Deploy automatico configurado!
    echo.
) else (
    echo.
    echo [ERRO] Falha ao enviar
    echo.
    echo Verifique:
    echo - URL esta correta?
    echo - Fez login no GitHub?
    echo - Tem permissao no repositorio?
    echo.
)

pause
goto MENU

:STATUS
cls
echo ================================================
echo   STATUS DO GIT
echo ================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Git nao esta instalado!
    pause
    goto MENU
)

if not exist .git (
    echo [AVISO] Repositorio nao inicializado ainda
    pause
    goto MENU
)

git status
echo.
echo ================================================
echo.
git remote -v
echo.
pause
goto MENU

:GUIA_COMPLETO
cls
echo ================================================
echo   ABRINDO GUIA COMPLETO
echo ================================================
echo.
start CONFIGURAR-GITHUB-VERCEL.md
echo.
echo Guia aberto!
timeout /t 2 >nul
goto MENU

:FIM
exit

