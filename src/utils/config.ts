import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3333),
  dbPath: process.env.DB_PATH ?? './data/mvp.sqlite',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-latest',
  evolutionBaseUrl: process.env.EVOLUTION_BASE_URL ?? '',
  evolutionApiKey: process.env.EVOLUTION_API_KEY ?? '',
  evolutionInstanceName: process.env.EVOLUTION_INSTANCE_NAME ?? '4f-motors',
  evolutionWebhookUrl: process.env.EVOLUTION_WEBHOOK_URL ?? '',
  seller: {
    name: process.env.SELLER_NAME ?? 'Vendedor 4F Motors',
    phone: process.env.SELLER_PHONE ?? '',
    whatsapp: process.env.SELLER_WHATSAPP ?? ''
  }
};
