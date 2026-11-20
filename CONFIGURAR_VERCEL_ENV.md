# ⚙️ Variáveis de Ambiente - Vercel

## 📝 Adicione estas variáveis no Vercel:

Acesse: https://vercel.com/seu-projeto/settings/environment-variables

### ✅ ADICIONAR ESTAS NOVAS VARIÁVEIS:

```
VITE_SUPABASE_URL
Valor: https://onscojkssuytbqzqgafu.supabase.co
Environments: Production, Preview, Development
```

```
VITE_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uc2Nvamtzc3V5dGJxenFnYWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MDk3NjAsImV4cCI6MjA0NzI4NTc2MH0.gj6-QDhfE_lZ2iuaJkPBj-_6TOCJo5mIcbpQ-UyPxu0
Environments: Production, Preview, Development
```

## 📌 Como adicionar:

1. Acesse: https://vercel.com
2. Clique no seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Cole o nome da variável
6. Cole o valor
7. Marque os 3 environments (Production, Preview, Development)
8. Clique em **Save**
9. Repita para a segunda variável

## 🔄 Após adicionar:

Depois de salvar as variáveis, você precisa fazer um **novo deploy** para elas serem aplicadas.

Opção 1: Faça um novo commit (qualquer alteração)
Opção 2: No dashboard da Vercel → Deployments → Clique nos 3 pontinhos do último deploy → **Redeploy**

---

**✅ Pronto!** Depois disso, a Área do Cliente vai funcionar perfeitamente!
