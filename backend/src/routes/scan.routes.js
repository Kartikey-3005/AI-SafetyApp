import { Router } from 'express';
import { handleScan } from '../controllers/scan.controller.js';

const router = Router();

router.post('/', handleScan);

export default router;
