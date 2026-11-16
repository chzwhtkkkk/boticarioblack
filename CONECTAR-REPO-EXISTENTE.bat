@echo off
color 0A
echo ================================================
echo   CONECTAR COM REPOSITORIO EXISTENTE
echo ================================================
echo.

echo Verificando se ja existe repositorio local...
if exist .git (
    echo.
    echo [AVISO] Repositorio local ja existe!
    echo Vamos atualizar o repositorio remoto...
    echo.
    
    REM Remover origin antigo se existir
    git remote remove origin 2>nul
    
    echo Conectando com: https://github.com/charles15am/oboticario.revendasss
    git remote add origin https://github.com/charles15am/oboticario.revendasss.git
    
) else (
    echo.
    echo Inicializando repositorio local...
    git init
    
    echo Configurando Git...
    git config user.name "charles15am"
    git config user.email "charles15am@github.com"
    
    echo Adicionando arquivos...
    git add .
    
    echo Fazendo commit...
    git commit -m "Black Friday 2024 - Atualizacao completa"
    
    echo Conectando com GitHub...
    git remote add origin https://github.com/charles15am/oboticario.revendasss.git
)

echo.
echo Mudando para branch main...
git branch -M main

echo.
echo ================================================
echo   ENVIANDO PARA GITHUB
echo ================================================
echo.
echo Isso pode pedir autenticacao...
echo Escolha "Sign in with browser" se aparecer
echo.
pause

git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   SUCESSO! CODIGO ATUALIZADO NO GITHUB!
    echo ================================================
    echo.
    echo Seu repositorio: https://github.com/charles15am/oboticario.revendasss
    echo.
    echo Agora vamos conectar com Vercel:
    echo.
    echo 1. Acesse: https://vercel.com
    echo 2. Faca login com GitHub
    echo 3. Se ja tem o projeto conectado:
    echo    - O site vai atualizar automaticamente!
    echo.
    echo 4. Se NAO tem conectado ainda:
    echo    - Clique "Add New" -^> "Project"
    echo    - Clique "Import" no repo: oboticario.revendasss
    echo    - Clique "Deploy"
    echo.
    echo PRONTO! Deploy automatico configurado!
    echo.
    echo Para atualizar depois: 3-ATUALIZAR-SITE.bat
    echo.
) else (
    echo.
    echo ================================================
    echo   ERRO AO ENVIAR
    echo ================================================
    echo.
    echo Pode ser necessario autenticar no GitHub
    echo.
    echo Tente:
    echo 1. Execute novamente este script
    echo 2. Quando pedir login, escolha browser
    echo 3. Autorize o acesso
    echo.
)

pause
