# 🚀 GITHUB + VERCEL - DEPLOY AUTOMÁTICO

## 🎯 O QUE VAMOS FAZER

Configurar para que **toda vez que você atualizar o código**, o site atualiza automaticamente!

**Como funciona:**
1. Você faz mudanças no código
2. Dá `git push` (sobe pro GitHub)
3. Vercel detecta e faz deploy automático
4. Site atualizado! ✨

---

## 📋 PASSO A PASSO COMPLETO

### PASSO 1: INSTALAR GIT

#### 1.1 Download
1. Acesse: https://git-scm.com/download/win
2. Clique em "Click here to download"
3. Aguarde download (aprox. 50 MB)

#### 1.2 Instalação
1. **Clique 2x** no arquivo baixado
2. **Tela 1:** Clique "Next"
3. **Tela 2:** Deixe tudo marcado, clique "Next"
4. **Tela 3:** Editor padrão - escolha "Use Visual Studio Code" ou deixe Vim
5. **Tela 4:** "Let Git decide" - Clique "Next"
6. **Tela 5:** "Git from the command line and also from 3rd-party software" - Clique "Next"
7. **Telas seguintes:** Deixe tudo padrão, clique "Next"
8. Clique "Install"
9. Aguarde instalação
10. **Desmarque** "View Release Notes"
11. Clique "Finish"

#### 1.3 Verificar
Feche e abra um **NOVO** PowerShell:
```bash
git --version
```
Deve aparecer: `git version 2.x.x`

---

### PASSO 2: CRIAR CONTA GITHUB (se não tem)

1. Acesse: https://github.com/signup
2. Digite seu email
3. Crie uma senha
4. Escolha um username
5. Confirme email
6. **Pronto!** Conta criada ✅

---

### PASSO 3: CONFIGURAR GIT LOCAL

Abra PowerShell e digite:

```bash
# Configurar seu nome
git config --global user.name "Seu Nome Aqui"

# Configurar seu email (use o mesmo do GitHub)
git config --global user.email "seuemail@exemplo.com"

# Verificar
git config --list
```

---

### PASSO 4: CRIAR REPOSITÓRIO NO GITHUB

1. Acesse: https://github.com/new
2. **Repository name:** `loja-boticario-black-friday`
3. **Description:** (opcional) "Loja O Boticário Black Friday 2024"
4. **Deixe PÚBLICO** (ou Privado, sua escolha)
5. **NÃO marque** "Add a README file"
6. **NÃO marque** "Add .gitignore"
7. **NÃO marque** "Choose a license"
8. Clique **"Create repository"**

#### 4.1 Copiar comandos
Na próxima tela, **copie os comandos** que aparecem em:
**"…or push an existing repository from the command line"**

Vai ser algo assim:
```bash
git remote add origin https://github.com/SEU_USUARIO/loja-boticario-black-friday.git
git branch -M main
git push -u origin main
```

**NÃO EXECUTE AINDA!** Vamos preparar o projeto primeiro.

---

### PASSO 5: PREPARAR PROJETO PARA GITHUB

#### 5.1 Criar .gitignore
Abra PowerShell na pasta do projeto e digite:

```bash
cd C:\Users\chz\Documents\oboticario.revendasss-main
```

Vou criar o arquivo .gitignore para você (já está pronto abaixo).

#### 5.2 Inicializar Git
```bash
git init
```

#### 5.3 Adicionar arquivos
```bash
git add .
```

#### 5.4 Primeiro commit
```bash
git commit -m "Black Friday 2024 - Deploy inicial"
```

#### 5.5 Conectar com GitHub
**COLE os comandos que você copiou** do GitHub:
```bash
git remote add origin https://github.com/SEU_USUARIO/loja-boticario-black-friday.git
git branch -M main
git push -u origin main
```

**OBS:** Na primeira vez, vai pedir para fazer login no GitHub:
- Escolha "Sign in with your browser"
- Faça login
- Autorize Git
- Volte pro terminal

---

### PASSO 6: CONECTAR VERCEL AO GITHUB

#### 6.1 Acessar Vercel
1. Acesse: https://vercel.com
2. Clique "Sign Up" ou "Log In"
3. Escolha **"Continue with GitHub"**
4. Faça login no GitHub
5. Autorize Vercel

#### 6.2 Importar Repositório
1. Clique "Add New" → "Project"
2. Clique "Import Git Repository"
3. Se não aparecer seu repositório:
   - Clique "Adjust GitHub App Permissions"
   - Selecione seu repositório
   - Clique "Install"
