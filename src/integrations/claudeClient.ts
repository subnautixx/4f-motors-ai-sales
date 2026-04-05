import { config } from '../utils/config.js';

interface GenerateArgs {
  system: string;
  userMessage: string;
  context: string;
}

export const claudeClient = {
  async generateReply(args: GenerateArgs): Promise<string> {
    if (!config.anthropicApiKey) {
      return 'Perfeito! Já te ajudo com isso. Me confirma seu nome e a cidade para eu te passar a melhor condição da 4F Motors.';
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: config.anthropicModel,
        max_tokens: 300,
        system: args.system,
        messages: [
          {
            role: 'user',
            content: `Contexto:\n${args.context}\n\nMensagem do cliente:\n${args.userMessage}`
          }
        ]
      })
    });

    if (!response.ok) {
      return 'Recebi sua mensagem! Já estou consultando o estoque e te retorno com a melhor opção.';
    }

    const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = data.content?.find((item) => item.type === 'text')?.text;
    return text?.trim() || 'Já estou consultando aqui para te responder com precisão.';
  }
};
