# 🔒 SEGURANÇA E BOAS PRÁTICAS

## 🛡️ Segurança do Sistema

### Autenticação Google OAuth 2.0

✅ **Vantagens:**
- Não armazenamos senhas
- Autenticação delegada ao Google (muito mais seguro)
- Suporta autenticação de dois fatores (2FA) se você tiver configurado no Google
- Proteção contra ataques de força bruta

✅ **O que fazemos com seus dados:**
- Nome: Para identificação no sistema
- Email: Para identificação única do usuário
- Avatar: Para exibição no perfil (opcional)
- **NÃO** acessamos: Contatos, Gmail, Drive, Calendar ou qualquer outro serviço Google

### Dados Armazenados

✅ **O que armazenamos:**
- Informações das aquisições que VOCÊ cria
- Documentos que VOCÊ gera
- Seu nome e email do Google

✅ **Onde armazenamos:**
- Banco de dados SQLite no servidor Render
- Disco persistente protegido (1GB gratuito)
- Cada usuário vê APENAS suas próprias aquisições

✅ **Por quanto tempo:**
- Enquanto o app estiver ativo no Render
- Você pode deletar suas aquisições a qualquer momento (futura implementação)

### Sessões

✅ **Como funciona:**
- Cookie de sessão criptografado
- Expira em 30 dias
- Válido apenas para o domínio do seu app

---

## 📋 Boas Práticas de Uso

### ✅ FAÇA:

1. **Revise os documentos gerados**
   - O sistema é uma ferramenta de APOIO
   - Sempre revise e adapte conforme sua realidade
   - Consulte setor jurídico quando necessário

2. **Preencha todos os campos possíveis**
   - Quanto mais informações, melhor a análise
   - Valor estimado ajuda a determinar ETP/Mapa de Riscos
   - Complexidade influencia nos documentos gerados

3. **Use descrições claras**
   - Seja específico no objeto da aquisição
   - Exemplo BOM: "Aquisição de 50 notebooks Dell Latitude 3520, 8GB RAM, 256GB SSD para uso administrativo"
   - Exemplo RUIM: "Comprar notebooks"

4. **Mantenha um histórico organizado**
   - Nomeie aquisições de forma descritiva
   - Use o campo "Observações" para notas importantes

5. **Compartilhe com responsabilidade**
   - Compartilhe o link do sistema com colegas
   - Mas cada um deve ter sua própria conta Google

### ❌ NÃO FAÇA:

1. **NÃO compartilhe sua conta**
   - Cada servidor deve usar seu próprio email Google
   - Não compartilhe sessões/cookies

2. **NÃO considere os documentos como finais**
   - Sempre revise com equipe técnica
   - Adapte à realidade da sua unidade
   - Consulte legislação específica do seu órgão

3. **NÃO inclua informações sensíveis**
   - Não coloque dados pessoais de fornecedores
   - Não inclua informações classificadas
   - Não registre senhas ou dados bancários

4. **NÃO confie 100% na análise automática**
   - O sistema usa regras gerais
   - Casos específicos podem ter nuances
   - Sempre valide com setor competente

---

## 🔐 Privacidade

### Suas Informações

✅ **Dados do Google:**
- Obtidos via OAuth 2.0 padrão
- Usados APENAS para identificação
- NÃO compartilhados com terceiros
- NÃO vendidos ou monetizados

✅ **Dados das Aquisições:**
- Privados por usuário
- Não visíveis para outros usuários
- Não compartilhados externamente

### Cookies

✅ **Usamos apenas:**
- Cookie de sessão (essencial para login)
- Cookie de autenticação (essencial para segurança)

❌ **NÃO usamos:**
- Cookies de rastreamento
- Cookies de publicidade
- Cookies de terceiros (exceto Google OAuth)

---

## 🚨 Limitações e Avisos

### ⚠️ IMPORTANTE - LEIA COM ATENÇÃO:

1. **Este sistema é uma FERRAMENTA DE APOIO**
   - Não substitui consultoria jurídica
   - Não substitui análise de setor técnico
   - Não substitui responsabilidade do servidor

2. **As análises são BASEADAS EM REGRAS GERAIS**
   - Lei 14.133/2021 (Nova Lei de Licitações)
   - IN SEGES/ME nº 65/2021
   - Decreto 11.462/2023
   - Podem haver legislações específicas do seu órgão

