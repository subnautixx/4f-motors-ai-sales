import { config } from '../utils/config.js';
import { classifyTemperature, leadRepository } from '../repositories/leadRepository.js';

export const leadService = {
  registrarLead(dados: { telefone: string; nome?: string | null }) {
    const lead = leadRepository.registrarLead(dados.telefone);
    if (dados.nome) return leadRepository.atualizarLead(lead.id, { nome: dados.nome });
    return lead;
  },

  atualizarLeadScore(id: number, pontos: number) {
    const lead = leadRepository.findById(id);
    if (!lead) throw new Error('Lead não encontrado');

    const score = lead.score + pontos;
    const temperatura = classifyTemperature(score);
    return leadRepository.atualizarLead(id, { score, temperatura });
  },

  classificarLead(id: number) {
    const lead = leadRepository.findById(id);
    if (!lead) throw new Error('Lead não encontrado');
    return classifyTemperature(lead.score);
  },

  gerarResumoAtendimento(id: number) {
    const lead = leadRepository.findById(id);
    if (!lead) throw new Error('Lead não encontrado');
    const messages = leadRepository.listarMensagens(id);
    const lastClientMsg = [...messages].reverse().find((m) => m.direction === 'inbound')?.message;

    return [
      `Lead #${lead.id} (${lead.telefone})`,
      `Nome: ${lead.nome ?? 'não informado'} | Cidade: ${lead.cidade ?? 'não informada'}`,
      `Interesse: ${lead.interesse ?? 'não definido'}`,
      `Orçamento: ${lead.orcamento ?? 'n/i'} | Entrada: ${lead.entrada ?? 'n/i'}`,
      `Financiamento: ${lead.financiamento ? 'sim' : 'não'} | Troca: ${lead.troca ? 'sim' : 'não'}`,
      `Urgência: ${lead.urgencia ?? 'não informada'} | Score: ${lead.score} | Temperatura: ${lead.temperatura}`,
      `Última mensagem do cliente: ${lastClientMsg ?? 'n/a'}`
    ].join('\n');
  },

  solicitarHumano(id: number) {
    return leadRepository.atualizarLead(id, { status: 'handoff' });
  },

  encaminharParaVendedor(id: number, vendedor = config.seller) {
    const resumo = this.gerarResumoAtendimento(id);
    leadRepository.registrarHandoff(id, resumo, vendedor.name, vendedor.whatsapp);
    this.solicitarHumano(id);
    return { resumo, vendedor };
  },

  agendarVisita(id: number, data: string) {
    leadRepository.registrarAgendamento(id, data);
  }
};
