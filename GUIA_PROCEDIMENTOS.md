# 📚 GUIA DE PROCEDIMENTOS - COMPRAS.AI

## 🎯 Objetivo
Este guia detalha TODOS os passos necessários para colocar o sistema Compras.AI funcionando, desde a configuração inicial até o uso diário.

---

## PARTE 1: CONFIGURAÇÃO INICIAL (Fazer apenas 1 vez)

### ⚙️ PASSO 1: Criar Credenciais do Google OAuth

**Tempo estimado: 10 minutos**

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. No topo da página, clique em **"Select a project"** → **"NEW PROJECT"**
4. Digite um nome (ex: "Compras AI") e clique em **CREATE**
5. Aguarde o projeto ser criado (aparece notificação no canto superior direito)
6. No menu lateral esquerdo, clique em **"APIs & Services"** → **"OAuth consent screen"**
7. Selecione **"External"** e clique em **CREATE**
8. Preencha apenas os campos obrigatórios:
   - **App name**: Compras.AI
   - **User support email**: seu-email@gmail.com
   - **Developer contact**: seu-email@gmail.com
9. Clique em **SAVE AND CONTINUE** (3 vezes até finalizar)
10. No menu lateral, clique em **"Credentials"**
11. Clique em **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
12. Escolha **"Web application"**
13. Em **"Authorized JavaScript origins"**, clique em **+ ADD URI** e adicione:
    ```
    http://localhost:3000
    ```
14. Em **"Authorized redirect URIs"**, clique em **+ ADD URI** e adicione:
    ```
    http://localhost:3000/auth/google/callback
    ```
15. Clique em **CREATE**
16. **IMPORTANTE**: Copie e salve em um bloco de notas:
    - ✅ **Client ID** (algo como: 123456-abc.apps.googleusercontent.com)
    - ✅ **Client Secret** (algo como: GOCSPX-abcd1234)

---

### 🐙 PASSO 2: Criar Conta no GitHub (se não tiver)

**Tempo estimado: 5 minutos**

1. Acesse: https://github.com
2. Clique em **"Sign up"**
3. Preencha:
   - Email
   - Senha
   - Username (escolha um nome de usuário)
4. Verifique seu email e confirme a conta
5. Faça login no GitHub

---

### 🌐 PASSO 3: Subir o Código para o GitHub

**Tempo estimado: 10 minutos**

#### Opção A: Interface Web (Mais Fácil)

1. No GitHub, clique no botão **"+"** no canto superior direito → **"New repository"**
2. Digite um nome: `compras-ai`
3. Deixe como **Public** (ou Private se preferir)
4. Clique em **"Create repository"**
5. Na nova página, role até **"uploading an existing file"** e clique
6. Arraste TODOS os arquivos do projeto para a área de upload
7. Aguarde o upload completar
8. Clique em **"Commit changes"**

#### Opção B: Linha de Comando (Para quem conhece Git)

```bash
cd compras-ai-corrigido
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/compras-ai.git
git push -u origin main
```

---

### ☁️ PASSO 4: Deploy no Render (Hospedagem Gratuita)

**Tempo estimado: 15 minutos**

1. Acesse: https://render.com
2. Clique em **"Get Started for Free"**
3. Escolha **"Sign in with GitHub"**
4. Autorize o Render a acessar seus repositórios
5. No dashboard do Render, clique em **"New"** → **"Blueprint"**
6. Selecione o repositório `compras-ai` que você criou
7. O Render detectará automaticamente o arquivo `render.yaml`
8. **ANTES DE CLICAR EM "APPLY"**, role para baixo até **"Environment Variables"**
9. Clique em **"Add Environment Variable"** e adicione:
   
   **Variável 1:**
   - Key: `GOOGLE_CLIENT_ID`
   - Value: Cole aqui o Client ID que você copiou no Passo 1
   
   **Variável 2:**
   - Key: `GOOGLE_CLIENT_SECRET`
   - Value: Cole aqui o Client Secret que você copiou no Passo 1
   
   **Variável 3:**
   - Key: `GOOGLE_CALLBACK_URL`
   - Value: `https://seu-app.onrender.com/auth/google/callback`
   - **ATENÇÃO**: Substitua `seu-app` pelo nome que o Render sugerir para seu serviço (aparece no topo da página)

