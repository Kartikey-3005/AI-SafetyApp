import crypto from 'crypto';
import prisma, { isDbConnected } from '../config/prisma.js';

// Seed demo users for instant offline or development testing
const inMemoryUsers = new Map([
  [
    'guardian@safekids.ai',
    {
      id: 'user_guardian_01',
      name: 'Sarah Connor',
      email: 'guardian@safekids.ai',
      passwordHash: hashPassword('SafeKids2026!'),
      role: 'PARENT',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SarahGuardian',
      authProvider: 'EMAIL',
      createdAt: new Date().toISOString(),
    },
  ],
  [
    'child@safekids.ai',
    {
      id: 'user_child_01',
      name: 'Leo Connor',
      email: 'child@safekids.ai',
      passwordHash: hashPassword('SafeKids2026!'),
      role: 'CHILD',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=LeoChild',
      authProvider: 'EMAIL',
      createdAt: new Date().toISOString(),
    },
  ],
]);

function hashPassword(password) {
  return crypto.createHash('sha256').update(`safekids_salt_${password}`).digest('hex');
}

function generateAuthToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })
  ).toString('base64');

  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'safekids_secure_neural_secret')
    .update(payload)
    .digest('hex');

  return `${payload}.${signature}`;
}

export class AuthService {
  /**
   * Email & Password Login
   */
  static async loginWithEmail({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const inputHash = hashPassword(password);

    let user = null;

    // 1. Try DB lookup if connected
    if (isDbConnected() && prisma?.user) {
      try {
        user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
      } catch (e) {
        console.warn('[DB] User lookup failed, using memory store:', e.message);
      }
    }

    // 2. Memory store lookup if not found in DB
    if (!user) {
      user = inMemoryUsers.get(normalizedEmail);
    }

    if (!user) {
      throw new Error('Invalid email or password credentials.');
    }

    if (user.passwordHash && user.passwordHash !== inputHash) {
      throw new Error('Invalid email or password credentials.');
    }

    const token = generateAuthToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`,
        authProvider: user.authProvider || 'EMAIL',
      },
    };
  }

  /**
   * Email & Password Registration
   */
  static async registerWithEmail({ name, email, password, role = 'PARENT' }) {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = hashPassword(password);
    const validRole = role.toUpperCase() === 'CHILD' ? 'CHILD' : 'PARENT';
    const userId = `user_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    // Check existing
    if (inMemoryUsers.has(normalizedEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: validRole,
      avatarUrl,
      authProvider: 'EMAIL',
      createdAt: new Date().toISOString(),
    };

    // Store in memory
    inMemoryUsers.set(normalizedEmail, newUser);

    // Persist to DB if connected
    if (isDbConnected() && prisma?.user) {
      try {
        await prisma.user.create({
          data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            passwordHash: newUser.passwordHash,
            role: newUser.role,
            avatarUrl: newUser.avatarUrl,
            authProvider: 'EMAIL',
          },
        });
      } catch (dbErr) {
        console.warn('[DB] User registration DB write failed:', dbErr.message);
      }
    }

    const token = generateAuthToken(newUser);

    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl,
        authProvider: 'EMAIL',
      },
    };
  }

  /**
   * Google OAuth / One-Click Authentication
   */
  static async loginWithGoogle({ email, name, googleId, avatarUrl, role = 'PARENT' }) {
    if (!email) {
      throw new Error('Valid Google account email is required.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = null;

    // Check DB if connected
    if (isDbConnected() && prisma?.user) {
      try {
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: normalizedEmail },
              { googleId: googleId || undefined }
            ]
          }
        });
      } catch (e) {
        console.warn('[DB] Google auth DB query failed:', e.message);
      }
    }

    // Check memory store
    if (!user) {
      user = inMemoryUsers.get(normalizedEmail);
    }

    // If user doesn't exist, create user on the fly
    if (!user) {
      const userId = `user_g_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const generatedAvatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`;

      user = {
        id: userId,
        name: name || email.split('@')[0],
        email: normalizedEmail,
        googleId: googleId || `google_${Date.now()}`,
        role: role.toUpperCase() === 'CHILD' ? 'CHILD' : 'PARENT',
        avatarUrl: generatedAvatar,
        authProvider: 'GOOGLE',
        createdAt: new Date().toISOString(),
      };

      inMemoryUsers.set(normalizedEmail, user);

      if (isDbConnected() && prisma?.user) {
        try {
          await prisma.user.create({
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              googleId: user.googleId,
              role: user.role,
              avatarUrl: user.avatarUrl,
              authProvider: 'GOOGLE',
            }
          });
        } catch (dbErr) {
          console.warn('[DB] Google user creation DB write notice:', dbErr.message);
        }
      }
    }

    const token = generateAuthToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`,
        authProvider: 'GOOGLE',
      },
    };
  }

  /**
   * Verify Token & Retrieve User
   */
  static verifyToken(token) {
    if (!token) return null;
    try {
      const [payloadB64, signature] = token.split('.');
      if (!payloadB64 || !signature) return null;

      const expectedSignature = crypto
        .createHmac('sha256', process.env.JWT_SECRET || 'safekids_secure_neural_secret')
        .update(payloadB64)
        .digest('hex');

      if (signature !== expectedSignature) return null;

      const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
      if (payload.expiresAt && Date.now() > payload.expiresAt) return null;

      return payload;
    } catch (e) {
      return null;
    }
  }
}
