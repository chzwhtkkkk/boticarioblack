@echo off
echo Renomeando imagens para remover espacos...
cd public\images\black26

rem Renomear Coffee Woman
if exist "Kit Presente Feminino Coffee Woman Seduction O Boticário 1.webp" ren "Kit Presente Feminino Coffee Woman Seduction O Boticário 1.webp" "kit-coffee-woman-seduction.webp"

rem Renomear Lily Cuidados
if exist "Kit Presente Feminino Natal Lily Cuidados 2 itens  1.webp" ren "Kit Presente Feminino Natal Lily Cuidados 2 itens  1.webp" "kit-lily-cuidados.webp"

rem Renomear Lily Acetinado
if exist "Kit Presente Lily Acetinado Natal 2026 2 itens.webp" ren "Kit Presente Lily Acetinado Natal 2026 2 itens.webp" "kit-lily-acetinado.webp"

rem Renomear Liz Tradicional
if exist "Kit Presente Liz Tradicional Natal 3 itens.webp" ren "Kit Presente Liz Tradicional Natal 3 itens.webp" "kit-liz-tradicional.webp"

rem Renomear Malbec Eau De Parfum
if exist "Kit Presente Masculino Malbec Eau De Parfum 3 itens.webp" ren "Kit Presente Masculino Malbec Eau De Parfum 3 itens.webp" "kit-malbec-edp.webp"

rem Renomear Clash
if exist "Kit Presente Masculino Perfume Clash 2 itens.webp" ren "Kit Presente Masculino Perfume Clash 2 itens.webp" "kit-clash.webp"

rem Renomear Cuide-se Bem
if exist "Kit Presente Natal Body Splash Cuide-se Bem 3 itens.webp" ren "Kit Presente Natal Body Splash Cuide-se Bem 3 itens.webp" "kit-cuide-se-bem-splash.webp"

rem Renomear Celebre Feminino
if exist "Kit Presente Natal Celebre Feminino 2 itens.webp" ren "Kit Presente Natal Celebre Feminino 2 itens.webp" "kit-celebre-feminino.webp"

rem Renomear Liz Sublime
if exist "Kit Presente Natal Perfume Liz Sublime 2 itens.webp" ren "Kit Presente Natal Perfume Liz Sublime 2 itens.webp" "kit-liz-sublime.webp"

cd ..\..\..
echo.
echo Imagens renomeadas com sucesso!
echo.
pause
