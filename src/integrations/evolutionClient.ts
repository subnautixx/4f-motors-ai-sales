import { config } from '../utils/config.js';

const buildHeaders = () => ({
  apikey: config.evolutionApiKey,
  'Content-Type': 'application/json'
});

const isEnabled = () => Boolean(config.evolutionBaseUrl && config.evolutionApiKey);

export const evolutionClient = {
  async createInstance(): Promise<{ ok: boolean; data?: unknown; message?: string }> {
    if (!isEnabled()) return { ok: false, message: 'Evolution API não configurada. Rodando em modo mock.' };

    const response = await fetch(`${config.evolutionBaseUrl}/instance/create`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({
        instanceName: config.evolutionInstanceName,
        integration: 'WHATSAPP-BAILEYS',
        qrcode: true,
        webhook: config.evolutionWebhookUrl
      })
    });

    return { ok: response.ok, data: await response.json() };
  },

  async connectInstance(): Promise<{ ok: boolean; data?: unknown; message?: string }> {
    if (!isEnabled()) return { ok: false, message: 'Evolution API não configurada. Sem QR real.' };

    const response = await fetch(`${config.evolutionBaseUrl}/instance/connect/${config.evolutionInstanceName}`, {
      method: 'GET',
      headers: buildHeaders()
    });

    return { ok: response.ok, data: await response.json() };
  },

  async sendText(number: string, text: string): Promise<void> {
    if (!isEnabled()) {
      console.log(`[MOCK WhatsApp] -> ${number}: ${text}`);
      return;
    }

    await fetch(`${config.evolutionBaseUrl}/message/sendText/${config.evolutionInstanceName}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ number, text })
    });
  },

  async sendImage(number: string, imageUrl: string, caption = 'Foto do veículo'): Promise<void> {
    if (!isEnabled()) {
      console.log(`[MOCK WhatsApp IMG] -> ${number}: ${imageUrl}`);
      return;
    }

    await fetch(`${config.evolutionBaseUrl}/message/sendMedia/${config.evolutionInstanceName}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ number, mediatype: 'image', media: imageUrl, caption })
    });
  }
};
