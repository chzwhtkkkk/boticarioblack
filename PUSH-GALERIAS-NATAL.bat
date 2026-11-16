@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo   ADICIONANDO MULTIPLAS IMAGENS AOS PRODUTOS NATAL 2026
echo ========================================================
echo.
echo Produtos com galerias de imagens (3 a 6 fotos cada):
echo.
echo - 80: Uomini Black (4 imagens)
echo - 81: Floratta Red Lata (4 imagens)
echo - 82: Egeo Choc (4 imagens)
echo - 83: Clash (3 imagens)
echo - 84: Cuide-se Bem Deleite (3 imagens)
echo - 85: Malbec Gold (5 imagens)
echo - 86: Floratta Red Passion + Nativa (4 imagens)
echo - 87: Malbec 3 Itens (4 imagens)
echo - 88: Coffee Woman (4 imagens)
echo - 89: Lily Cuidados (4 imagens)
echo - 90: Nativa Ameixa Negra (4 imagens)
echo - 91: Celebre Masculino (4 imagens)
echo - 92: Lily Acetinado (3 imagens)
echo - 93: Elysee (4 imagens)
echo - 94: Celebre Feminino (5 imagens)
echo - 95: Lily Edp (3 imagens)
echo - 96: Zaad (4 imagens)
echo - 97: Body Splash Cuide-se Bem (3 imagens)
echo - 98: Egeo Blue (4 imagens)
echo - 99: Nativa Jasmim (3 imagens)
echo - 100: Liz Sublime (3 imagens)
echo - 101: Portinari (3 imagens)
echo - 102: Arbo (5 imagens)
echo - 103: Nativa Uva Merlot (4 imagens)
echo - 104: Egeo Dolce (3 imagens)
echo - 105: Malbec EDP (6 imagens)
echo - 106: Her Code (5 imagens)
echo - 107: Liz Tradicional (3 imagens)
echo.
echo TOTAL: 28 produtos com galerias multiplas!
echo.
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .
if errorlevel 1 git add .

echo.
echo [2/3] Criando commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Adicionadas galerias multiplas de imagens para produtos Natal 2026 (3-6 fotos cada)"
if errorlevel 1 git commit -m "Adicionadas galerias multiplas de imagens para produtos Natal 2026 (3-6 fotos cada)"

echo.
echo [3/3] Enviando para GitHub...
"C:\Program Files\Git\cmd\git.exe" push
if errorlevel 1 git push

echo.
echo ========================================================
echo   PUSH CONCLUIDO COM SUCESSO!
echo ========================================================
echo.
echo O que acontece agora:
echo.
echo 1. Vercel vai detectar o push automaticamente
echo 2. Em 2-3 minutos o site sera atualizado
echo 3. Cada produto tera uma galeria de 3 a 6 fotos
echo 4. Usuarios poderao ver todas as fotos na pagina do produto
echo.
echo Apos o deploy:
echo - Pressione Ctrl+F5 no navegador para limpar cache
echo - Clique em qualquer produto de Natal
echo - Veja a galeria de imagens na pagina de detalhes!
echo.
pause
