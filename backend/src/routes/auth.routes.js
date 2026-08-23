import { Router } from 'express';
import {
  loginHandler,
  registerHandler,
  googleAuthHandler,
  getMeHandler,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.post('/google', googleAuthHandler);
router.get('/me', getMeHandler);

export default router;
