import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicleService.js';

export const vehicleController = {
  list(req: Request, res: Response) {
    const termo = (req.query.termo as string | undefined) ?? undefined;
    const precoMax = req.query.precoMax ? Number(req.query.precoMax) : undefined;
    const vehicles = vehicleService.buscarVeiculos({ termo, precoMax });
    res.json({ total: vehicles.length, vehicles });
  },

  detail(req: Request, res: Response) {
    const id = Number(req.params.id);
    const vehicle = vehicleService.detalharVeiculo(id);
    if (!vehicle) return res.status(404).json({ error: 'Veículo não encontrado' });
    res.json(vehicle);
  },

  photos(req: Request, res: Response) {
    const id = Number(req.params.id);
    const fotos = vehicleService.listarFotos(id);
    res.json({ id, fotos });
  }
};
