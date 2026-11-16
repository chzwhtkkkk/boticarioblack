# 🌿 Loja O Boticário

Loja online moderna e responsiva de produtos O Boticário, desenvolvida com React, Vite e Tailwind CSS.

## ✨ Funcionalidades

- 🏠 **Página Inicial** com produtos em destaque
- 🛍️ **Catálogo de Produtos** com filtros por categoria e busca
- 📦 **Detalhes do Produto** com imagens e descrições completas
- 🛒 **Carrinho de Compras** funcional com gerenciamento de quantidades
- 👤 **Sistema de Login/Cadastro** com autenticação local
- 💳 **Checkout** preparado para integração com API Pix
- 📱 **Design Responsivo** para mobile, tablet e desktop
- ⚡ **Performance Otimizada** com Vite

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra o navegador em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

O build otimizado será gerado na pasta `dist/`.

## 📁 Estrutura do Projeto

```
loja-boticario/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── context/          # Context API (Estado global)
│   │   ├── CartContext.jsx
│   │   └── AuthContext.jsx
│   ├── data/             # Dados dos produtos
│   │   └── products.js
│   ├── pages/            # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Entry point
│   └── index.css         # Estilos globais
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework CSS utility-first
- **React Router DOM** - Roteamento
- **Context API** - Gerenciamento de estado
- **LocalStorage** - Persistência de dados

## 🔧 Próximos Passos

### Integração com API Pix

O checkout está preparado para integração com sua API Pix. Você precisará:

1. Adicionar a chamada da API no arquivo `src/pages/Checkout.jsx`
2. Substituir a simulação de pagamento pela integração real
3. Implementar a exibição do QR Code Pix

Exemplo de onde integrar (linha ~50 do Checkout.jsx):

```javascript
// Substituir esta parte:
setTimeout(() => {
  // Aqui você integrará sua API Pix
  const order = { ... }
  // ...
}, 2000)

// Por algo como:
const response = await fetch('SUA_API_PIX_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ total: getCartTotal(), items: cart })
})
const pixData = await response.json()
// Exibir QR Code: pixData.qrCode
```

### Melhorias Futuras

- [ ] Integrar com backend real
- [ ] Adicionar sistema de avaliações
- [ ] Implementar wishlist (lista de desejos)
- [ ] Adicionar mais formas de pagamento
- [ ] Sistema de cupons de desconto
- [ ] Painel de pedidos do usuário
- [ ] Notificações por email
- [ ] Chat de atendimento

## 📝 Observações

- Os dados dos produtos estão em `src/data/products.js` - você pode adicionar/editar produtos lá
- As imagens dos produtos estão usando Unsplash como placeholder - substitua pelas imagens reais
- O sistema de autenticação usa LocalStorage - em produção, use um backend seguro
- O carrinho e dados do usuário são salvos no navegador

## 🎯 Otimizações para Conversão

A loja foi desenvolvida com foco em conversão:

- ✅ CTAs (Call-to-Action) claros e visíveis
- ✅ Processo de checkout simplificado
- ✅ Indicadores de estoque baixo
- ✅ Produtos relacionados para cross-sell
- ✅ Design limpo e profissional
- ✅ Carregamento rápido
- ✅ Mobile-first

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato!

---

Desenvolvido com ❤️ para O Boticário
