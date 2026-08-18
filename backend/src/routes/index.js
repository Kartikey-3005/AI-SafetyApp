import { Router } from 'express';
import scanRoutes from './scan.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/scan', scanRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
