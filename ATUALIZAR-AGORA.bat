@echo off
echo ====================================
echo CORRIGINDO ERRO E ATUALIZANDO SITE
echo ====================================
echo.

git add .
git commit -m "Corrigido erro de sintaxe - faltava virgula no produto 79"
git push

echo.
echo ====================================
echo PUSH CONCLUIDO!
echo ====================================
echo.
echo Aguarde 2-3 minutos e seu site estara atualizado!
echo.
pause
