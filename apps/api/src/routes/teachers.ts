import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get all teachers
router.get('/', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    console.log('Fetching teachers with schoolId:', req.schoolId);
    const where: any = { user: { schoolId: req.schoolId } };
    if (search) {
      where.OR = [
        { employeeId: { contains: search as string, mode: 'insensitive' } },
        { user: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { user: { lastName: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true } } },
      }),
      prisma.teacher.count({ where }),
    ]);

    console.log('Found teachers:', teachers.length);
    res.json({
      success: true,
      data: teachers,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    next(error);
  }
});

// Get teacher by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true } }, subjects: { include: { class: true } }, classes: true },
    });
    if (!teacher) {
      res.status(404).json({ success: false, error: 'Teacher not found' });
      return;
    }
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
});

// Create teacher
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('userId').isString(),
    body('employeeId').trim().notEmpty(),
    body('qualification').trim().notEmpty(),
    body('experience').isInt(),
    body('joiningDate').isISO8601(),
    body('salary').isFloat(),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      // Verify school exists
      const school = await prisma.school.findUnique({
        where: { id: req.schoolId },
      });
      
      if (!school) {
        res.status(400).json({ 
          success: false, 
          error: 'School not found. Please contact administrator.' 
        });
        return;
      }
      
      const teacher = await prisma.teacher.create({
        data: req.body,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      });
      res.status(201).json({ success: true, data: teacher });
    } catch (error) {
      next(error);
    }
  }
);

// Update teacher
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('qualification').optional().trim().notEmpty(),
    body('specialization').optional().trim().notEmpty(),
    body('experience').optional().isInt(),
    body('salary').optional().isFloat(),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const teacher = await prisma.teacher.update({
        where: { id: req.params.id },
        data: req.body,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      });
      res.json({ success: true, data: teacher });
    } catch (error) {
      next(error);
    }
  }
);

// Delete teacher
router.delete('/:id', authorizeRoles('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    await prisma.teacher.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as teacherRouter };
