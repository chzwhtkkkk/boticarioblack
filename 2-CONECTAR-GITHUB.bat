@echo off
color 0A
echo ================================================
echo   CONECTAR COM GITHUB
echo ================================================
echo.
echo Cole a URL do seu repositorio GitHub:
echo Exemplo: https://github.com/SEU_USUARIO/loja-boticario-black-friday.git
echo.
set /p REPO_URL=URL: 

echo.
echo Conectando com GitHub...
git remote add origin %REPO_URL%

echo.
echo Mudando para branch main...
git branch -M main

echo.
echo Enviando codigo para GitHub...
echo (Pode pedir login - escolha "Sign in with browser")
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo   SUCESSO! CODIGO NO GITHUB!
    echo ================================================
    echo.
    echo Agora vamos conectar com Vercel:
    echo.
    echo 1. Acesse: https://vercel.com
    echo 2. Clique "Sign Up"
    echo 3. Escolha "Continue with GitHub"
    echo 4. Faca login no GitHub
    echo 5. Autorize Vercel
    echo 6. Clique "Add New" -^> "Project"
    echo 7. Clique "Import" no repositorio: loja-boticario-black-friday
    echo 8. Clique "Deploy"
    echo 9. Aguarde 2-3 minutos
    echo.
    echo PRONTO! Site no ar com deploy automatico!
    echo.
    echo Para atualizar depois, use: 3-ATUALIZAR-SITE.bat
    echo.
) else (
    echo.
    echo ================================================
    echo   ERRO AO ENVIAR
    echo ================================================
    echo.
    echo Verifique:
    echo - URL esta correta?
    echo - Tem conta no GitHub?
    echo - Criou o repositorio?
    echo.
    echo Tente novamente ou me chame!
    echo.
)

pause
