# 4F Motors AI Sales Attendant (MVP)

MVP funcional de atendimento comercial com IA para WhatsApp, com foco em conversão de leads e handoff inteligente para vendedor humano.

## Decisão técnica (rápida)
- **Abordagem escolhida:** **Evolution API** (com integração HTTP + webhook) em vez de Baileys direto.
- **Por que escolhi:** sobe mais rápido para MVP, já expõe endpoints de QR e envio de mensagens sem precisar gerenciar socket/eventos do WhatsApp no backend.
- **Limitações:** depende de uma instância Evolution disponível; para demo local sem Evolution, o projeto entra em **modo mock** (log em console para envio WhatsApp).
- **Como migrar para robusto:** abstração já separada em `src/integrations/evolutionClient.ts`; dá para trocar por Baileys oficial interno ou outro provider mantendo `conversationService` e serviços de domínio.

---

## 1) Visão geral da arquitetura

Fluxo principal:
1. Webhook recebe mensagem WhatsApp (`/webhooks/whatsapp`).
2. Sistema registra lead e histórico.
3. Extrai sinais de intenção + calcula score.
4. Consulta estoque real no SQLite.
5. Gera resposta comercial via Claude API (ou fallback mock sem API key).
6. Envia resposta e, se pedido, fotos do veículo.
7. Se lead ficar **quente**, gera resumo e faz handoff para vendedor.

Camadas:
- **Controllers/Routes**: entrada HTTP/webhook.
- **Services**: regras de negócio (qualificação, handoff, conversa).
- **Repositories**: acesso a dados SQLite.
- **Integrations**: Claude + Evolution API.
- **Database**: schema e seed de veículos.

---

## 2) Árvore de pastas

```bash
.
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── controllers
│   │   ├── leadController.ts
│   │   ├── vehicleController.ts
│   │   └── whatsappController.ts
│   ├── database
│   │   ├── connection.ts
│   │   └── seed.ts
│   ├── integrations
│   │   ├── claudeClient.ts
│   │   └── evolutionClient.ts
│   ├── prompts
│   │   └── attendantPrompt.ts
│   ├── repositories
│   │   ├── leadRepository.ts
│   │   └── vehicleRepository.ts
│   ├── routes
│   │   └── index.ts
│   ├── services
│   │   ├── conversationService.ts
│   │   ├── leadService.ts
│   │   └── vehicleService.ts
│   ├── types
│   │   └── domain.ts
│   └── utils
│       ├── config.ts
│       └── intentScorer.ts
├── .env.example
├── tsconfig.backend.json
└── README.md
```

---

## 3) Arquivos principais e o que fazem

### `src/server.ts`
- Inicializa banco, seed e servidor Express.

### `src/controllers/whatsappController.ts`
- `POST /whatsapp/setup`: cria/conecta instância na Evolution (retorna dados do QR quando disponível).
- `POST /webhooks/whatsapp`: recebe mensagens, processa conversa e responde automaticamente.

### `src/services/conversationService.ts`
Implementa os requisitos críticos:
- Recebe mensagem do lead.
- Salva histórico.
- Extrai intenção (`pediu preço/foto/financiamento/troca/...`).
- Atualiza score e temperatura:
  - 0-3 frio
  - 4-7 morno
  - 8+ quente
- Consulta estoque real (`buscarVeiculos`, `detalharVeiculo`, `listarFotos`).
- Gera resposta com Claude em PT-BR.
- Envia fotos quando solicitado.
- Faz handoff automático para vendedor quando quente.

### `src/services/leadService.ts`
Funções internas equivalentes pedidas:
- `registrarLead`
- `atualizarLeadScore`
- `classificarLead`
- `gerarResumoAtendimento`
- `solicitarHumano`
- `encaminharParaVendedor`
- `agendarVisita`

### `src/services/vehicleService.ts`
- `buscarVeiculos(filtros)`
- `detalharVeiculo(id)`
- `listarFotos(id)`

### `src/database/connection.ts`
Tabelas criadas:
- `leads`
- `messages`
- `vehicles`
- `handoffs`
- `appointments`

### `src/database/seed.ts`
- Seed com **10 veículos fictícios** e fotos mockadas.

### `src/prompts/attendantPrompt.ts`
Prompt interno com regras comerciais:
- não inventar dados,
- resposta curta,
- condução para conversão,
- transferência no momento certo.

---

## 4) Instruções para rodar

### 4.1 Pré-requisitos
- Node.js 20+
- npm
- Evolution API rodando (opcional para testes reais de WhatsApp)

### 4.2 Instalação
```bash
npm install
cp .env.example .env
```

### 4.3 Configuração mínima (`.env`)
- `ANTHROPIC_API_KEY`: chave Claude (opcional; sem ela usa fallback mock)
- `EVOLUTION_BASE_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE_NAME`, `EVOLUTION_WEBHOOK_URL`
- `SELLER_NAME`, `SELLER_PHONE`, `SELLER_WHATSAPP`

### 4.4 Inicialização
```bash
npm run db:seed
npm run dev:backend
```

### 4.5 Endpoints úteis
- Health: `GET /health`
- Setup WhatsApp/QR: `POST /whatsapp/setup`
- Webhook entrada WhatsApp: `POST /webhooks/whatsapp`
- Listar estoque: `GET /vehicles?termo=corolla&precoMax=130000`
- Detalhar veículo: `GET /vehicles/:id`
- Fotos veículo: `GET /vehicles/:id/photos`
- Lead + histórico: `GET /leads/:id`
- Resumo do lead: `GET /leads/:id/resumo`

---

## Exemplos de payload

### Webhook (simulado)
```json
{
  "from": "5511999990000",
  "text": "Tem Corolla automático até 130 mil?"
}
```

### Webhook (formato comum Evolution/Baileys)
```json
{
  "data": {
    "pushName": "Carlos",
    "key": { "remoteJid": "5511999990000@s.whatsapp.net" },
    "message": {
      "conversation": "Tenho 20 mil de entrada e quero financiar"
    }
  }
}
```

---

## Exemplos de conversa (resumidos)

### Exemplo 1 - Lead morno
Cliente: “Quais carros vocês têm até 80 mil?”
- IA consulta estoque real
- IA responde opções reais (ID/modelo/preço)
- IA pergunta próximo passo: “Quer que eu te mande fotos de algum ID específico?”

### Exemplo 2 - Lead quente com handoff
Cliente: “Tenho 20 mil de entrada, quero agendar visita hoje.”
- Score sobe (entrada + urgência + visita)
- Temperatura vira quente
- Sistema gera resumo, registra handoff e responde:
  - “Perfeito... te conectar direto com nosso vendedor... {SELLER_NAME} - {SELLER_WHATSAPP}”

---

## 5) Próximos passos (evolução)

1. Adicionar autenticação/admin para time comercial.
2. Dashboard de leads por temperatura + funil.
3. Regras de horário comercial e SLA.
4. Migração SQLite -> PostgreSQL (substituir repositórios por ORM leve).
5. Fila assíncrona (BullMQ) para alta escala.
6. Testes automatizados (unit + integração webhook).
7. Trocar parser heurístico por classificação híbrida (heurística + LLM estruturado).

---

## Observações importantes
- O MVP **não inventa dados**: respostas de veículos dependem do estoque no banco.
- Sem Evolution configurada, envio WhatsApp fica mockado via console.
- Sem Claude API key, resposta cai em fallback seguro/comercial.
