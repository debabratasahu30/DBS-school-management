import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get all students
router.get('/', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { classId, page = 1, limit = 10, search } = req.query;
    const where: any = { user: { schoolId: req.schoolId } };
    if (classId) where.classId = classId;
    if (search) {
      where.OR = [
        { admissionNo: { contains: search as string, mode: 'insensitive' } },
        { user: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { user: { lastName: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true } }, class: true, guardian: { include: { user: { select: { firstName: true, lastName: true, phone: true } } } } },
      }),
      prisma.student.count({ where }),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get student by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true } }, class: true, guardian: { include: { user: true } } },
    });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
});

// Create student
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('userId').isString(),
    body('admissionNo').trim().notEmpty(),
    body('dateOfBirth').isISO8601(),
    body('gender').isIn(['MALE', 'FEMALE', 'OTHER']),
    body('address').trim().notEmpty(),
    body('classId').isString(),
    body('guardianId').isString(),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      // Verify school exists
      const school = await prisma.school.findUnique({
        where: { id: req.schoolId },
      });
      
      if (!school) {
        return res.status(400).json({ 
          success: false, 
          error: 'School not found. Please contact administrator.' 
        });
      }
      
      const student = await prisma.student.create({
        data: req.body,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, class: true },
      });
      res.status(201).json({ success: true, data: student });
    } catch (error) {
      next(error);
    }
  }
);

// Update student
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('address').optional().trim().notEmpty(),
    body('classId').optional().isString(),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'GRADUATED']),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const student = await prisma.student.update({
        where: { id: req.params.id },
        data: req.body,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, class: true },
      });
      res.json({ success: true, data: student });
    } catch (error) {
      next(error);
    }
  }
);

// Delete student
router.delete('/:id', authorizeRoles('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    await prisma.student.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as studentRouter };