10. Clique em **"Apply"**
11. Aguarde o deploy (leva 5-10 minutos na primeira vez)
12. Quando aparecer **"Live"** em verde, clique na URL do seu app
13. **Copie a URL** que aparece (algo como: https://compras-ai-xxxx.onrender.com)

---

### 🔄 PASSO 5: Atualizar URLs no Google Cloud Console

**Tempo estimado: 3 minutos**

1. Volte ao Google Cloud Console: https://console.cloud.google.com/
2. Vá em **"APIs & Services"** → **"Credentials"**
3. Clique no nome do OAuth client que você criou
4. Em **"Authorized JavaScript origins"**, clique em **+ ADD URI** e adicione:
   ```
   https://seu-app.onrender.com
   ```
   (Substitua pela URL que você copiou no passo anterior)

5. Em **"Authorized redirect URIs"**, clique em **+ ADD URI** e adicione:
   ```
   https://seu-app.onrender.com/auth/google/callback
   ```
   (Substitua pela URL que você copiou no passo anterior)

6. Clique em **SAVE**

---

## ✅ CONFIGURAÇÃO CONCLUÍDA!

Seu sistema agora está rodando em: `https://seu-app.onrender.com`

---

## PARTE 2: USO DIÁRIO DO SISTEMA

### 🔐 PASSO 1: Fazer Login

1. Acesse a URL do seu app no Render
2. Clique no botão **"Entrar com Google"**
3. Escolha sua conta Google
4. Autorize o app (aparece apenas na primeira vez)
5. Pronto! Você está logado

---

### 📝 PASSO 2: Criar uma Nova Aquisição

1. Na tela inicial, clique no botão **"+ Nova"**
2. Preencha o formulário:

   **CAMPOS OBRIGATÓRIOS:**
   - ✅ **Descrição do objeto**: Descreva o que você quer adquirir
     - Exemplo: "Aquisição de 50 computadores desktop para uso administrativo"
   
   - ✅ **Modalidade**: Escolha a modalidade de licitação
     - Dispensa: Para valores baixos
     - Pregão: Para bens e serviços comuns
     - Concorrência: Para obras e serviços de engenharia
     - Inexigibilidade: Quando não há competição possível
   
   - ✅ **Tipo de Contratação**:
     - Pontual: Aquisição única
     - Continuada: Serviço contínuo (ex: limpeza, vigilância)

   **CAMPOS OPCIONAIS (mas recomendados):**
   - **Complexidade**: Baixa, Média ou Alta
   - **Valor Estimado**: Valor em reais (ex: 150000.00)
   - **Quantidade**: Descrição da quantidade (ex: "50 unidades")
   - **Prazo**: Prazo de entrega em dias (ex: 30)
   - **Observações**: Informações adicionais

3. Clique em **"Criar Aquisição"**

---

### 🤖 PASSO 3: Sistema Analisa Automaticamente

Após criar a aquisição, o sistema AUTOMATICAMENTE:

✅ **Analisa o enquadramento legal**
- Verifica se a modalidade está correta
- Identifica as normas aplicáveis (Lei 14.133/2021, etc.)

✅ **Determina necessidade de ETP**
- ETP é OBRIGATÓRIO se:
  - Tipo for "Continuada", OU
  - Complexidade for "Alta", OU
  - Valor for acima de R$ 176.000,00

✅ **Determina necessidade de Mapa de Riscos**
- Mapa de Riscos é OBRIGATÓRIO se:
  - Tipo for "Continuada", OU
  - Complexidade for "Média" ou "Alta", OU
  - Valor for acima de R$ 200.000,00

✅ **Gera justificativas**
- Justificativa da modalidade
- Justificativa da necessidade
- Lista de normas aplicáveis

---

### 📄 PASSO 4: Gerar Documentos

1. Na lista "Minhas Aquisições", clique na aquisição que você criou
2. Os detalhes aparecerão no painel direito
3. Revise as informações:
   - Modalidade
   - Valor
   - ETP (SIM ou NÃO)
   - Mapa de Riscos (SIM ou NÃO)
4. Clique no botão **"📄 Gerar Documentos"**
5. Aguarde alguns segundos
6. Os documentos aparecerão para download:

   **SEMPRE GERADOS:**
   - ✅ DFD (Documento de Formalização da Demanda)
   - ✅ TR (Termo de Referência)

   **GERADOS QUANDO NECESSÁRIO:**
   - ✅ ETP (Estudo Técnico Preliminar)
   - ✅ Mapa de Riscos

7. Clique em cada documento para baixar
8. Abra no Microsoft Word ou LibreOffice
9. Revise e personalize conforme necessário
10. Salve e use no seu processo de aquisição

---

### 📚 PASSO 5: Consultar Histórico

1. Na tela inicial, todas as suas aquisições ficam listadas
2. Clique em qualquer aquisição para ver detalhes
3. Documentos já gerados ficam disponíveis para download novamente
4. Você pode criar quantas aquisições quiser
5. Cada usuário vê apenas suas próprias aquisições

---

## 💡 DICAS E BOAS PRÁTICAS

### ✅ Para Dispensas de Licitação
- Use modalidade "DISPENSA"
- Preencha a "Hipótese de Dispensa" (ex: "Art. 75, II - valor")
- O sistema gerará justificativas conforme a Lei 14.133/2021

### ✅ Para Pregões
- Use modalidade "PREGAO"
- Indique "Complexidade: BAIXA" para bens comuns
- O sistema automaticamente cita o Decreto 10.024/2019

### ✅ Para Serviços Continuados
- SEMPRE use "Tipo: CONTINUADA"
- O sistema obrigará ETP e Mapa de Riscos
- Preencha prazo em meses (ex: 360 dias = 12 meses)

### ✅ Para Contratações de TI
- Use "Complexidade: ALTA"
- Preencha valor estimado detalhado
- O sistema citará IN SEGES/ME nº 65/2021

---

## 🔧 MANUTENÇÃO E ATUALIZAÇÕES

### Como Atualizar o Sistema

Se você quiser atualizar o código no futuro:

1. Atualize os arquivos no GitHub
2. No Render, vá no seu serviço
3. Clique em **"Manual Deploy"** → **"Deploy latest commit"**
4. Aguarde o deploy

### Como Ver Logs de Erro

1. No Render, vá no seu serviço
2. Clique em **"Logs"**
3. Veja os logs em tempo real

---

## ❓ PERGUNTAS FREQUENTES

**Q: Preciso pagar alguma coisa?**
A: Não! Tudo é 100% gratuito.

**Q: Quantas aquisições posso criar?**
A: Ilimitadas!

**Q: Os dados ficam seguros?**
A: Sim! Cada usuário vê apenas suas próprias aquisições. Login via Google OAuth 2.0 é muito seguro.

**Q: Posso usar meu email institucional?**
A: Sim! Qualquer email Google funciona, incluindo Google Workspace.

**Q: E se o Render "dormir" minha aplicação?**
A: No plano gratuito, após 15 minutos de inatividade, o app "dorme". Ao acessar novamente, ele "acorda" automaticamente em ~30 segundos. Seus dados NÃO são perdidos!

**Q: Posso personalizar os documentos gerados?**
A: Sim! Baixe o documento em DOCX e edite no Word conforme necessário.

**Q: O sistema decide se precisa ETP e Mapa de Riscos?**
A: Sim! Baseado nas regras da Lei 14.133/2021 e IN SEGES/ME.

---

## 🆘 PROBLEMAS E SOLUÇÕES

### Problema: "Erro ao fazer login com Google"

**Solução:**
1. Verifique se o `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos no Render
2. Verifique se a URL de callback está correta no Google Cloud Console
3. Certifique-se que o projeto OAuth está ativo

### Problema: "Documentos não são gerados"

**Solução:**
1. Verifique os logs do Render
2. Tente gerar novamente
3. Se persistir, crie uma nova aquisição para testar

### Problema: "Página não carrega"

**Solução:**
1. Se o app estava inativo, aguarde 30 segundos (está "acordando")
2. Limpe o cache do navegador (Ctrl + Shift + Del)
3. Tente em uma aba anônima

---

## ✅ CHECKLIST FINAL

Use este checklist para garantir que tudo está funcionando:

- [ ] Credenciais do Google OAuth criadas
- [ ] Código no GitHub
- [ ] App deployado no Render
- [ ] Variáveis de ambiente configuradas no Render
- [ ] URLs atualizadas no Google Cloud Console
- [ ] Consegui fazer login com Google
- [ ] Consegui criar uma aquisição
- [ ] Sistema analisou e determinou ETP/Mapa de Riscos
- [ ] Consegui gerar documentos
- [ ] Consegui baixar os documentos DOCX

---

## 🎓 CONCLUSÃO

Parabéns! Você agora tem um sistema profissional de gestão de aquisições públicas, totalmente gratuito e hospedado na nuvem.

**Próximos passos sugeridos:**
1. Teste criando algumas aquisições de exemplo
2. Compartilhe o link do sistema com colegas da sua unidade
3. Use no seu dia a dia para agilizar processos

**Lembre-se:**
- O sistema é uma FERRAMENTA DE APOIO
- Os documentos gerados devem ser revisados por um responsável técnico
- Sempre consulte a legislação vigente para casos específicos

---

**Desenvolvido com ❤️ para servidores públicos brasileiros**

Em caso de dúvidas, consulte o README.md ou os comentários no código.
