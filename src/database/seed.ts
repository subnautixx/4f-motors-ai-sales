import { db, initDatabase } from './connection.js';

initDatabase();

const vehicles = [
  ['Toyota', 'Corolla', 'XEi 2.0 AT', 2022, 129900, 32000, 'Prata', 'Automático', 'Flex', 'Único dono, revisões em dia', 1, JSON.stringify(['https://picsum.photos/seed/corolla1/1200/800', 'https://picsum.photos/seed/corolla2/1200/800']), 'Sedan', 1],
  ['Honda', 'Civic', 'EXL 2.0 CVT', 2021, 122500, 41000, 'Branco', 'Automático', 'Flex', 'Central multimídia e bancos de couro', 1, JSON.stringify(['https://picsum.photos/seed/civic1/1200/800', 'https://picsum.photos/seed/civic2/1200/800']), 'Sedan', 1],
  ['Jeep', 'Compass', 'Longitude T270', 2023, 164900, 19000, 'Cinza', 'Automático', 'Flex', 'Pacote tech e câmera 360', 1, JSON.stringify(['https://picsum.photos/seed/compass1/1200/800', 'https://picsum.photos/seed/compass2/1200/800']), 'SUV', 1],
  ['Volkswagen', 'T-Cross', 'Comfortline 200 TSI', 2022, 119800, 35000, 'Azul', 'Automático', 'Flex', 'IPVA 2026 pago', 1, JSON.stringify(['https://picsum.photos/seed/tcross1/1200/800', 'https://picsum.photos/seed/tcross2/1200/800']), 'SUV', 0],
  ['Chevrolet', 'Onix', 'Premier 1.0 Turbo', 2023, 94500, 27000, 'Vermelho', 'Automático', 'Flex', 'Impecável de lataria', 1, JSON.stringify(['https://picsum.photos/seed/onix1/1200/800', 'https://picsum.photos/seed/onix2/1200/800']), 'Hatch', 0],
  ['Hyundai', 'Creta', 'Platinum 1.0 TGDI', 2024, 152900, 9000, 'Preto', 'Automático', 'Flex', 'Garantia de fábrica ativa', 1, JSON.stringify(['https://picsum.photos/seed/creta1/1200/800', 'https://picsum.photos/seed/creta2/1200/800']), 'SUV', 1],
  ['Fiat', 'Pulse', 'Impetus Turbo 200', 2023, 108700, 21000, 'Prata', 'Automático', 'Flex', 'Com teto panorâmico', 1, JSON.stringify(['https://picsum.photos/seed/pulse1/1200/800', 'https://picsum.photos/seed/pulse2/1200/800']), 'SUV', 0],
  ['Nissan', 'Kicks', 'Exclusive 1.6 CVT', 2022, 113400, 33000, 'Branco', 'Automático', 'Flex', 'Laudo cautelar aprovado', 1, JSON.stringify(['https://picsum.photos/seed/kicks1/1200/800', 'https://picsum.photos/seed/kicks2/1200/800']), 'SUV', 0],
  ['BMW', '320i', 'GP 2.0 Turbo', 2021, 219900, 39000, 'Cinza', 'Automático', 'Gasolina', 'Pacote M Sport visual', 1, JSON.stringify(['https://picsum.photos/seed/bmw1/1200/800', 'https://picsum.photos/seed/bmw2/1200/800']), 'Premium', 1],
  ['Toyota', 'Hilux', 'SRX 2.8 4x4', 2020, 229800, 78000, 'Preto', 'Automático', 'Diesel', 'Pneus novos e capota marítima', 1, JSON.stringify(['https://picsum.photos/seed/hilux1/1200/800', 'https://picsum.photos/seed/hilux2/1200/800']), 'Picape', 1]
];

const count = db.prepare('SELECT COUNT(*) as total FROM vehicles').get() as { total: number };
if (count.total === 0) {
  const stmt = db.prepare(`
    INSERT INTO vehicles (marca, modelo, versao, ano, preco, km, cor, cambio, combustivel, observacoes, disponivel, fotos, categoria, destaque)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction(() => {
    for (const vehicle of vehicles) {
      stmt.run(...vehicle);
    }
  });

  insertMany();
  console.log('Seed concluído com 10 veículos.');
} else {
  console.log('Tabela vehicles já possui registros. Seed ignorado.');
}
