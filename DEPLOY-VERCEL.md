# 🚀 DEPLOY BLACK FRIDAY - VERCEL

## 📋 MÉTODO 1: VERCEL CLI (Mais Rápido)

### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Passo 2: Fazer Login
```bash
vercel login
```
- Escolha seu método de login (GitHub, GitLab, Email)
- Siga as instruções no navegador

### Passo 3: Deploy
```bash
cd C:\Users\chz\Documents\oboticario.revendasss-main
vercel --prod
```

**Pronto!** A Vercel vai:
1. ✅ Fazer build do projeto
2. ✅ Fazer upload
3. ✅ Te dar o link do site

---

## 📋 MÉTODO 2: VERCEL WEBSITE (Mais Fácil)

### Passo 1: Criar Build Local
```bash
cd C:\Users\chz\Documents\oboticario.revendasss-main
npm run build
```
Isso cria a pasta `dist/` com o site pronto.

### Passo 2: Fazer Upload na Vercel
1. Acesse: https://vercel.com
2. Clique em "Add New" → "Project"
3. Clique em "Browse" ou arraste a pasta `dist`
4. Clique em "Deploy"

**Pronto!** Site no ar em segundos! ✨

---

## 📋 MÉTODO 3: GITHUB + VERCEL (Recomendado)

### Passo 1: Subir para o GitHub

#### Se ainda não tem repositório:
```bash
cd C:\Users\chz\Documents\oboticario.revendasss-main
git init
git add .
git commit -m "Black Friday 2024 - Deploy inicial"
```

#### Criar repositório no GitHub:
1. Vá em https://github.com/new
2. Crie um repositório (ex: "loja-boticario-black-friday")
3. **NÃO** marque "Add README"
4. Copie os comandos que aparecem

#### Conectar e subir:
```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git branch -M main
git push -u origin main
```

### Passo 2: Conectar com Vercel
1. Acesse: https://vercel.com
2. Clique em "Add New" → "Project"
3. Clique em "Import Git Repository"
4. Escolha seu repositório
5. Clique em "Deploy"

**Vantagens:**
- ✅ Deploy automático a cada commit
- ✅ Preview de branches
- ✅ Rollback fácil
- ✅ Histórico de versões

---

## ⚙️ CONFIGURAÇÕES IMPORTANTES

### Variáveis de Ambiente
Se você tem `.env`, adicione na Vercel:

1. No dashboard do projeto
2. Settings → Environment Variables
3. Adicione cada variável

**Exemplo:**
```
VITE_API_URL=sua_url_api
VITE_PIXEL_ID=seu_pixel_id
```

### Build Settings (já configurado automaticamente)
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

## 🔧 TROUBLESHOOTING

### Erro: "Command not found: npm"
**Solução:**
```bash
# Instale o Node.js
https://nodejs.org
# Reinicie o terminal
```

### Erro: "vercel: command not found"
**Solução:**
```bash
npm install -g vercel
# Se der erro de permissão no Windows:
# Execute o PowerShell como Administrador
```

### Erro: "Build failed"
**Solução:**
```bash
# Teste o build local primeiro
npm run build

# Se funcionar local, problema é na Vercel
# Verifique logs no dashboard
```

### Erro: "Routes not working" (404 em rotas)
**Solução:** Já está configurado no `vercel.json`! ✅

### Erro: "Images not loading"
**Solução:**
1. Verifique se as imagens estão em `/public/images/`
2. Caminhos devem ser relativos: `/images/black26/...`
3. Não use caminhos absolutos do Windows

---

## 🎯 CHECKLIST PRÉ-DEPLOY

### Antes de fazer deploy:

- [ ] Testei o site localmente
- [ ] Build funciona: `npm run build`
- [ ] Preview funciona: `npm run preview`
- [ ] Imagens carregam
- [ ] Links funcionam
- [ ] Checkout funciona
- [ ] Não há erros no console
- [ ] Removi console.logs de desenvolvimento
- [ ] Atualizei variáveis de ambiente (se necessário)

---

## 📊 PÓS-DEPLOY

### Após o deploy:

1. **Teste o site em produção**
   - Abra o link que a Vercel te deu
   - Teste todas as páginas
   - Teste no mobile

2. **Configure domínio customizado (opcional)**
   - No dashboard Vercel
   - Settings → Domains
   - Adicione seu domínio

3. **Configure Analytics**
   - Vercel Analytics (grátis)
   - Google Analytics
   - Facebook Pixel

4. **Compartilhe o link!**
   - WhatsApp
   - Instagram
   - Facebook
   - E-mail marketing

---

## 🚀 DEPLOY RÁPIDO - RESUMO

### Opção mais rápida (CLI):
```bash
# 1. Instalar Vercel
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd C:\Users\chz\Documents\oboticario.revendasss-main
vercel --prod
```

### Opção mais fácil (Website):
```bash
# 1. Build
npm run build

# 2. Upload
# Arraste a pasta "dist" em vercel.com
```

---

## 🌐 DOMÍNIO CUSTOMIZADO

### Se você tem um domínio:

1. No dashboard Vercel:
   - Settings → Domains
   - Add Domain

2. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. Aguarde propagação (até 48h)

---

## 📈 MONITORAMENTO

### URLs importantes:

- **Dashboard:** https://vercel.com/dashboard
- **Analytics:** https://vercel.com/analytics
- **Logs:** Clique no projeto → Deployments → View Logs

### Métricas para acompanhar:

- ✅ Visitas diárias
- ✅ Produtos mais visualizados
- ✅ Taxa de conversão
- ✅ Tempo de carregamento
- ✅ Erros 404

---

## 🎉 APÓS O DEPLOY

### Compartilhe seu link!

**Mensagem sugerida:**
```
🖤 BLACK FRIDAY O BOTICÁRIO 2024

🔥 ATÉ 75% DE DESCONTO
🚚 FRETE GRÁTIS
⚡ Ofertas por tempo limitado

Acesse agora: [SEU_LINK]

#BlackFriday #OBoticário #Ofertas
```

---

**Pronto para fazer o deploy?**

Me avisa qual método você quer usar que eu te ajudo! 🚀