4. Agora clique "Import" no seu repositório
5. **Project Name:** deixe o padrão ou mude
6. **Framework Preset:** Vite (deve detectar automaticamente)
7. **Build Command:** `npm run build` (já vem preenchido)
8. **Output Directory:** `dist` (já vem preenchido)
9. Clique **"Deploy"**

#### 6.3 Aguardar Deploy
- Vai aparecer uns foguetes voando 🚀
- Aguarde 2-3 minutos
- Quando terminar: **"Congratulations! Your project has been deployed"**
- Clique no link que aparece

**🎉 SEU SITE ESTÁ NO AR!**

---

## ⚡ COMO USAR DEPOIS DE CONFIGURADO

### Workflow diário:

#### 1. Fazer mudanças no código
Edite os arquivos que quiser.

#### 2. Ver o que mudou
```bash
git status
```

#### 3. Adicionar mudanças
```bash
git add .
```

#### 4. Fazer commit
```bash
git commit -m "Descrição da mudança"
```

#### 5. Enviar para GitHub
```bash
git push
```

**PRONTO!** Vercel detecta automaticamente e faz deploy! ✨

---

## 🎯 COMANDOS ÚTEIS

### Verificar status:
```bash
git status
```

### Ver histórico:
```bash
git log --oneline
```

### Ver diferenças:
```bash
git diff
```

### Criar branch nova:
```bash
git checkout -b nome-da-branch
```

### Voltar para main:
```bash
git checkout main
```

### Puxar atualizações:
```bash
git pull
```

---

## 🔧 CONFIGURAÇÕES EXTRAS NA VERCEL

### Domínio Customizado
1. Dashboard Vercel → Seu Projeto
2. Settings → Domains
3. Add Domain
4. Digite seu domínio
5. Configure DNS conforme instruções

### Variáveis de Ambiente
1. Dashboard Vercel → Seu Projeto
2. Settings → Environment Variables
3. Add New
4. Nome: `VITE_API_URL` (exemplo)
5. Value: seu valor
6. Save

### Analytics
1. Dashboard Vercel → Seu Projeto
2. Analytics → Enable
3. Grátis até 100k page views/mês

---

## 📊 MONITORAR DEPLOYS

### Ver deploys:
1. Dashboard Vercel → Seu Projeto
2. Aba "Deployments"
3. Veja histórico de todos os deploys

### Ver logs:
1. Clique em um deploy
2. "View Function Logs"
3. Veja erros e avisos

### Preview de branches:
Quando você criar uma branch e fizer push:
```bash
git checkout -b nova-feature
git add .
git commit -m "Nova feature"
git push -u origin nova-feature
```

Vercel cria um link de preview automático! 🎉

---

## 🐛 TROUBLESHOOTING

### Erro: "git: command not found"
**Solução:** Instale Git e reinicie o terminal

### Erro: "Permission denied (publickey)"
**Solução:** Configure SSH ou use HTTPS
```bash
git remote set-url origin https://github.com/SEU_USUARIO/REPO.git
```

### Erro: "Nothing to commit"
**Solução:** Você precisa fazer mudanças primeiro
```bash
git status  # Ver arquivos modificados
```

### Erro no deploy Vercel
**Solução:** 
1. Veja logs no dashboard
2. Verifique se `npm run build` funciona local
3. Verifique variáveis de ambiente

---

## ✅ CHECKLIST COMPLETO

### Instalação:
- [ ] Git instalado
- [ ] Conta GitHub criada
- [ ] Git configurado (name e email)
- [ ] Conta Vercel criada

### Configuração:
- [ ] Repositório criado no GitHub
- [ ] Projeto inicializado (git init)
- [ ] Primeiro commit feito
- [ ] Push para GitHub funcionando
- [ ] Vercel conectado ao GitHub
- [ ] Primeiro deploy feito

### Teste:
- [ ] Site no ar e funcionando
- [ ] Fiz uma mudança pequena
- [ ] Fiz commit e push
- [ ] Deploy automático funcionou

---

## 🎉 PRONTO!

Agora você tem deploy automático! 

**Workflow:**
1. Edita código → 2. `git push` → 3. Site atualiza sozinho! ✨

---

## 📚 RECURSOS EXTRAS

### Aprender Git:
- https://git-scm.com/book/pt-br/v2
- https://learngitbranching.js.org/?locale=pt_BR

### Aprender GitHub:
- https://docs.github.com/pt
- https://lab.github.com

### Documentação Vercel:
- https://vercel.com/docs

---

**Dúvidas? Me chama! 🚀**

