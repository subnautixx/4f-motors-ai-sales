import { claudeClient } from '../integrations/claudeClient.js';
import { evolutionClient } from '../integrations/evolutionClient.js';
import { attendantSystemPrompt } from '../prompts/attendantPrompt.js';
import { leadRepository } from '../repositories/leadRepository.js';
import { leadService } from './leadService.js';
import { vehicleService } from './vehicleService.js';
import { computeScoreDelta, extractIntentSignals, extractMoneyValue } from '../utils/intentScorer.js';

export const conversationService = {
  async processIncoming(input: { phone: string; text: string; senderName?: string }): Promise<{ reply: string; handoff: boolean }> {
    const lead = leadService.registrarLead({ telefone: input.phone, nome: input.senderName ?? null });

    leadRepository.salvarMensagem({
      leadId: lead.id,
      direction: 'inbound',
      channel: 'whatsapp',
      message: input.text,
      mediaUrl: null
    });

    const signals = extractIntentSignals(input.text);
    const delta = computeScoreDelta(signals);
    const updatedLead = leadService.atualizarLeadScore(lead.id, delta);

    const patch: Record<string, unknown> = {};
    if (signals.informouOrcamento) patch.orcamento = signals.maxBudget ?? extractMoneyValue(input.text);
    if (signals.informouEntrada) patch.entrada = extractMoneyValue(input.text);
    if (signals.perguntouFinanciamento) patch.financiamento = 1;
    if (signals.falouTroca) patch.troca = 1;
    if (signals.urgenciaAlta) patch.urgencia = 'alta';
    if (signals.vehicleQuery) patch.interesse = signals.vehicleQuery;
    if (Object.keys(patch).length > 0) {
      leadRepository.atualizarLead(lead.id, patch as never);
    }

    if (updatedLead.temperatura === 'quente' || signals.querVendedor || signals.querVisita) {
      const handoffData = leadService.encaminharParaVendedor(lead.id);
      const handoffMessage = `Perfeito. Pelo que você me passou, o melhor agora é te conectar direto com nosso vendedor para agilizar tudo. Segue o contato dele: ${handoffData.vendedor.name} - ${handoffData.vendedor.whatsapp}`;

      await evolutionClient.sendText(input.phone, handoffMessage);
      leadRepository.salvarMensagem({ leadId: lead.id, direction: 'outbound', channel: 'whatsapp', message: handoffMessage });

      return { reply: handoffMessage, handoff: true };
    }

    const vehicles = vehicleService.buscarVeiculos({ termo: signals.vehicleQuery, precoMax: signals.maxBudget });
    const selectedVehicle = signals.vehicleIdRef ? vehicleService.detalharVeiculo(signals.vehicleIdRef) : vehicles[0] ?? null;

    const inventoryContext = selectedVehicle
      ? `Veículo sugerido: ID ${selectedVehicle.id} - ${selectedVehicle.marca} ${selectedVehicle.modelo} ${selectedVehicle.versao}, ${selectedVehicle.ano}, R$ ${selectedVehicle.preco}, ${selectedVehicle.km} km, disponibilidade: ${selectedVehicle.disponivel ? 'sim' : 'não'}.`
      : `Resultados: ${vehicles
          .slice(0, 3)
          .map((v) => `ID ${v.id}: ${v.marca} ${v.modelo} ${v.versao} ${v.ano} por R$ ${v.preco}`)
          .join(' | ') || 'nenhum veículo encontrado com esses filtros.'}`;

    const context = [
      `Lead score atual: ${updatedLead.score} (${updatedLead.temperatura})`,
      `Dados do lead: nome=${updatedLead.nome ?? 'n/i'}, cidade=${updatedLead.cidade ?? 'n/i'}, orçamento=${updatedLead.orcamento ?? 'n/i'}`,
      inventoryContext
    ].join('\n');

    const reply = await claudeClient.generateReply({
      system: attendantSystemPrompt,
      userMessage: input.text,
      context
    });

    await evolutionClient.sendText(input.phone, reply);
    leadRepository.salvarMensagem({ leadId: lead.id, direction: 'outbound', channel: 'whatsapp', message: reply });

    if (signals.pediuFotos && selectedVehicle) {
      const fotos = vehicleService.listarFotos(selectedVehicle.id).slice(0, 3);
      for (const foto of fotos) {
        await evolutionClient.sendImage(input.phone, foto, `${selectedVehicle.marca} ${selectedVehicle.modelo} ${selectedVehicle.versao}`);
        leadRepository.salvarMensagem({
          leadId: lead.id,
          direction: 'outbound',
          channel: 'whatsapp',
          message: `[FOTO] ${foto}`,
          mediaUrl: foto
        });
      }
    }

    return { reply, handoff: false };
  }
};
