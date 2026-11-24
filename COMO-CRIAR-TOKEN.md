# 🔑 Como Criar Token do GitHub (5 minutos)

## Passo a Passo com Imagens

### 1️⃣ Faça login na conta nova
- Acesse: https://github.com/login
- **Login:** contavercelchz-alt
- **Senha:** [sua senha]

---

### 2️⃣ Abra a página de tokens
Clique aqui: **https://github.com/settings/tokens/new**

Ou manualmente:
1. Clique no seu avatar (canto superior direito)
2. Settings
3. Developer settings (menu lateral esquerdo, final da página)
4. Personal access tokens → Tokens (classic)
5. Generate new token → Generate new token (classic)

---

### 3️⃣ Configure o token

**Note (descrição):**
```
Deploy Boticario
```

**Expiration (validade):**
```
No expiration (sem expiração)
```

**Select scopes (permissões):**

✅ Marque APENAS esta opção:
- **[x] repo** (Full control of private repositories)
  - Isso vai marcar automaticamente todas as sub-opções

**NÃO** precisa marcar mais nada!

---

### 4️⃣ Gerar o token

1. Role a página até o final
2. Clique no botão verde: **"Generate token"**
3. ⚠️ **IMPORTANTE:** Uma tela vai aparecer com o token
4. O token começa com: `ghp_...`
5. Clique no ícone de **copiar** (📋) ao lado do token
6. ⚠️ **GUARDE ESTE TOKEN!** Você não conseguirá ver ele novamente

---

### 5️⃣ Use o token

1. Execute o arquivo: **`ENVIAR-RAPIDO.bat`**
2. Quando pedir, **cole o token** (Ctrl+V)
3. Pressione Enter
4. Pronto! 🎉

---

## ⚠️ IMPORTANTE

- O token é como uma senha
- **NUNCA** compartilhe o token
- Se perder, delete o token antigo e crie um novo
- Guarde em um lugar seguro (ex: bloco de notas)

---

## 🆘 Problemas?

**Token não funciona:**
- Verifique se marcou a opção `repo`
- Tente criar um novo token
- Certifique-se de copiar o token completo (começa com `ghp_`)

**Erro 404:**
- Verifique se o repositório existe: https://github.com/contavercelchz-alt/botiboti2k26
- Certifique-se que está logado na conta correta

---

## 🚀 Depois de enviar

1. Acesse: https://vercel.com
2. Import Project
3. Selecione: **botiboti2k26**
4. Configure variáveis de ambiente (.env)
5. Deploy!

---

✅ **TUDO PRONTO!** Execute: `ENVIAR-RAPIDO.bat`
