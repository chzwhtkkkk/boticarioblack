@echo off
echo ================================================
echo   CORRIGIR NPM - HABILITAR SCRIPTS
echo ================================================
echo.
echo Este script vai:
echo 1. Habilitar execucao de scripts no PowerShell
echo 2. Permitir que npm funcione corretamente
echo.
echo IMPORTANTE: Execute como Administrador!
echo.
pause

echo.
echo Habilitando execucao de scripts...
echo.

PowerShell -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

if %errorlevel% equ 0 (
    echo.
    echo [OK] Scripts habilitados com sucesso!
    echo.
    echo Testando npm...
    npm --version
    
    if %errorlevel% equ 0 (
        echo.
        echo [OK] npm funcionando perfeitamente!
        echo.
        echo ================================================
        echo   TUDO PRONTO!
        echo ================================================
        echo.
        echo Agora voce pode:
        echo 1. Usar deploy-vercel.bat
        echo 2. Ou usar COMECAR-AQUI.bat
        echo.
    ) else (
        echo.
        echo [AVISO] npm ainda com problema
        echo Tente executar este arquivo como Administrador
        echo.
    )
) else (
    echo.
    echo [ERRO] Falha ao habilitar scripts
    echo.
    echo SOLUCAO:
    echo 1. Clique com botao direito neste arquivo
    echo 2. Escolha "Executar como Administrador"
    echo 3. Tente novamente
    echo.
)

pause
