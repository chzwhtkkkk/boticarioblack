# 📦 INSTALAR NODE.JS E NPM

## 🎯 GUIA COMPLETO DE INSTALAÇÃO

### O que é Node.js e npm?
- **Node.js:** Ambiente para rodar JavaScript no computador
- **npm:** Gerenciador de pacotes (vem junto com Node.js)
- **Por que preciso?** Para fazer build e deploy do site

---

## 🚀 PASSO A PASSO

### 1️⃣ DOWNLOAD

#### Opção 1: Download Direto (Recomendado)
1. Acesse: https://nodejs.org
2. Clique no botão **verde** "LTS" (versão recomendada)
3. Aguarde o download (aprox. 30 MB)

#### Opção 2: Link Direto
- **Windows 64-bit:** https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi
- **Windows 32-bit:** https://nodejs.org/dist/v20.11.0/node-v20.11.0-x86.msi

---

### 2️⃣ INSTALAÇÃO

1. **Clique 2x** no arquivo baixado (node-vXX.XX.X-x64.msi)

2. **Tela 1:** Welcome
   - Clique "Next"

3. **Tela 2:** License Agreement
   - Marque "I accept the terms"
   - Clique "Next"

4. **Tela 3:** Destination Folder
   - Deixe o padrão: `C:\Program Files\nodejs\`
   - Clique "Next"

5. **Tela 4:** Custom Setup
   - **IMPORTANTE:** Deixe TUDO marcado
   - Especialmente "Add to PATH"
   - Clique "Next"

6. **Tela 5:** Tools for Native Modules
   - **MARQUE** essa opção (instala ferramentas extras)
   - Clique "Next"

7. **Tela 6:** Ready to Install
   - Clique "Install"
   - Se pedir permissão de Administrador, clique "Sim"

8. **Aguarde** a instalação (1-2 minutos)

9. **Tela Final:** Completed
   - Clique "Finish"

---

### 3️⃣ INSTALAÇÃO AUTOMÁTICA DE FERRAMENTAS

Depois de clicar "Finish", uma janela **preta (PowerShell)** vai abrir automaticamente.

**IMPORTANTE:**
- **NÃO FECHE** essa janela
- Vai aparecer várias linhas de texto
- Aguarde até pedir "Press any key to continue"
- Pressione **qualquer tecla**
- Aguarde fechar sozinha (pode demorar 5-10 min)

**O que está instalando?**
- Python
- Visual Studio Build Tools
- Chocolatey
- Outras ferramentas necessárias

---

### 4️⃣ REINICIAR COMPUTADOR

**MUITO IMPORTANTE:**
1. Salve tudo que estiver fazendo
2. Feche todos os programas
3. **Reinicie o computador**

Por que reiniciar?
- Para o Windows reconhecer o Node.js
- Para atualizar as variáveis de ambiente
- Para npm funcionar em qualquer pasta

---

### 5️⃣ VERIFICAR INSTALAÇÃO

Depois de reiniciar:

1. **Abra o PowerShell:**
   - Pressione `Win + X`
   - Clique em "Windows PowerShell" ou "Terminal"

2. **Digite:**
   ```bash
   node --version
   ```
   Deve aparecer algo como: `v20.11.0`

3. **Digite:**
   ```bash
   npm --version
   ```
   Deve aparecer algo como: `10.2.4`

**Se aparecerem os números, SUCESSO!** ✅

---

## ✅ INSTALAÇÃO COMPLETA!

Agora você pode:
- Rodar `npm install` ✅
- Rodar `npm run dev` ✅
- Rodar `npm run build` ✅
- Usar os scripts de deploy ✅

---

## 🔧 CONFIGURAÇÕES EXTRAS (OPCIONAL)

### Acelerar instalação de pacotes

1. Configurar npm para usar cache:
```bash
npm config set cache C:\npm-cache --global
```

2. Instalar yarn (alternativa mais rápida):
```bash
npm install -g yarn
```

---

## 🛠️ TESTAR TUDO FUNCIONANDO

### Teste Rápido:

1. Abra PowerShell
2. Navegue até seu projeto:
```bash
cd C:\Users\chz\Documents\oboticario.revendasss-main
```

3. Instale dependências:
```bash
npm install
```

4. Rode o site:
```bash
npm run dev
```

5. Abra o navegador: http://localhost:5173

**Funcionou?** 🎉 Perfeito!

---

## 🐛 PROBLEMAS COMUNS

### Problema 1: "node: comando não encontrado"
**Causa:** Node.js não foi adicionado ao PATH

**Solução:**
1. Desinstale Node.js:
   - Painel de Controle → Programas → Desinstalar
2. Instale novamente
3. **Marque "Add to PATH"** na instalação
4. Reinicie o computador

---

### Problema 2: "npm não está funcionando"
**Solução:**
1. Feche TODOS os PowerShell/CMD abertos
2. Reinicie o computador
3. Abra novo PowerShell
4. Teste novamente

---

### Problema 3: "Erro de permissão"
**Solução:**
1. Abra PowerShell **como Administrador**:
   - Win + X
   - "Windows PowerShell (Admin)"
2. Execute o comando novamente

---

### Problema 4: "npm install muito lento"
**Solução:**
1. Use outro espelho (mirror):
```bash
npm config set registry https://registry.npmjs.org/
```

2. Ou instale yarn:
```bash
npm install -g yarn
cd seu-projeto
yarn install
```

---

### Problema 5: "Versão antiga do npm"
**Solução:** Atualizar npm:
```bash
npm install -g npm@latest
```

---

## 📚 COMANDOS ÚTEIS NPM

### Comandos Básicos:
```bash
npm install              # Instalar dependências
npm run dev              # Rodar servidor desenvolvimento
npm run build            # Fazer build para produção
npm run preview          # Preview da build
```

### Comandos Avançados:
```bash
npm list                 # Ver pacotes instalados
npm outdated             # Ver pacotes desatualizados
npm update               # Atualizar pacotes
npm cache clean --force  # Limpar cache
```

### Instalar Pacotes:
```bash
npm install nome-pacote           # Instalar localmente
npm install -g nome-pacote        # Instalar globalmente
npm install nome-pacote --save-dev # Instalar como dev
```

---

## 🌟 PACOTES GLOBAIS ÚTEIS

Depois de instalar Node.js, instale esses pacotes globais:

### 1. Vercel CLI (para deploy)
```bash
npm install -g vercel
```

### 2. Yarn (alternativa ao npm)
```bash
npm install -g yarn
```

### 3. http-server (servidor estático)
```bash
npm install -g http-server
```

### 4. npm-check-updates (atualizar pacotes)
```bash
npm install -g npm-check-updates
```

---

## 📊 VERIFICAR STATUS

### Ver versões instaladas:
```bash
node --version
npm --version
npx --version
```

### Ver onde está instalado:
```bash
where node
where npm
```

### Ver configurações:
```bash
npm config list
```

---

## 🎯 PRÓXIMOS PASSOS

Agora que Node.js está instalado:

1. ✅ Vá na pasta do projeto
2. ✅ Rode `npm install`
3. ✅ Rode `npm run dev` para testar
4. ✅ Rode `npm run build` para fazer build
5. ✅ Use `deploy-vercel.bat` para deploy

---

## 🆘 AINDA COM PROBLEMAS?

Se nada funcionar:

### Opção 1: Instalação Limpa
1. Desinstale Node.js completamente
2. Delete a pasta `C:\Program Files\nodejs\`
3. Delete a pasta `C:\Users\SEU_USUARIO\AppData\Roaming\npm`
4. Reinicie
5. Instale novamente

### Opção 2: Usar NVM (Node Version Manager)
1. Desinstale Node.js
2. Baixe NVM: https://github.com/coreybutler/nvm-windows/releases
3. Instale NVM
4. No PowerShell:
```bash
nvm install 20.11.0
nvm use 20.11.0
```

---

## ✅ CHECKLIST PÓS-INSTALAÇÃO

Confirme que tudo funciona:

- [ ] `node --version` mostra versão
- [ ] `npm --version` mostra versão
- [ ] `npm install` funciona no projeto
- [ ] `npm run dev` inicia servidor
- [ ] `npm run build` cria pasta dist
- [ ] `vercel --version` funciona (depois de instalar)

---

**PRONTO PARA INSTALAR?**

Siga os passos acima e me avisa quando terminar!

Se der algum erro, me manda print que te ajudo! 🚀

