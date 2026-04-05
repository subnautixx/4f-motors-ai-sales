import { Request, Response } from 'express';
import { conversationService } from '../services/conversationService.js';
import { evolutionClient } from '../integrations/evolutionClient.js';

export const whatsappController = {
  async setup(_req: Request, res: Response) {
    const created = await evolutionClient.createInstance();
    const connected = await evolutionClient.connectInstance();
    res.json({ created, connected });
  },

  async webhook(req: Request, res: Response) {
    const body = req.body;

    const eventText = body?.data?.message?.conversation ?? body?.data?.message?.extendedTextMessage?.text ?? body?.text;
    const phone = body?.data?.key?.remoteJid?.replace('@s.whatsapp.net', '') ?? body?.from;
    const senderName = body?.data?.pushName;

    if (!eventText || !phone) {
      return res.status(200).json({ ignored: true, reason: 'payload sem texto ou telefone' });
    }

    const result = await conversationService.processIncoming({
      phone,
      text: eventText,
      senderName
    });

    return res.status(200).json({ ok: true, result });
  }
};
