@echo off
cls
echo ========================================
echo   ENVIAR PARA GITHUB - RAPIDO
echo ========================================
echo.
echo Repositorio: https://github.com/contavercelchz-alt/botiboti2k26
echo.
echo ========================================
echo   CRIAR TOKEN (SO 1 VEZ)
echo ========================================
echo.
echo 1. Faca login em: contavercelchz-alt
echo 2. Abra: https://github.com/settings/tokens/new
echo 3. Em "Note": coloque "Deploy Boticario"
echo 4. Em "Expiration": selecione "No expiration"
echo 5. MARQUE APENAS: [x] repo (isso ja marca tudo dentro)
echo 6. Clique em "Generate token" (botao verde no fim)
echo 7. COPIE o token (comeca com ghp_...)
echo.
echo ========================================
echo.
set /p TOKEN="Cole o token aqui: "

if "%TOKEN%"=="" (
    echo.
    echo ERRO: Voce precisa colar o token!
    pause
    exit /b 1
)

echo.
echo Configurando Git...
git config user.name "contavercelchz-alt"
git config user.email "contavercelchz.alt@gmail.com"
git remote remove origin 2>nul
git remote add origin https://%TOKEN%@github.com/contavercelchz-alt/botiboti2k26.git

echo.
echo Enviando codigo...
git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   SUCESSO! ✓
    echo ========================================
    echo.
    echo Codigo enviado para:
    echo https://github.com/contavercelchz-alt/botiboti2k26
    echo.
    echo PROXIMOS PASSOS:
    echo 1. Acesse: https://vercel.com
    echo 2. Import Project
    echo 3. Selecione: botiboti2k26
    echo 4. Configure as variaveis de ambiente
    echo 5. Deploy!
    echo.
) else (
    echo ========================================
    echo   ERRO! ✗
    echo ========================================
    echo.
    echo Verifique se:
    echo - O token esta correto
    echo - O repositorio existe no GitHub
    echo - Voce marcou "repo" ao criar o token
    echo.
)
pause
