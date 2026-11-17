@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   TESTE: VERIFICANDO AVALIACOES
echo ========================================================
echo.
echo Verificando se os arquivos foram criados corretamente...
echo.

if exist "src\data\productReviews.js" (
    echo ✅ productReviews.js encontrado
) else (
    echo ❌ productReviews.js NAO encontrado!
)

if exist "src\components\CustomerReviews.jsx" (
    echo ✅ CustomerReviews.jsx encontrado
) else (
    echo ❌ CustomerReviews.jsx NAO encontrado!
)

echo.
echo Verificando se foi feito commit e push...
echo.

"C:\Program Files\Git\cmd\git.exe" log --oneline -1

echo.
echo ========================================================
echo   DIAGNOSTICO
echo ========================================================
echo.
echo Se os arquivos existem mas as avaliacoes nao aparecem:
echo.
echo 1. O deploy do Vercel ainda esta processando
echo    - Aguarde mais 2-3 minutos
echo.
echo 2. Cache do navegador
echo    - Pressione Ctrl+Shift+R (Chrome)
echo    - Ou Ctrl+F5 (outros navegadores)
echo    - Ou abra em modo anonimo
echo.
echo 3. Erro no build
echo    - Acesse o dashboard do Vercel
echo    - Verifique os logs de deploy
echo.
echo 4. Verificar se o produto tem ID correto
echo    - Produtos Natal 2026: IDs 80 ate 107
echo    - Abra o console do navegador (F12)
echo    - Veja se aparece algum erro
echo.
echo ========================================================
echo.
echo Quer fazer um novo push agora? (S/N)
set /p resposta=

if /i "%resposta%"=="S" (
    echo.
    echo Fazendo push...
    "C:\Program Files\Git\cmd\git.exe" add .
    "C:\Program Files\Git\cmd\git.exe" commit -m "Fix: Verificacao de avaliacoes" --allow-empty
    "C:\Program Files\Git\cmd\git.exe" push
    echo.
    echo Push concluido! Aguarde 2-3 minutos e limpe o cache.
)

echo.
pause
