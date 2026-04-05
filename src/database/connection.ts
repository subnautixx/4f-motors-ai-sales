import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from '../utils/config.js';

const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(config.dbPath);
db.pragma('journal_mode = WAL');

export const initDatabase = (): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      telefone TEXT NOT NULL UNIQUE,
      cidade TEXT,
      interesse TEXT,
      orcamento REAL,
      entrada REAL,
      financiamento INTEGER DEFAULT 0,
      troca INTEGER DEFAULT 0,
      urgencia TEXT,
      score INTEGER DEFAULT 0,
      temperatura TEXT DEFAULT 'frio',
      status TEXT DEFAULT 'ativo',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leadId INTEGER NOT NULL,
      direction TEXT NOT NULL,
      channel TEXT NOT NULL,
      message TEXT NOT NULL,
      mediaUrl TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (leadId) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      versao TEXT NOT NULL,
      ano INTEGER NOT NULL,
      preco REAL NOT NULL,
      km INTEGER NOT NULL,
      cor TEXT NOT NULL,
      cambio TEXT NOT NULL,
      combustivel TEXT NOT NULL,
      observacoes TEXT,
      disponivel INTEGER DEFAULT 1,
      fotos TEXT NOT NULL,
      categoria TEXT,
      destaque INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS handoffs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leadId INTEGER NOT NULL,
      summary TEXT NOT NULL,
      vendedorNome TEXT NOT NULL,
      vendedorWhatsapp TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (leadId) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leadId INTEGER NOT NULL,
      dataVisita TEXT NOT NULL,
      status TEXT DEFAULT 'pendente',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (leadId) REFERENCES leads(id)
    );
  `);
};
