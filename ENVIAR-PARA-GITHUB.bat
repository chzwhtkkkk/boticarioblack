@echo off
echo ========================================
echo   ENVIAR PROJETO PARA GITHUB
echo ========================================
echo.
echo Repositorio: https://github.com/contavercelchz-alt/botiboti2k26
echo.
pause

echo.
echo Configurando repositorio local...
git config user.name "contavercelchz-alt"
git config user.email "contavercelchz.alt@gmail.com"

echo.
echo Verificando remote...
git remote remove origin 2>nul
git remote add origin https://github.com/contavercelchz-alt/botiboti2k26.git

echo.
echo ========================================
echo   ENVIANDO CODIGO...
echo ========================================
echo.
echo Uma janela de autenticacao vai abrir.
echo FACA LOGIN COM: contavercelchz-alt
echo.
git push -u origin main --force

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo   SUCESSO! Codigo enviado!
    echo.
    echo   Acesse: https://github.com/contavercelchz-alt/botiboti2k26
    echo.
    echo   Agora voce pode:
    echo   - Conectar na Vercel
    echo   - Fazer deploy automatico
) else (
    echo   ERRO ao enviar!
    echo.
    echo   Se der erro de autenticacao:
    echo   1. Execute: LOGIN-GITHUB-NOVA-CONTA.bat
    echo   2. Faca login no navegador
    echo   3. Execute este script novamente
)
echo ========================================
echo.
pause
