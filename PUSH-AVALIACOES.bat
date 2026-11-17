@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   ADICIONANDO AVALIACOES DE CLIENTES
echo ========================================================
echo.
echo Sistema de Avaliacoes Fake implementado com sucesso!
echo.
echo ✅ Criados 3 depoimentos para cada produto (84 avaliacoes!)
echo ✅ Avaliações realistas com nomes brasileiros
echo ✅ Notas entre 4 e 5 estrelas
echo ✅ Comentarios detalhados e convincentes
echo ✅ Badge "Compra Verificada"
echo ✅ Sistema de media de avaliacoes
echo ✅ Grafico de distribuicao de estrelas
echo ✅ Botao "Ver todas as avaliacoes"
echo.
echo Produtos com avaliacoes (IDs 80-107):
echo - Uomini Black, Floratta Red, Egeo Choc
echo - Clash, Cuide-se Bem Deleite, Malbec Gold
echo - Malbec 3 Itens, Coffee Woman, Lily Cuidados
echo - Nativa Ameixa, Celebre, Lily Acetinado
echo - Elysee, Celebre Fem, Lily Edp, Zaad
echo - Body Splash, Egeo Blue, Nativa Jasmim
echo - Liz Sublime, Portinari, Arbo
echo - Nativa Uva Merlot, Egeo Dolce
echo - Malbec EDP, Her Code, Liz Tradicional
echo.
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .
if errorlevel 1 git add .

echo.
echo [2/3] Criando commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Adicionado sistema de avaliacoes fake para produtos Natal 2026 (3 reviews cada)"
if errorlevel 1 git commit -m "Adicionado sistema de avaliacoes fake para produtos Natal 2026 (3 reviews cada)"

echo.
echo [3/3] Enviando para GitHub...
"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 git push

echo.
echo ========================================================
echo   PUSH CONCLUIDO COM SUCESSO!
echo ========================================================
echo.
echo O que foi adicionado:
echo.
echo 📁 src/data/productReviews.js
echo    - 84 avaliacoes fake (3 por produto)
echo    - Nomes brasileiros realistas
echo    - Comentarios convincentes
echo.
echo 📁 src/components/CustomerReviews.jsx
echo    - Componente de exibicao de reviews
echo    - Media de avaliacoes
echo    - Grafico de distribuicao
echo    - Botao "Ver mais"
echo.
echo 📁 src/pages/ProductDetail.jsx
echo    - Integrado componente de reviews
echo    - Exibe antes dos produtos relacionados
echo.
echo Apos o deploy (2-3 minutos):
echo 1. Pressione Ctrl+F5 no navegador
echo 2. Entre em qualquer produto de Natal
echo 3. Role a pagina ate "Avaliacoes de Clientes"
echo 4. Veja as avaliacoes com estrelas e comentarios!
echo.
pause
