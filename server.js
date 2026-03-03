import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { gerarDocumentos } from './utils/documentos.js';
import { analisarAquisicao } from './utils/analise.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ========== BANCO DE DADOS ==========
const db = new Database(process.env.DB_PATH || './compras_ai.db');
db.pragma('journal_mode = WAL');

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    google_id TEXT UNIQUE,
    avatar TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS aquisicoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    modalidade TEXT NOT NULL,
    hipotese_dispensa TEXT,
    tipo_contratacao TEXT NOT NULL,
    descricao TEXT NOT NULL,
    quantidade TEXT,
    valor_estimado REAL,
    complexidade TEXT,
    prazo INTEGER,
    justificativa_modalidade TEXT,
    justificativa_necessidade TEXT,
    normas_aplicaveis TEXT,
    garantia_meses INTEGER,
    gera_etp TEXT,
    motivo_etp TEXT,
    gera_mapa_risco TEXT,
    motivo_mapa_risco TEXT,
    observacoes TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS documentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aquisicao_id INTEGER NOT NULL,
    tipo_documento TEXT NOT NULL,
    arquivo_nome TEXT NOT NULL,
    arquivo_path TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aquisicao_id) REFERENCES aquisicoes(id)
  );
`);

console.log('✅ Banco de dados inicializado');

// ========== MIDDLEWARES ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'compras-ai-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ========== PASSPORT CONFIG ==========
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const nome = profile.displayName;
    const googleId = profile.id;
    const avatar = profile.photos?.[0]?.value || null;

    // Verificar se usuário existe
    let usuario = db.prepare('SELECT * FROM usuarios WHERE google_id = ?').get(googleId);

    if (!usuario) {
      // Criar novo usuário
      const result = db.prepare(
        'INSERT INTO usuarios (nome, email, google_id, avatar) VALUES (?, ?, ?, ?)'
      ).run(nome, email, googleId, avatar);
      
      usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(result.lastInsertRowid);
    }

    return done(null, usuario);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
    done(null, usuario);
  } catch (error) {
    done(error, null);
  }
});

// ========== MIDDLEWARE DE AUTENTICAÇÃO ==========
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  next();
}

// ========== ROTAS DE AUTENTICAÇÃO ==========
app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/?erro=auth' }),
  (req, res) => {
    res.redirect('/?sucesso=login');
  }
);

app.get('/api/sessao', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      autenticado: true,
      usuario: {
        id: req.user.id,
        nome: req.user.nome,
        email: req.user.email,
        avatar: req.user.avatar
      }
    });
  }
  res.json({ autenticado: false });
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao fazer logout' });
    }
    req.session.destroy();
    res.json({ sucesso: true });
  });
});

// ========== ROTAS DE AQUISIÇÕES ==========
app.get('/api/minhas-aquisicoes', requireAuth, (req, res) => {
  try {
    const aquisicoes = db.prepare(
      'SELECT * FROM aquisicoes WHERE usuario_id = ? ORDER BY criado_em DESC'
    ).all(req.user.id);

    res.json({ aquisicoes });
  } catch (error) {
    console.error('Erro ao buscar aquisições:', error);
    res.status(500).json({ erro: 'Erro ao buscar aquisições' });
  }
});

app.get('/api/aquisicao/:id', requireAuth, (req, res) => {
  try {
    const aquisicao = db.prepare(
      'SELECT * FROM aquisicoes WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.user.id);

    if (!aquisicao) {
      return res.status(404).json({ erro: 'Aquisição não encontrada' });
    }

    const documentos = db.prepare(
      'SELECT tipo_documento, arquivo_nome, arquivo_path FROM documentos WHERE aquisicao_id = ?'
    ).all(aquisicao.id);

    res.json({ aquisicao, documentos });
  } catch (error) {
    console.error('Erro ao buscar aquisição:', error);
    res.status(500).json({ erro: 'Erro ao buscar aquisição' });
  }
});

app.post('/api/aquisicao', requireAuth, (req, res) => {
  try {
    const {
      modalidade,
      hipotese_dispensa,
      tipo_contratacao,
      descricao,
      quantidade,
      valor_estimado,
      complexidade,
      prazo,
      observacoes
    } = req.body;

    // Validação básica
    if (!modalidade || !tipo_contratacao || !descricao) {
      return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos' });
    }

    // Análise inteligente
    const analise = analisarAquisicao({
      modalidade,
      tipo_contratacao,
      complexidade,
      valor_estimado,
      prazo
    });

    // Inserir aquisição
    const result = db.prepare(`
      INSERT INTO aquisicoes (
        usuario_id, modalidade, hipotese_dispensa, tipo_contratacao, descricao,
        quantidade, valor_estimado, complexidade, prazo, observacoes,
        justificativa_modalidade, justificativa_necessidade, normas_aplicaveis,
        garantia_meses, gera_etp, motivo_etp, gera_mapa_risco, motivo_mapa_risco
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      modalidade,
      hipotese_dispensa || null,
      tipo_contratacao,
      descricao,
      quantidade || null,
      valor_estimado || null,
      complexidade || 'BAIXA',
      prazo || null,
      observacoes || null,
      analise.justificativa_modalidade,
      analise.justificativa_necessidade,
      analise.normas_aplicaveis,
      analise.garantia_meses,
      analise.regras.etp.gera ? 'SIM' : 'NÃO',
      analise.regras.etp.justificativa,
      analise.regras.mapa_risco.gera ? 'SIM' : 'NÃO',
      analise.regras.mapa_risco.justificativa
    );

    res.json({
      sucesso: true,
      aquisicao_id: result.lastInsertRowid,
      analise: analise,
      regras: analise.regras
    });
  } catch (error) {
    console.error('Erro ao criar aquisição:', error);
    res.status(500).json({ erro: 'Erro ao criar aquisição' });
  }
});

app.post('/api/aquisicao/:id/gerar-documentos', requireAuth, async (req, res) => {
  try {
    const aquisicao = db.prepare(
      'SELECT * FROM aquisicoes WHERE id = ? AND usuario_id = ?'
    ).get(req.params.id, req.user.id);

    if (!aquisicao) {
      return res.status(404).json({ erro: 'Aquisição não encontrada' });
    }

    // Gerar documentos
    const documentosGerados = await gerarDocumentos(aquisicao, req.user);

    // Salvar no banco
    const insertDoc = db.prepare(
      'INSERT INTO documentos (aquisicao_id, tipo_documento, arquivo_nome, arquivo_path) VALUES (?, ?, ?, ?)'
    );

    for (const doc of documentosGerados) {
      insertDoc.run(aquisicao.id, doc.tipo, doc.nome, doc.path);
    }

    res.json({
      sucesso: true,
      documentos: documentosGerados.map(d => ({
        tipo: d.tipo,
        nome: d.nome,
        url: `/documentos/${d.nome}`
      }))
    });
  } catch (error) {
    console.error('Erro ao gerar documentos:', error);
    res.status(500).json({ erro: 'Erro ao gerar documentos' });
  }
});

// ========== SERVIR DOCUMENTOS ==========
app.use('/documentos', express.static(join(__dirname, 'documentos')));

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mensagem: 'Servidor ativo',
    timestamp: new Date().toISOString()
  });
});

// ========== ROTA PRINCIPAL ==========
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// ========== INICIAR SERVIDOR ==========
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Banco de dados: ${process.env.DB_PATH || './compras_ai.db'}`);
  console.log(`🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configurado' : 'NÃO configurado'}`);
});
