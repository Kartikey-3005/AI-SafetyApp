import { Router } from 'express';
import { handleScan } from '../controllers/scan.controller.js';
import { scanUrlHandler } from '../controllers/urlScan.controller.js';

const router = Router();

// General multi-platform content payload scanner (Discord, Roblox, YouTube, Text)
router.post('/', handleScan);

// Dedicated Core URL Gatekeeper scanner (Layer 1, Layer 2, Layer 3, Redis cache)
router.post('/url', scanUrlHandler);

export default router;
