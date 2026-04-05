export type LeadTemperature = 'frio' | 'morno' | 'quente';
export type LeadStatus = 'ativo' | 'handoff' | 'finalizado';

export interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  versao: string;
  ano: number;
  preco: number;
  km: number;
  cor: string;
  cambio: string;
  combustivel: string;
  observacoes: string;
  disponivel: number;
  fotos: string[];
  categoria: string;
  destaque: number;
}

export interface Lead {
  id: number;
  nome: string | null;
  telefone: string;
  cidade: string | null;
  interesse: string | null;
  orcamento: number | null;
  entrada: number | null;
  financiamento: number;
  troca: number;
  urgencia: string | null;
  score: number;
  temperatura: LeadTemperature;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MessageInput {
  leadId: number;
  direction: 'inbound' | 'outbound';
  channel: 'whatsapp' | 'api';
  message: string;
  mediaUrl?: string | null;
}

export interface IntentSignals {
  pediuPreco: boolean;
  pediuFotos: boolean;
  perguntouFinanciamento: boolean;
  falouTroca: boolean;
  informouEntrada: boolean;
  informouOrcamento: boolean;
  querVisita: boolean;
  querVendedor: boolean;
  urgenciaAlta: boolean;
  vehicleQuery?: string;
  maxBudget?: number;
  vehicleIdRef?: number;
}
