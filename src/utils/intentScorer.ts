import { IntentSignals } from '../types/domain.js';

const rxMoney = /(\d{1,3}(?:[\.\s]?\d{3})*(?:,\d{2})?|\d{2,6})/;

const detectBudget = (text: string): number | undefined => {
  const budgetMatch = text.match(/(?:até|ate|orçamento|orcamento|tenho|faixa)[^\d]*(\d[\d\.,\s]{2,})/i);
  if (!budgetMatch) return undefined;
  const cleaned = budgetMatch[1].replace(/\./g, '').replace(/\s/g, '').replace(',', '.');
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : undefined;
};

const detectVehicleIdRef = (text: string): number | undefined => {
  const idMatch = text.match(/(?:id|código|codigo)\s*(\d{1,3})/i);
  return idMatch ? Number(idMatch[1]) : undefined;
};

export const extractIntentSignals = (message: string): IntentSignals => {
  const text = message.toLowerCase();

  return {
    pediuPreco: /(valor|preço|preco|quanto|custa)/.test(text),
    pediuFotos: /(foto|imagens|mostra|manda foto)/.test(text),
    perguntouFinanciamento: /(financia|financiamento|parcelar|parcela)/.test(text),
    falouTroca: /(troca|dar .* na troca|tenho .*carro)/.test(text),
    informouEntrada: /(entrada).*(\d|mil|k)/.test(text),
    informouOrcamento: /(orçamento|orcamento|até|ate).*(\d|mil|k)/.test(text),
    querVisita: /(visita|test drive|agendar|conhecer a loja)/.test(text),
    querVendedor: /(falar com vendedor|atendente humano|consultor|vendedor)/.test(text),
    urgenciaAlta: /(hoje|essa semana|urgente|fechar logo|o quanto antes)/.test(text),
    vehicleQuery: text.match(/(corolla|civic|compass|tcross|onix|creta|pulse|kicks|320i|hilux)/)?.[1],
    maxBudget: detectBudget(text),
    vehicleIdRef: detectVehicleIdRef(text)
  };
};

export const computeScoreDelta = (signals: IntentSignals): number => {
  let points = 0;
  if (signals.pediuPreco) points += 2;
  if (signals.pediuFotos) points += 2;
  if (signals.perguntouFinanciamento) points += 2;
  if (signals.falouTroca) points += 2;
  if (signals.informouEntrada) points += 3;
  if (signals.informouOrcamento) points += 2;
  if (signals.querVisita) points += 4;
  if (signals.querVendedor) points += 5;
  if (signals.urgenciaAlta) points += 6;
  return points;
};

export const extractMoneyValue = (message: string): number | null => {
  const match = message.match(rxMoney);
  if (!match) return null;
  const parsed = Number(match[1].replace(/\./g, '').replace(',', '.').replace(/\s/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
};
