@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   VALIDANDO ARQUIVOS ANTES DO DEPLOY
echo ========================================================
echo.

cd /d "%~dp0"

echo Verificando se os arquivos existem...
echo.

set ERRO=0

if exist "src\data\productReviews.js" (
    echo ✅ productReviews.js encontrado
) else (
    echo ❌ productReviews.js NAO encontrado!
    set ERRO=1
)

if exist "src\components\CustomerReviews.jsx" (
    echo ✅ CustomerReviews.jsx encontrado
) else (
    echo ❌ CustomerReviews.jsx NAO encontrado!
    set ERRO=1
)

if exist "src\data\productGalleries.js" (
    echo ✅ productGalleries.js encontrado
) else (
    echo ❌ productGalleries.js NAO encontrado!
    set ERRO=1
)

if exist "src\pages\ProductDetail.jsx" (
    echo ✅ ProductDetail.jsx encontrado
) else (
    echo ❌ ProductDetail.jsx NAO encontrado!
    set ERRO=1
)

echo.
echo Verificando sintaxe dos arquivos JavaScript...
echo.

node --check src\data\productReviews.js 2>nul
if errorlevel 1 (
    echo ❌ ERRO DE SINTAXE em productReviews.js
    node --check src\data\productReviews.js
    set ERRO=1
) else (
    echo ✅ productReviews.js sem erros de sintaxe
)

node --check src\data\productGalleries.js 2>nul
if errorlevel 1 (
    echo ❌ ERRO DE SINTAXE em productGalleries.js
    node --check src\data\productGalleries.js
    set ERRO=1
) else (
    echo ✅ productGalleries.js sem erros de sintaxe
)

echo.
echo ========================================================

if %ERRO%==0 (
    echo   TUDO OK! Pode fazer push com seguranca
    echo ========================================================
    echo.
    echo Execute: .\FORCAR-DEPLOY.bat
) else (
    echo   ERROS ENCONTRADOS!
    echo ========================================================
    echo.
    echo Corrija os erros acima antes de fazer push.
)

echo.
pause
