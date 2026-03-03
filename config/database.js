const sqlite3 = require("sqlite3").verbose();

const DB_PATH = process.env.DB_PATH || "./compras_ai.db";

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error("❌ Erro BD:", err);
  else {
    console.log("✅ BD conectado:", DB_PATH);
    migrarBanco();
  }
});

function tableHasColumn(table, column) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${table})`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows.some((r) => r.name === column));
    });
  });
}

function run(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => (err ? reject(err) : resolve()));
  });
}

async function migrarBanco() {
  // Importante: garantir FK
  db.serialize(async () => {
    try {
      await run(`PRAGMA foreign_keys = ON;`);

      // 1) Tabela usuarios (se não existir)
      await run(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          senha_hash TEXT NOT NULL,
          telefone TEXT,
          unidade TEXT,
          cargo TEXT,
          estado TEXT,
          criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2) Coluna email_verificado (se não existir)
      const hasEmailVerificado = await tableHasColumn("usuarios", "email_verificado");
      if (!hasEmailVerificado) {
        await run(`ALTER TABLE usuarios ADD COLUMN email_verificado INTEGER DEFAULT 0;`);
        console.log("✅ Migração: adicionada coluna usuarios.email_verificado");
      } else {
        console.log("✅ Migração: coluna usuarios.email_verificado já existe");
      }

      // 3) Tabela auth_tokens (se não existir)
      await run(`
        CREATE TABLE IF NOT EXISTS auth_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          tipo TEXT NOT NULL,               -- 'verify' ou 'reset'
          token TEXT NOT NULL UNIQUE,
          expira_em DATETIME NOT NULL,
          usado_em DATETIME,
          criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );
      `);

      // 4) Outras tabelas do seu app (mantém as atuais)
      await run(`
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
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS documentos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          aquisicao_id INTEGER NOT NULL,
          tipo_documento TEXT NOT NULL,
          arquivo_path TEXT,
          criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (aquisicao_id) REFERENCES aquisicoes(id)
        );
      `);

      console.log("✅ Migrações concluídas com sucesso");
    } catch (e) {
      console.error("❌ Falha ao migrar banco:", e);
    }
  });
}

module.exports = db;
