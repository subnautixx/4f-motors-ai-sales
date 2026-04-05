import { vehicleRepository } from '../repositories/vehicleRepository.js';

export const vehicleService = {
  buscarVeiculos(filtros: { termo?: string; precoMax?: number }) {
    return vehicleRepository.buscarVeiculos({ termo: filtros.termo, precoMax: filtros.precoMax, apenasDisponivel: true });
  },

  detalharVeiculo(id: number) {
    return vehicleRepository.detalharVeiculo(id);
  },

  listarFotos(id: number) {
    return vehicleRepository.listarFotos(id);
  }
};
