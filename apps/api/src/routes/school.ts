import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get all schools
router.get('/', apiLimiter, authorizeRoles('ADMIN'), async (_req: AuthRequest, res, next): Promise<void> => {
  try {
    const schools = await prisma.school.findMany();
    res.json({ success: true, data: schools });
  } catch (error) {
    next(error);
  }
});

// Get school by ID
router.get('/:id', async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const school = await prisma.school.findUnique({ where: { id: req.params.id } });
    if (!school) {
      res.status(404).json({ success: false, error: 'School not found' });
      return;
    }
    res.json({ success: true, data: school });
  } catch (error) {
    next(error);
  }
});

// Create school
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('name').trim().notEmpty(),
    body('code').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('email').isEmail(),
    body('principalName').trim().notEmpty(),
    body('academicYear').trim().notEmpty(),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const school = await prisma.school.create({ data: req.body });
      res.status(201).json({ success: true, data: school });
    } catch (error) {
      next(error);
    }
  }
);

// Update school
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('name').optional().trim().notEmpty(),
    body('code').optional().trim().notEmpty(),
    body('address').optional().trim().notEmpty(),
    body('phone').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const school = await prisma.school.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: school });
    } catch (error) {
      next(error);
    }
  }
);

// Delete school
router.delete('/:id', authorizeRoles('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    await prisma.school.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'School deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as schoolRouter };
