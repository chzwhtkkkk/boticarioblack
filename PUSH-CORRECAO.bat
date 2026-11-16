@echo off
echo ====================================
echo CORRIGINDO E FAZENDO PUSH
echo ====================================
echo.

REM Define o caminho completo do Git
set GIT_PATH=C:\Program Files\Git\cmd\git.exe

REM Verifica se o Git existe
if not exist "%GIT_PATH%" (
    echo Git nao encontrado em: %GIT_PATH%
    echo Tentando com git global...
    git add .
    git commit -m "Corrigido erro de sintaxe - faltava virgula no produto 79"
    git push
) else (
    echo Usando Git em: %GIT_PATH%
    "%GIT_PATH%" add .
    "%GIT_PATH%" commit -m "Corrigido erro de sintaxe - faltava virgula no produto 79"
    "%GIT_PATH%" push
)

echo.
echo ====================================
echo CONCLUIDO!
echo ====================================
echo.
echo Aguarde 2-3 minutos para o Vercel atualizar o site!
echo.
pause
