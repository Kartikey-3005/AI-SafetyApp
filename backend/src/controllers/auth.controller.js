import { AuthService } from '../services/auth.service.js';

/**
 * POST /api/auth/login
 */
export async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required fields.',
      });
    }

    const authResult = await AuthService.loginWithEmail({ email, password });
    return res.status(200).json({
      message: 'Authentication successful.',
      ...authResult,
    });
  } catch (error) {
    return res.status(401).json({
      error: 'Authentication Failed',
      message: error.message || 'Invalid credentials provided.',
    });
  }
}

/**
 * POST /api/auth/register
 */
export async function registerHandler(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, email, and password are required.',
      });
    }

    const authResult = await AuthService.registerWithEmail({ name, email, password, role });
    return res.status(201).json({
      message: 'Account created successfully.',
      ...authResult,
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Registration Failed',
      message: error.message,
    });
  }
}

/**
 * POST /api/auth/google
 */
export async function googleAuthHandler(req, res) {
  try {
    const { email, name, googleId, avatarUrl, role } = req.body;
    if (!email) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Google account email is required.',
      });
    }

    const authResult = await AuthService.loginWithGoogle({
      email,
      name,
      googleId,
      avatarUrl,
      role,
    });

    return res.status(200).json({
      message: 'Google authentication successful.',
      ...authResult,
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Google Authentication Failed',
      message: error.message,
    });
  }
}

/**
 * GET /api/auth/me
 */
export async function getMeHandler(req, res) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'No auth token provided.' });
    }

    const payload = AuthService.verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Token is invalid or expired.' });
    }

    return res.status(200).json({
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
