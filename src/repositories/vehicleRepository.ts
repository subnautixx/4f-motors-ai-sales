import { db } from '../database/connection.js';
import { Vehicle } from '../types/domain.js';

interface VehicleFilters {
  termo?: string;
  precoMax?: number;
  apenasDisponivel?: boolean;
}

const parseVehicle = (row: any): Vehicle => ({
  ...row,
  fotos: JSON.parse(row.fotos)
});

export const vehicleRepository = {
  buscarVeiculos(filtros: VehicleFilters = {}): Vehicle[] {
    const conditions: string[] = [];
    const params: Record<string, unknown> = {};

    if (filtros.termo) {
      conditions.push('(LOWER(marca) LIKE @termo OR LOWER(modelo) LIKE @termo OR LOWER(versao) LIKE @termo)');
      params.termo = `%${filtros.termo.toLowerCase()}%`;
    }

    if (filtros.precoMax) {
      conditions.push('preco <= @precoMax');
      params.precoMax = filtros.precoMax;
    }

    if (filtros.apenasDisponivel !== false) {
      conditions.push('disponivel = 1');
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = db.prepare(`SELECT * FROM vehicles ${where} ORDER BY destaque DESC, preco ASC LIMIT 20`).all(params);
    return rows.map(parseVehicle);
  },

  detalharVeiculo(id: number): Vehicle | null {
    const row = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
    return row ? parseVehicle(row) : null;
  },

  listarFotos(id: number): string[] {
    const row = db.prepare('SELECT fotos FROM vehicles WHERE id = ?').get(id) as { fotos: string } | undefined;
    return row ? JSON.parse(row.fotos) : [];
  }
};
