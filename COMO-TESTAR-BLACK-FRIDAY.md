# 🚀 GUIA RÁPIDO - COMO TESTAR A BLACK FRIDAY

## ✅ PASSO A PASSO SIMPLES

### 1️⃣ ABRIR O TERMINAL
- Pressione `Win + R`
- Digite `cmd` e Enter
- OU abra o PowerShell

### 2️⃣ NAVEGAR ATÉ O PROJETO
```bash
cd C:\Users\chz\Documents\oboticario.revendasss-main
```

### 3️⃣ INICIAR O SERVIDOR
```bash
npm run dev
```

**Aguarde aparecer algo como:**
```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4️⃣ ABRIR NO NAVEGADOR
- Abra o navegador (Chrome, Edge, Firefox)
- Digite na barra de endereço: `http://localhost:5173`
- Pressione Enter

---

## 👀 O QUE VERIFICAR

### ✅ Banner Superior
- Deve estar **preto** com texto **"BLACK FRIDAY"**
- Emoji 🖤 ao invés de ❤️
- Borda amarela

### ✅ Banner Hero (grande no topo)
- Fundo **preto** ao invés de verde
- Título: "🖤 BLACK FRIDAY O BOTICÁRIO"
- Botão amarelo: "Ver Ofertas Black Friday 🔥"

### ✅ Carrossel de Imagens
- Deve mostrar 3 novos banners
- Setas de navegação funcionando
- Banners com tema Black Friday

### ✅ Seção Principal
- Título: "🖤 BLACK FRIDAY | Kits e Presentes com até 75% OFF"
- Produtos exibidos normalmente
- Botão "Ver Mais Ofertas"

### ✅ Links e Hovers
- Links devem ficar **pretos** ao passar o mouse
- Badge do carrinho deve ser **preta**
- Barra de busca com borda **preta** ao focar

### ✅ Rodapé
- Ícones de pagamento atualizados
- Ícones de segurança atualizados

---

## 🐛 PROBLEMAS COMUNS

### Problema: "npm não é reconhecido"
**Solução:**
1. Instale o Node.js: https://nodejs.org
2. Reinicie o terminal
3. Tente novamente

### Problema: "Cannot find module"
**Solução:**
```bash
npm install
```

### Problema: Imagens não aparecem
**Solução:**
1. Verifique se a pasta existe: `public/images/black26/`
2. Reinicie o servidor (Ctrl+C e depois `npm run dev`)
3. Limpe cache do navegador (Ctrl+Shift+R)

### Problema: Cores ainda aparecem verdes
**Solução:**
1. Limpe cache do navegador: Ctrl+Shift+R (hard refresh)
2. Abra em aba anônima/privada
3. Reinicie o servidor

---

## 📱 TESTAR NO CELULAR

### Opção 1: Usando o mesmo WiFi
1. No terminal, procure o endereço Network
2. Vai aparecer algo como: `http://192.168.x.x:5173`
3. Abra esse endereço no celular

### Opção 2: Inspecionar como mobile
1. No Chrome, pressione F12
2. Clique no ícone de celular (Toggle device toolbar)
3. Selecione um dispositivo (iPhone, Samsung, etc)

---

## 🎨 AJUSTES FINAIS (SE NECESSÁRIO)

### Se quiser mudar algo:
1. Edite os arquivos em `src/`
2. O navegador atualiza automaticamente
3. Não precisa reiniciar o servidor

### Arquivos principais:
- `src/pages/Home.jsx` - página inicial
- `src/components/TopBanner.jsx` - banner superior
- `src/components/HeroBanner.jsx` - banner hero
- `src/components/Header.jsx` - cabeçalho

---

## 🚀 PUBLICAR (DEPLOY)

### Quando estiver tudo certo:

#### Opção 1: Netlify
```bash
npm run build
```
Depois arraste a pasta `dist` para netlify.com/drop

#### Opção 2: Vercel
```bash
npm run build
vercel --prod
```

---

## 📞 CHECKLIST FINAL

Antes de colocar no ar:

- [ ] Testei no desktop
- [ ] Testei no mobile
- [ ] Todos os banners aparecem
- [ ] Links funcionam
- [ ] Carrinho funciona
- [ ] Checkout funciona
- [ ] Imagens carregam rápido
- [ ] Não há erros no console (F12)

---

## 💡 DICAS EXTRAS

### Performance
- Imagens estão otimizadas (.webp é melhor que .png)
- Use Ctrl+Shift+R para hard refresh
- Teste em modo anônimo para evitar cache

### SEO
- Atualize o título da página (no `index.html`)
- Adicione meta description com "Black Friday"
- Use alt text nas imagens

### Conversão
- Destaque o frete grátis
- Mostre timer de contagem regressiva
- Adicione urgência ("Últimas unidades!")

---

**Pronto para testar! 🚀**

Se algo não funcionar, me avise o erro específico que eu te ajudo!

