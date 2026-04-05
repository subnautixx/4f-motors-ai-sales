import { Router } from 'express';
import { whatsappController } from '../controllers/whatsappController.js';
import { vehicleController } from '../controllers/vehicleController.js';
import { leadController } from '../controllers/leadController.js';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: '4f-motors-ai-mvp' });
});

router.post('/whatsapp/setup', whatsappController.setup);
router.post('/webhooks/whatsapp', whatsappController.webhook);

router.get('/vehicles', vehicleController.list);
router.get('/vehicles/:id', vehicleController.detail);
router.get('/vehicles/:id/photos', vehicleController.photos);

router.get('/leads/:id', leadController.getLead);
router.get('/leads/:id/resumo', leadController.resumo);
