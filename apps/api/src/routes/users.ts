import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get all users (filtered by school)
router.get('/', apiLimiter, authorizeRoles('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const where: any = { schoolId: req.schoolId };
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, avatar: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, avatar: true, schoolId: true, createdAt: true },
    });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put(
  '/:id',
  validateRequest([
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('phone').optional().trim().notEmpty(),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const { password, ...updateData } = req.body;
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: updateData,
        select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true, avatar: true },
      });
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
);

// Delete user
router.delete('/:id', authorizeRoles('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as userRouter };
