import { Router } from 'express';
import scanRoutes from './scan.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/scan', scanRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
