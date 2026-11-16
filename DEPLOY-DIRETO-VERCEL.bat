@echo off
color 0A
echo ================================================
echo   DEPLOY DIRETO NA VERCEL (CLI)
echo ================================================
echo.

echo [1/4] Verificando Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Vercel CLI nao encontrado. Instalando...
    call npm install -g vercel
    
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar Vercel CLI
        pause
        exit /b 1
    )
    echo [OK] Vercel CLI instalado!
)

echo.
echo [2/4] Instalando dependencias do projeto...
call npm install

echo.
echo [3/4] Fazendo build...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha no build!
    echo.
    echo Verifique se tem algum erro no codigo
    pause
    exit /b 1
)

echo.
echo [OK] Build concluido!
echo.
echo [4/4] Fazendo deploy na Vercel...
echo.
echo IMPORTANTE:
echo - Se for primeira vez, faca login quando pedir
echo - Confirme as opcoes padrao (aperte ENTER)
echo.
pause

call vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   SUCESSO! SITE NO AR!
    echo ================================================
    echo.
    echo Seu site esta publicado!
    echo O link foi mostrado acima.
    echo.
    echo Pronto! Agora quando quiser atualizar:
    echo 1. Faca mudancas no codigo
    echo 2. Execute: 3-ATUALIZAR-SITE.bat
    echo 3. Ou execute este arquivo novamente
    echo.
) else (
    echo.
    echo [ERRO] Falha no deploy
    echo.
    echo Tente novamente ou use deploy manual:
    echo 1. npm run build
    echo 2. Arraste pasta "dist" em vercel.com
    echo.
)

pause
