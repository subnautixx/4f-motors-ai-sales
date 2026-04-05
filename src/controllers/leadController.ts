import { Request, Response } from 'express';
import { leadRepository } from '../repositories/leadRepository.js';
import { leadService } from '../services/leadService.js';

export const leadController = {
  getLead(req: Request, res: Response) {
    const id = Number(req.params.id);
    const lead = leadRepository.findById(id);
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

    const messages = leadRepository.listarMensagens(id);
    return res.json({ lead, messages });
  },

  resumo(req: Request, res: Response) {
    const id = Number(req.params.id);
    const summary = leadService.gerarResumoAtendimento(id);
    res.json({ leadId: id, summary });
  }
};
