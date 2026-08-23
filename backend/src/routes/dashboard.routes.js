import { Router } from 'express';
import {
  getDashboardSummary,
  getDashboardLogs,
  getDashboardSettings,
  updateDashboardSettings,
} from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/summary', getDashboardSummary);
router.get('/logs', getDashboardLogs);
router.get('/settings', getDashboardSettings);
router.put('/settings', updateDashboardSettings);

export default router;
