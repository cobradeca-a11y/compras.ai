# Compras AI (V2.1) — pronto para GitHub + Render

Aplicativo web (Node/Express + SQLite + Vite/React) para **cadastrar aquisições** e **gerar documentos** (DFD/TR/ETP/Mapa de Risco).

## Rodar no seu PC

```bash
npm install
npm run build
npm start
```

Abra: http://localhost:3000

> Dica: `npm run dev` inicia o servidor com auto-reload (nodemon).

## Deploy no Render (produção)

Este repositório já inclui `render.yaml`.

1. Suba o projeto para o GitHub.
2. No Render: **New → Blueprint** e selecione seu repositório.
3. O Render vai ler o `render.yaml` e criar o serviço automaticamente.

### Banco de dados (SQLite)

- O app usa SQLite por padrão.
- No Render, o arquivo do banco precisa ficar num **disco persistente**.
- Já está configurado via env:
  - `DB_PATH=/var/data/compras_ai.db`
  - disk montado em `/var/data`.

## Variáveis de ambiente

- `PORT` (Render define automaticamente)
- `SESSION_SECRET` (já configurado para gerar automaticamente no Render)
- `DB_PATH` (caminho do SQLite)
- `CORS_ORIGIN` (opcional; use apenas se quiser restringir domínios. Ex.: `https://seuapp.onrender.com`)

## Healthcheck

- `GET /health` → retorna status do servidor.

