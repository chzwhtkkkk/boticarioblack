@echo off
chcp 65001 >nul
cls
echo.
echo ==========================================
echo   CORRIGINDO IMAGENS DOS PRODUTOS
echo ==========================================
echo.
echo Produtos corrigidos:
echo - Uomini Black Natal 2026
echo - Floratta Red (Lata Decorada)
echo - Egeo Choc
echo - Malbec Gold 3 Itens
echo - Cuide-se Bem Deleite 4 itens
echo.
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/3] Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .
if errorlevel 1 git add .

echo.
echo [2/3] Criando commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Corrigido nomes completos das imagens - Cuide-se Bem Deleite e outros"
if errorlevel 1 git commit -m "Corrigido nomes completos das imagens - Cuide-se Bem Deleite e outros"

echo.
echo [3/3] Enviando para GitHub...
"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 git push

echo.
echo ==========================================
echo   PUSH CONCLUIDO!
echo ==========================================
echo.
echo O que fazer agora:
echo 1. Aguarde 2-3 minutos
echo 2. Acesse seu site no Vercel
echo 3. Pressione Ctrl+F5 para limpar o cache
echo 4. As imagens devem aparecer corretamente
echo.
pause
