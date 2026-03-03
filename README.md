# 🚀 Compras.AI - Sistema Inteligente de Aquisições Públicas

Sistema **100% gratuito** para análise e geração automática de documentos de aquisições públicas, com enquadramento nas normas vigentes (Lei 14.133/2021).

## ✨ Funcionalidades

- ✅ **Login com Google** (usando sua conta @gmail.com ou Google Workspace)
- ✅ **Análise inteligente** de enquadramento legal
- ✅ **Geração automática** de documentos:
  - DFD (Documento de Formalização da Demanda)
  - TR (Termo de Referência)
  - ETP (Estudo Técnico Preliminar) - quando necessário
  - Mapa de Riscos - quando necessário
- ✅ **Histórico** de aquisições por usuário
- ✅ **Interface moderna** e intuitiva
- ✅ **100% gratuito** - sem mensalidades

## 📋 Pré-requisitos

### 1. Criar conta no Google Cloud Console

Para permitir login com Google, você precisa criar credenciais OAuth:

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto (ou use um existente)
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth client ID**
5. Configure a tela de consentimento OAuth (se solicitado)
6. Escolha **Web application**
7. Adicione as URIs autorizadas:
   - **JavaScript origins**: `http://localhost:3000` (para testes locais)
   - **Redirect URIs**: 
     - `http://localhost:3000/auth/google/callback` (para testes)
     - `https://seu-app.onrender.com/auth/google/callback` (para produção - coloque a URL do seu app no Render)

8. Copie o **Client ID** e **Client Secret**

### 2. Criar conta no GitHub (se não tiver)

1. Acesse: https://github.com
2. Clique em **Sign up**
3. Siga as instruções

### 3. Criar conta no Render (para hospedar gratuitamente)

1. Acesse: https://render.com
2. Clique em **Get Started for Free**
3. Faça login com sua conta do GitHub

## 🚀 Deploy no Render (Gratuito)

### Passo 1: Subir código para o GitHub

1. Baixe todos os arquivos deste projeto
2. No GitHub, crie um novo repositório (ex: `compras-ai`)
3. Faça upload de todos os arquivos

**OU** use a linha de comando:

```bash
cd compras-ai-corrigido
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/compras-ai.git
git push -u origin main
```

### Passo 2: Configurar no Render

1. Entre no Render: https://render.com
2. Clique em **New** → **Blueprint**
3. Conecte seu repositório do GitHub
4. O Render detectará automaticamente o `render.yaml`
5. **IMPORTANTE**: Antes de criar, adicione as variáveis de ambiente:

   - `GOOGLE_CLIENT_ID` → Cole o Client ID do Google
   - `GOOGLE_CLIENT_SECRET` → Cole o Client Secret do Google
   - `GOOGLE_CALLBACK_URL` → Use: `https://seu-app.onrender.com/auth/google/callback`
     (Substitua `seu-app` pelo nome que escolher no Render)

6. Clique em **Apply**
7. Aguarde o deploy (leva ~5 minutos na primeira vez)

### Passo 3: Atualizar URLs no Google Cloud Console

1. Volte ao Google Cloud Console
2. Edite suas credenciais OAuth
3. Adicione a URL do Render nos **Redirect URIs**:
   - `https://seu-app.onrender.com/auth/google/callback`
4. Salve

### Pronto! 🎉

Seu app estará rodando em: `https://seu-app.onrender.com`

## 🖥️ Executar Localmente (opcional)

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env
cp .env.example .env

# 3. Editar .env com suas credenciais do Google
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# 4. Iniciar servidor
npm start

# Acesse: http://localhost:3000
```

## 📖 Como Usar

### 1. Fazer Login

- Clique em **Entrar com Google**
- Autorize o app a acessar seu perfil do Google
- Pronto! Você está logado

### 2. Criar Nova Aquisição

1. Clique no botão **+ Nova**
2. Preencha os campos obrigatórios:
   - **Descrição do objeto** (ex: "Aquisição de tinta acrílica para manutenção predial")
   - **Modalidade** (Dispensa, Pregão, etc.)
   - **Tipo de Contratação** (Pontual ou Continuada)
3. Preencha os campos opcionais:
   - Complexidade
   - Valor estimado
   - Quantidade
   - Prazo
   - Observações
4. Clique em **Criar Aquisição**

### 3. Sistema Analisa Automaticamente

O sistema irá:
- ✅ Enquadrar na modalidade correta
- ✅ Identificar normas aplicáveis
- ✅ Determinar se precisa de ETP
- ✅ Determinar se precisa de Mapa de Riscos
- ✅ Gerar justificativas

### 4. Gerar Documentos

1. Selecione uma aquisição da lista
2. Veja os detalhes no painel direito
3. Clique em **📄 Gerar Documentos**
4. Os documentos serão gerados em formato DOCX
5. Baixe cada documento individualmente

### 5. Consultar Histórico

- Todas as suas aquisições ficam salvas
- Clique em qualquer aquisição para ver detalhes
- Documentos gerados ficam disponíveis para download

## 🔒 Segurança

- ✅ Login seguro via Google OAuth 2.0
- ✅ Cada usuário vê apenas suas próprias aquisições
- ✅ Sessões criptografadas
- ✅ Sem armazenamento de senhas (usa Google)

## 💰 Custo

**R$ 0,00** - Totalmente gratuito!

- GitHub: Gratuito
- Render: Plano Free (sem custo)
- Google OAuth: Gratuito

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Banco de Dados**: SQLite (leve e eficiente)
- **Autenticação**: Passport.js + Google OAuth 2.0
- **Geração de Documentos**: docx (biblioteca para criar arquivos .docx)
- **Frontend**: HTML + CSS + JavaScript puro (sem frameworks)

## 📝 Documentos Gerados

### DFD (Documento de Formalização da Demanda)
Documento inicial que formaliza a necessidade da aquisição, incluindo:
- Identificação do demandante
- Objeto da contratação
- Justificativa da necessidade
- Modalidade sugerida
- Valor estimado
- Normas aplicáveis

### TR (Termo de Referência)
Documento técnico que especifica:
- Descrição detalhada do objeto
- Especificações técnicas
- Quantitativos
- Prazo de entrega
- Garantia
- Obrigações da contratada

### ETP (Estudo Técnico Preliminar)
Gerado automaticamente quando:
- Contratação continuada
- Alta complexidade
- Valor acima de R$ 176.000,00

Contém:
- Descrição da necessidade
- Análise de mercado
- Análise de riscos
- Estimativa de custo

### Mapa de Riscos
Gerado automaticamente quando:
- Contratação continuada
- Média ou alta complexidade
- Valor acima de R$ 200.000,00

Contém:
- Identificação de riscos
- Medidas mitigadoras
- Plano de contingência

## 🆘 Problemas Comuns

### Erro ao fazer login com Google

**Solução**: Verifique se:
1. O `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
2. A URL de callback está configurada no Google Cloud Console
3. O projeto OAuth está ativo no Google Cloud

### Documentos não são gerados

**Solução**: Verifique se:
1. O diretório `documentos/` existe e tem permissão de escrita
2. Os logs do servidor indicam algum erro específico

### App não inicia no Render

**Solução**:
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Veja os logs do Render para identificar o erro
3. Certifique-se que o disco persistente está montado em `/var/data`

## 📞 Suporte

Este é um projeto open source. Para reportar bugs ou sugerir melhorias, abra uma issue no GitHub.

## 📄 Licença

MIT License - Uso livre para qualquer finalidade.

---

**Desenvolvido para facilitar o trabalho de servidores públicos brasileiros** 🇧🇷