3. **Os documentos gerados são MODELOS**
   - Devem ser revisados e adaptados
   - Podem necessitar de informações adicionais
   - Devem ser validados por responsável técnico

4. **O sistema NÃO garante**
   - Conformidade legal total
   - Aceitação pelos órgãos de controle
   - Ausência de questionamentos

---

## 📊 Plano Gratuito do Render

### ⚙️ Limitações do Plano Free:

1. **"Sleep" após inatividade**
   - App "dorme" após 15 minutos sem uso
   - "Acorda" automaticamente ao acessar (30 segundos)
   - Seus dados NÃO são perdidos

2. **Recursos limitados**
   - CPU e RAM compartilhados
   - Pode ser mais lento em horários de pico
   - 1GB de disco persistente

3. **Disponibilidade**
   - 99% de uptime (média)
   - Pode haver manutenções programadas
   - Não recomendado para sistemas críticos 24/7

### 💡 Dicas para Otimizar:

- Acesse o sistema regularmente (evita "sleep")
- Gere documentos em lotes (economiza recursos)
- Faça backup dos documentos importantes localmente

---

## 🔄 Backup e Recuperação

### Como Fazer Backup:

1. **Documentos gerados:**
   - Baixe todos os documentos importantes
   - Salve em seu computador ou nuvem pessoal
   - Organize por data ou número da aquisição

2. **Dados das aquisições:**
   - Atualmente não há função de exportação automática
   - Faça prints ou anotações dos dados importantes
   - Futura implementação: exportar para Excel/CSV

### Em Caso de Perda de Dados:

⚠️ **O plano gratuito do Render não garante backup automático**
- Se houver problema no servidor, dados podem ser perdidos
- Sempre mantenha backup local dos documentos importantes
- Para uso crítico, considere upgrade para plano pago do Render

---

## 🎯 Responsabilidade de Uso

### ✅ Você é Responsável Por:

1. Revisar todos os documentos gerados
2. Garantir conformidade com legislação local
3. Validar informações com setores competentes
4. Manter confidencialidade de informações sensíveis
5. Usar o sistema de forma ética e legal

### ❌ O Sistema NÃO é Responsável Por:

1. Erros ou imprecisões nos documentos
2. Não conformidade com legislação específica
3. Questionamentos de órgãos de controle
4. Perdas ou danos decorrentes do uso
5. Interrupções ou indisponibilidade do serviço

---

## 📞 Suporte e Atualizações

### Como Obter Ajuda:

1. Consulte o README.md
2. Leia o GUIA_PROCEDIMENTOS.md
3. Verifique os comentários no código
4. Abra uma issue no GitHub

### Atualizações Futuras (Roadmap):

🔜 **Planejado:**
- Exportar relatório em PDF
- Exportar dados para Excel
- Deletar aquisições
- Editar aquisições existentes
- Mais tipos de documentos (Termo de Execução, etc.)
- Templates personalizáveis
- Notificações por email

---

## ⚖️ Conformidade Legal

### Legislação Base:

✅ **Sistema desenvolvido considerando:**
- Lei nº 14.133/2021 (Nova Lei de Licitações)
- Decreto nº 11.462/2023 (Regulamentação)
- IN SEGES/ME nº 65/2021 (TI)
- Decreto nº 10.024/2019 (Pregão Eletrônico)

⚠️ **Atenção:**
- Podem haver normativas específicas do seu órgão
- Consulte sempre o setor jurídico
- Mantenha-se atualizado com mudanças legislativas

---

## ✅ Conclusão

Este sistema foi desenvolvido para:
- ✅ Agilizar processos administrativos
- ✅ Facilitar a vida do servidor público
- ✅ Democratizar acesso a ferramentas de qualidade
- ✅ Ser 100% gratuito

Mas lembre-se:
- ⚠️ Use com responsabilidade
- ⚠️ Sempre revise documentos gerados
- ⚠️ Consulte setores competentes quando necessário
- ⚠️ Mantenha backup dos documentos importantes

---

**Desenvolvido com responsabilidade para servidores públicos brasileiros** 🇧🇷

Use com sabedoria e sempre em conformidade com os princípios da Administração Pública:
- Legalidade
- Impessoalidade  
- Moralidade
- Publicidade
- Eficiência
