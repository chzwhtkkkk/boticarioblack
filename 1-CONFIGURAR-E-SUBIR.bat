@echo off
color 0A
echo ================================================
echo   PASSO 1: CONFIGURAR GIT
echo ================================================
echo.

REM Configurar Git
git config --global user.name "Black Friday Store"
git config --global user.email "blackfriday@store.com"

echo [OK] Git configurado!
echo.

echo ================================================
echo   PASSO 2: INICIALIZAR REPOSITORIO
echo ================================================
echo.

REM Inicializar Git
git init

echo [OK] Repositorio inicializado!
echo.

echo ================================================
echo   PASSO 3: ADICIONAR ARQUIVOS
echo ================================================
echo.

REM Adicionar todos os arquivos
git add .

echo [OK] Arquivos adicionados!
echo.

echo ================================================
echo   PASSO 4: FAZER COMMIT
echo ================================================
echo.

REM Fazer primeiro commit
git commit -m "Black Friday 2024 - Deploy inicial"

echo [OK] Commit realizado!
echo.

echo ================================================
echo   PROXIMO PASSO
echo ================================================
echo.
echo Agora voce precisa:
echo.
echo 1. Criar conta no GitHub (se nao tem):
echo    https://github.com/signup
echo.
echo 2. Criar repositorio:
echo    https://github.com/new
echo    Nome: loja-boticario-black-friday
echo    NAO marque nenhuma opcao
echo    Clique "Create repository"
echo.
echo 3. Na proxima tela, copie a URL que aparece
echo    Exemplo: https://github.com/SEU_USUARIO/loja-boticario-black-friday.git
echo.
echo 4. Execute o arquivo: 2-CONECTAR-GITHUB.bat
echo    E cole a URL quando pedir
echo.
pause
