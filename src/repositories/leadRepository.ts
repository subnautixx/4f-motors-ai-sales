import { db } from '../database/connection.js';
import { Lead, LeadTemperature, MessageInput } from '../types/domain.js';

const mapLead = (row: any): Lead => row as Lead;

export const leadRepository = {
  registrarLead(telefone: string): Lead {
    const existing = this.findByPhone(telefone);
    if (existing) return existing;

    db.prepare('INSERT INTO leads (telefone) VALUES (?)').run(telefone);
    return this.findByPhone(telefone)!;
  },

  findById(id: number): Lead | null {
    const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    return row ? mapLead(row) : null;
  },

  findByPhone(telefone: string): Lead | null {
    const row = db.prepare('SELECT * FROM leads WHERE telefone = ?').get(telefone);
    return row ? mapLead(row) : null;
  },

  atualizarLead(id: number, patch: Partial<Lead>): Lead {
    const allowed = ['nome', 'cidade', 'interesse', 'orcamento', 'entrada', 'financiamento', 'troca', 'urgencia', 'score', 'temperatura', 'status'];
    const entries = Object.entries(patch).filter(([key, value]) => allowed.includes(key) && value !== undefined);

    if (entries.length > 0) {
      const setClause = entries.map(([key]) => `${key} = @${key}`).join(', ');
      db.prepare(`UPDATE leads SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = @id`).run(
        Object.fromEntries([['id', id], ...entries])
      );
    }

    return this.findById(id)!;
  },

  salvarMensagem(input: MessageInput): void {
    db.prepare(
      'INSERT INTO messages (leadId, direction, channel, message, mediaUrl) VALUES (@leadId, @direction, @channel, @message, @mediaUrl)'
    ).run(input);
  },

  listarMensagens(leadId: number): Array<{ direction: string; message: string; createdAt: string }> {
    return db
      .prepare('SELECT direction, message, createdAt FROM messages WHERE leadId = ? ORDER BY id ASC LIMIT 50')
      .all(leadId) as Array<{ direction: string; message: string; createdAt: string }>;
  },

  registrarHandoff(leadId: number, summary: string, vendedorNome: string, vendedorWhatsapp: string): void {
    db.prepare(
      'INSERT INTO handoffs (leadId, summary, vendedorNome, vendedorWhatsapp) VALUES (?, ?, ?, ?)'
    ).run(leadId, summary, vendedorNome, vendedorWhatsapp);
  },

  registrarAgendamento(leadId: number, dataVisita: string): void {
    db.prepare('INSERT INTO appointments (leadId, dataVisita) VALUES (?, ?)').run(leadId, dataVisita);
  }
};

export const classifyTemperature = (score: number): LeadTemperature => {
  if (score >= 8) return 'quente';
  if (score >= 4) return 'morno';
  return 'frio';
};
