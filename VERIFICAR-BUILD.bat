@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   VERIFICANDO BUILD LOCAL
echo ========================================================
echo.
echo Testando se o projeto compila localmente...
echo.

cd /d "%~dp0"

echo Limpando cache do npm...
npm cache clean --force

echo.
echo Instalando dependencias...
npm install

echo.
echo Tentando fazer build...
npm run build

echo.
echo ========================================================
if errorlevel 1 (
    echo   BUILD FALHOU!
    echo ========================================================
    echo.
    echo Verifique os erros acima.
    echo O erro pode estar em:
    echo - productReviews.js
    echo - CustomerReviews.jsx  
    echo - ProductDetail.jsx
    echo.
) else (
    echo   BUILD PASSOU!
    echo ========================================================
    echo.
    echo O build local funcionou!
    echo O erro pode ser especifico do Vercel.
    echo.
    echo Tente:
    echo 1. Fazer um novo push vazio
    echo 2. Verificar as variaveis de ambiente no Vercel
    echo.
)

pause
