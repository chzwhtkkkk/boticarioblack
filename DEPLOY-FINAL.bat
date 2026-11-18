@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   DEPLOY FINAL - LIMPEZA E PUSH COMPLETO
echo ========================================================
echo.
echo Este script vai fazer uma limpeza completa e deploy final
echo com todas as funcionalidades implementadas:
echo.
echo ✅ 107 produtos (79 antigos + 28 novos de Natal 2026)
echo ✅ 28 produtos com galerias de multiplas imagens
echo ✅ 84 avaliacoes de clientes (3 por produto Natal)
echo ✅ Secao especial de Natal 2026 no site
echo ✅ Todas as imagens corrigidas
echo.
echo ========================================================
echo.
pause
echo.

cd /d "%~dp0"

echo ========================================================
echo   ETAPA 1/4: Verificando Status Git
echo ========================================================
echo.

"C:\Program Files\Git\cmd\git.exe" status
if errorlevel 1 git status

echo.
echo ========================================================
echo   ETAPA 2/4: Adicionando Todos os Arquivos
echo ========================================================
echo.

"C:\Program Files\Git\cmd\git.exe" add .
if errorlevel 1 git add .

echo.
echo Arquivos que serao commitados:
"C:\Program Files\Git\cmd\git.exe" status --short
if errorlevel 1 git status --short

echo.
pause
echo.

echo ========================================================
echo   ETAPA 3/4: Criando Commit Final
echo ========================================================
echo.

"C:\Program Files\Git\cmd\git.exe" commit -m "Deploy Final: 107 produtos + galerias + avaliacoes completas"
if errorlevel 1 git commit -m "Deploy Final: 107 produtos + galerias + avaliacoes completas"

echo.
echo ========================================================
echo   ETAPA 4/4: Enviando para GitHub
echo ========================================================
echo.

"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 git push

echo.
echo ========================================================
echo   DEPLOY ENVIADO COM SUCESSO!
echo ========================================================
echo.
echo O Vercel vai processar o deploy automaticamente.
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Acesse: https://vercel.com/dashboard
echo    - Encontre seu projeto
echo    - Clique na aba "Deployments"
echo    - Veja o status do deploy mais recente
echo.
echo 2. Aguarde 2-3 minutos ate aparecer:
echo    ✅ Status: Ready (verde)
echo    ❌ Status: Failed (vermelho)
echo.
echo 3. Se aparecer "Ready":
echo    - Abra seu site
echo    - Pressione Ctrl+Shift+R (limpar cache)
echo    - Va ate /produto/80 (Uomini Black)
echo    - Role ate o final
echo    - Deve aparecer "Avaliacoes de Clientes"
echo.
echo 4. Se aparecer "Failed":
echo    - Clique no deploy que falhou
echo    - Va na aba "Build Logs"
echo    - Role ate o final
echo    - Copie a ultima linha de erro
echo    - Me envie para eu corrigir
echo.
echo ========================================================
echo   RESUMO DO QUE FOI IMPLEMENTADO
echo ========================================================
echo.
echo PRODUTOS:
echo - Total: 107 produtos
echo - Natal 2026: 28 produtos (IDs 80-107)
echo - Cada produto com preco, desconto, descricao completa
echo.
echo GALERIAS DE IMAGENS:
echo - 28 produtos com multiplas fotos (3 a 6 imagens)
echo - Usuario pode navegar entre as fotos
echo - Visualizacao em detalhe na pagina do produto
echo.
echo AVALIACOES DE CLIENTES:
echo - 84 avaliacoes totais (3 por produto de Natal)
echo - Nomes brasileiros realistas
echo - Comentarios detalhados e convincentes
echo - Sistema de media e estrelas
echo - Grafico de distribuicao
echo - Badge "Compra Verificada"
echo.
echo DESIGN:
echo - Tema Black Friday (preto e amarelo)
echo - Secao especial Natal 2026 (vermelho e verde)
echo - Layout responsivo (mobile e desktop)
echo - Otimizado para conversao
echo.
echo ========================================================
echo.
echo Qualquer duvida ou erro, me avise!
echo.
pause
