# ⚡ GITHUB + VERCEL - GUIA RÁPIDO

## 🎯 5 PASSOS SIMPLES

### PASSO 1: INSTALAR GIT (5 min)
1. Baixe: https://git-scm.com/download/win
2. Instale (deixe tudo padrão)
3. Feche e abra novo PowerShell
4. Teste: `git --version`

✅ **Funcionou?** Próximo passo!

---

### PASSO 2: CONFIGURAR GIT (2 min)

Abra PowerShell e digite:

```bash
# Seu nome
git config --global user.name "Seu Nome"

# Seu email (mesmo do GitHub)
git config --global user.email "seu@email.com"
```

✅ **Pronto!** Git configurado!

---

### PASSO 3: CRIAR CONTA GITHUB (3 min)

1. Acesse: https://github.com/signup
2. Crie conta (grátis)
3. Confirme email

✅ **Conta criada!**

---

### PASSO 4: SUBIR CÓDIGO (5 min)

#### 4.1 Criar repositório GitHub:
1. Acesse: https://github.com/new
2. Nome: `loja-boticario-black-friday`
3. **NÃO MARQUE NADA**
4. Clique "Create repository"
5. **DEIXE A PÁGINA ABERTA** (vamos usar depois)

#### 4.2 No PowerShell do projeto:
```bash
# Entrar na pasta
cd C:\Users\chz\Documents\oboticario.revendasss-main

# Inicializar Git
git init

# Adicionar arquivos
git add .

# Primeiro commit
git commit -m "Black Friday 2024"

# Conectar com GitHub (COLE A URL DO SEU REPO)
git remote add origin https://github.com/SEU_USUARIO/loja-boticario-black-friday.git

# Enviar
git branch -M main
git push -u origin main
```

**Vai pedir login no GitHub:**
- Escolha "Sign in with browser"
- Faça login
- Volte pro PowerShell

✅ **Código no GitHub!**

---

### PASSO 5: CONECTAR VERCEL (5 min)

1. Acesse: https://vercel.com
2. Clique "Sign Up"
3. Escolha **"Continue with GitHub"**
4. Autorize Vercel
5. Clique "Add New" → "Project"
6. Clique "Import" no seu repositório
7. Clique "Deploy"
8. **AGUARDE** (2-3 min)

🎉 **SITE NO AR!**

---

## ⚡ ATUALIZAR O SITE (Depois de configurado)

### Sempre que fizer mudanças:

```bash
# Ver o que mudou
git status

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição da mudança"

# Enviar (site atualiza automático!)
git push
```

**PRONTO!** Vercel detecta e atualiza o site sozinho! ✨

---

## 🎯 SCRIPT AUXILIAR

**Ou use o menu interativo:**

Clique 2x: `SETUP-GITHUB.bat`

Ele te guia por todos os passos! 🚀

---

## ⏱️ TEMPO TOTAL

- Instalar Git: **5 min**
- Configurar: **2 min**
- Criar conta: **3 min**
- Subir código: **5 min**
- Conectar Vercel: **5 min**

**TOTAL: ~20 minutos** para configurar

**Depois:** 30 segundos para atualizar! ⚡

---

## 🆘 PROBLEMAS COMUNS

### "git: command not found"
→ Instale Git e **feche/abra novo PowerShell**

### "Permission denied"
→ Faça login no GitHub quando pedir

### "Repository not found"
→ Verifique se a URL está correta

### Deploy falhou na Vercel
→ Verifique se `npm run build` funciona local

---

## ✅ CHECKLIST

- [ ] Git instalado
- [ ] Git configurado (name + email)
- [ ] Conta GitHub criada
- [ ] Repositório criado no GitHub
- [ ] Código enviado (`git push`)
- [ ] Vercel conectado
- [ ] Site no ar! 🎉

---

## 🎉 PRONTO!

**Agora você tem:**
- ✅ Código versionado (Git)
- ✅ Backup automático (GitHub)
- ✅ Deploy automático (Vercel)
- ✅ Histórico de versões
- ✅ Fácil de atualizar

---

**Bora configurar! 🚀**

Use: `SETUP-GITHUB.bat` ou siga este guia!

