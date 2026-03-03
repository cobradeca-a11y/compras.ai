# ⚡ INÍCIO RÁPIDO - 5 MINUTOS

Quer começar AGORA? Siga este guia ultra-simplificado!

## 📋 O que você precisa ter pronto:

1. ✅ Conta no Google (Gmail)
2. ✅ Conta no GitHub (crie em 2 min: https://github.com)
3. ✅ Conta no Render (crie em 2 min: https://render.com - use login do GitHub)

---

## 🚀 PASSO 1: Google OAuth (10 min)

1. Acesse: https://console.cloud.google.com/
2. Clique: **Select project** → **NEW PROJECT**
3. Nome: "Compras AI" → **CREATE**
4. Menu lateral: **APIs & Services** → **OAuth consent screen**
5. Escolha: **External** → **CREATE**
6. Preencha:
   - App name: Compras.AI
   - Email: seu-email@gmail.com
7. Clique: **SAVE AND CONTINUE** (3 vezes)
8. Menu: **Credentials** → **CREATE CREDENTIALS** → **OAuth client ID**
9. Tipo: **Web application**
10. **Authorized redirect URIs** → **ADD URI**:
    ```
    http://localhost:3000/auth/google/callback
    ```
11. **CREATE**
12. **COPIE E SALVE:**
    - Client ID
    - Client Secret

✅ **Pronto!** Você tem as credenciais.

---

## 🐙 PASSO 2: GitHub (5 min)

1. GitHub → **New repository**
2. Nome: `compras-ai`
3. **Create repository**
4. **Upload files** → Arraste TODOS os arquivos do projeto
5. **Commit changes**

✅ **Pronto!** Código no GitHub.

---

## ☁️ PASSO 3: Render (10 min)

1. Render → **New** → **Blueprint**
2. Conecte seu repositório `compras-ai`
3. **ANTES de Apply**, adicione variáveis:
   - `GOOGLE_CLIENT_ID` → Cole o Client ID
   - `GOOGLE_CLIENT_SECRET` → Cole o Client Secret
   - `GOOGLE_CALLBACK_URL` → `https://seu-app.onrender.com/auth/google/callback`
     (use o nome que aparecer na tela)
4. **Apply**
5. Aguarde deploy (~5 min)
6. **COPIE a URL** do app

✅ **Pronto!** App no ar.

---

## 🔄 PASSO 4: Atualizar Google (2 min)

1. Volte ao Google Cloud Console
2. **Credentials** → Edite o OAuth client
3. **Authorized redirect URIs** → **ADD URI**:
   ```
   https://seu-app.onrender.com/auth/google/callback
   ```
   (use a URL que você copiou)
4. **SAVE**

✅ **PRONTO! FUNCIONANDO!** 🎉

---

## 🎯 Testar (2 min)

1. Acesse: `https://seu-app.onrender.com`
2. Clique: **Entrar com Google**
3. Autorize o app
4. Você está DENTRO!

---

## 📝 Usar (2 min)

1. Clique: **+ Nova**
2. Preencha:
   - Descrição: "Teste de aquisição"
   - Modalidade: Dispensa
   - Tipo: Pontual
3. **Criar Aquisição**
4. Clique na aquisição criada
5. **Gerar Documentos**
6. Baixe os documentos!

---

## 🎊 PARABÉNS!

Você tem um sistema profissional de aquisições rodando!

**Próximos passos:**
- Leia o **README.md** para entender melhor
- Leia o **GUIA_PROCEDIMENTOS.md** para detalhes
- Use no seu dia a dia!

---

## 🆘 Deu problema?

### "Erro ao fazer login"
→ Verifique se as variáveis no Render estão corretas

### "App não carrega"
→ Aguarde 30 segundos (pode estar "acordando")

### "Documentos não geram"
→ Veja os logs no Render

---

## 💡 Dica Final

**Salve este checklist:**

- [x] Google OAuth configurado
- [x] Código no GitHub
- [x] Deploy no Render
- [x] URLs atualizadas
- [x] Testei o login
- [x] Testei criar aquisição
- [x] Testei gerar documentos

**Se marcou tudo, está 100% funcional!** ✅

---

**Tempo total: ~30 minutos**  
**Custo total: R$ 0,00**  
**Resultado: Sistema profissional no ar!** 🚀
