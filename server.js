
// === COMPRAS.AI - SERVER ATUALIZADO COM:
// - Verificação de e-mail
// - Reset de senha
// - Bloqueio de login se não verificado
// - Integração SMTP (opcional)
// =================================================

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'compras-ai-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// ================= UTILITÁRIOS =================

function baseUrl(req) {
  return process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
}

function gerarToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function sendEmail({ to, subject, html }) {

  if (!process.env.SMTP_HOST) {
    console.log("SMTP não configurado. Simulando envio.");
    console.log("Para:", to);
    console.log("Assunto:", subject);
    console.log("Conteúdo:", html);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

// ================= REGISTRO =================

app.post('/api/registro', async (req, res) => {

  const { nome, email, senha } = req.body;

  try {

    const senhaHash = await bcrypt.hash(senha, 10);

    db.run(
      "INSERT INTO usuarios (nome, email, senha_hash, criado_em, email_verificado) VALUES (?, ?, ?, datetime('now'), 0)",
      [nome, email, senhaHash],
      function (err) {

        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
          }
          return res.status(500).json({ erro: 'Erro ao cadastrar' });
        }

        const usuarioId = this.lastID;
        const token = gerarToken();

        db.run(
          "INSERT INTO auth_tokens (usuario_id, tipo, token, expira_em) VALUES (?, 'verify', ?, datetime('now', '+1 day'))",
          [usuarioId, token],
          async (err2) => {

            if (err2) {
              return res.status(500).json({ erro: "Erro ao gerar token" });
            }

            const link = `${baseUrl(req)}/api/verificar-email?token=${token}`;

            await sendEmail({
              to: email,
              subject: "Confirme seu cadastro no Compras.AI",
              html: `
                <p>Olá, ${nome}!</p>
                <p>Clique no link abaixo para confirmar seu cadastro:</p>
                <p><a href="${link}">${link}</a></p>
                <p>Este link expira em 24 horas.</p>
              `
            });

            res.json({
              sucesso: true,
              mensagem: "Cadastro realizado! Verifique seu e-mail para confirmar."
            });

          }
        );
      }
    );

  } catch (error) {
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// ================= VERIFICAR EMAIL =================

app.get('/api/verificar-email', (req, res) => {

  const { token } = req.query;
  if (!token) return res.status(400).send("Token ausente");

  db.get(
    "SELECT * FROM auth_tokens WHERE token = ? AND tipo='verify' AND usado_em IS NULL AND expira_em > datetime('now')",
    [token],
    (err, row) => {

      if (err || !row) {
        return res.status(400).send("Token inválido ou expirado");
      }

      db.run("UPDATE usuarios SET email_verificado = 1 WHERE id = ?", [row.usuario_id]);
      db.run("UPDATE auth_tokens SET usado_em = datetime('now') WHERE id = ?", [row.id]);

      res.send("Email confirmado com sucesso! Agora você já pode fazer login.");
    }
  );
});

// ================= LOGIN =================

app.post('/api/login', (req, res) => {

  const { email, senha } = req.body;

  db.get("SELECT * FROM usuarios WHERE email = ?", [email], async (err, usuario) => {

    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (!usuario) return res.status(401).json({ erro: 'Email ou senha incorretos' });

    if (!usuario.email_verificado) {
      return res.status(403).json({ erro: 'Confirme seu e-mail antes de entrar.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Email ou senha incorretos' });

    req.session.usuarioId = usuario.id;

    res.json({ sucesso: true });
  });
});

// ================= RESET DE SENHA =================

app.post('/api/solicitar-reset', (req, res) => {

  const { email } = req.body;

  db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, usuario) => {

    if (!usuario) return res.json({ sucesso: true });

    const token = gerarToken();

    db.run(
      "INSERT INTO auth_tokens (usuario_id, tipo, token, expira_em) VALUES (?, 'reset', ?, datetime('now', '+1 hour'))",
      [usuario.id, token],
      async () => {

        const link = `${baseUrl(req)}/reset.html?token=${token}`;

        await sendEmail({
          to: email,
          subject: "Redefinir senha - Compras.AI",
          html: `
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <p><a href="${link}">${link}</a></p>
            <p>Este link expira em 1 hora.</p>
          `
        });

        res.json({ sucesso: true });
      }
    );

  });
});

app.post('/api/reset-senha', async (req, res) => {

  const { token, novaSenha } = req.body;

  db.get(
    "SELECT * FROM auth_tokens WHERE token = ? AND tipo='reset' AND usado_em IS NULL AND expira_em > datetime('now')",
    [token],
    async (err, row) => {

      if (!row) {
        return res.status(400).json({ erro: 'Token inválido ou expirado' });
      }

      const hash = await bcrypt.hash(novaSenha, 10);

      db.run("UPDATE usuarios SET senha_hash = ? WHERE id = ?", [hash, row.usuario_id]);
      db.run("UPDATE auth_tokens SET usado_em = datetime('now') WHERE id = ?", [row.id]);

      res.json({ sucesso: true, mensagem: 'Senha redefinida com sucesso' });

    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
