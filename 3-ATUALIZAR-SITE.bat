@echo off
color 0A
echo ================================================
echo   ATUALIZAR SITE (DEPLOY AUTOMATICO)
echo ================================================
echo.

echo Adicionando mudancas...
git add .

echo.
echo Digite uma descricao da atualizacao:
echo (ex: "atualizei produtos", "corrigi bug", etc)
set /p DESCRICAO=Descricao: 

echo.
echo Fazendo commit...
git commit -m "%DESCRICAO%"

echo.
echo Enviando para GitHub...
echo (Vercel vai detectar e atualizar automaticamente)
echo.
git push

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   SUCESSO!
    echo ================================================
    echo.
    echo Atualizacao enviada!
    echo.
    echo Agora:
    echo 1. Acesse seu dashboard Vercel
    echo 2. Veja o deploy acontecendo em tempo real
    echo 3. Aguarde 1-2 minutos
    echo 4. Site atualizado!
    echo.
) else (
    echo.
    echo [ERRO] Falha ao enviar
    echo.
    echo Pode ser que nao tenha mudancas para enviar
    echo Ou algum problema de conexao
    echo.
)

pause
