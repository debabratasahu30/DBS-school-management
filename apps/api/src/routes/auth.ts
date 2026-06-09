import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Register
router.post(
  '/register',
  authLimiter,
  validateRequest([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('role').isIn(['ADMIN', 'TEACHER', 'ACCOUNTANT', 'PARENT', 'STUDENT']),
    body('schoolId').isString(),
  ]),
  async (req, res, next) => {
    try {
      const { email, password, firstName, lastName, role, phone, schoolId } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ success: false, error: 'Email already registered' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role,
          phone,
          schoolId,
        },
      });

      const tokens = {
        accessToken: generateAccessToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
        }),
        refreshToken: generateRefreshToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
        }),
      };

      res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }, ...tokens } });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post(
  '/login',
  authLimiter,
  validateRequest([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const tokens = {
        accessToken: generateAccessToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
        }),
        refreshToken: generateRefreshToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
        }),
      };

      res.json({ success: true, data: { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, schoolId: user.schoolId }, ...tokens } });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh Token
router.post('/refresh', async (req, res, next): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ success: false, error: 'Refresh token required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      schoolId: decoded.schoolId,
    });

    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    next(error);
  }
});

// Get Current User
router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, avatar: true, schoolId: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };
