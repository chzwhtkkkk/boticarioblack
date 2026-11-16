# 🚀 Como Iniciar a Loja O Boticário

## ✅ Passo a Passo

### 1. As dependências já foram instaladas! ✓

### 2. Iniciar o servidor de desenvolvimento

Abra o terminal nesta pasta e execute:

```bash
npm run dev
```

### 3. Acessar a loja

O navegador abrirá automaticamente em `http://localhost:3000`

Se não abrir automaticamente, acesse manualmente esse endereço.

---

## 🎯 Testando as Funcionalidades

### Criar uma conta
1. Clique em "Entrar" no canto superior direito
2. Clique em "Cadastre-se"
3. Preencha os dados e crie sua conta

### Adicionar produtos ao carrinho
1. Navegue pelos produtos na página inicial ou em "Produtos"
2. Clique em "Adicionar" ou clique no produto para ver detalhes
3. Na página de detalhes, escolha a quantidade e adicione ao carrinho

### Finalizar compra
1. Clique no ícone do carrinho no topo
2. Revise seus produtos
3. Clique em "Finalizar Compra"
4. Preencha os dados de entrega
5. Confirme o pedido

**Nota:** O pagamento via Pix está preparado para integração futura com sua API.

---

## 📝 Dados de Teste

Você pode criar qualquer conta para testar. Os dados são salvos localmente no navegador.

**Exemplo:**
- Nome: João Silva
- Email: joao@teste.com
- Senha: 123456

---

## 🛠️ Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Criar build de produção
npm run build

# Visualizar build de produção
npm run preview
```

---

## 📦 Próximos Passos

1. **Testar todas as funcionalidades** da loja
2. **Substituir as imagens** dos produtos por imagens reais do O Boticário
3. **Adicionar mais produtos** no arquivo `src/data/products.js`
4. **Integrar sua API Pix** no checkout (arquivo `src/pages/Checkout.jsx`)
5. **Personalizar cores** se necessário (arquivo `tailwind.config.js`)

---

## 🎨 Personalizações Rápidas

### Mudar as cores principais
Edite o arquivo `tailwind.config.js` e altere as cores em `theme.extend.colors.primary`

### Adicionar produtos
Edite o arquivo `src/data/products.js` e adicione novos objetos no array `products`

### Mudar informações de contato
Edite o arquivo `src/components/Footer.jsx`

---

## ❓ Problemas?

Se tiver algum erro ao iniciar:

1. Certifique-se que o Node.js está instalado: `node --version`
2. Tente reinstalar as dependências: `npm install`
3. Limpe o cache: `npm cache clean --force`
4. Tente novamente: `npm run dev`

---

**Pronto! Sua loja está funcionando! 🎉**
