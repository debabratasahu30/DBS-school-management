import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get all subjects
router.get('/', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { classId, page = 1, limit = 10 } = req.query;
    const where: any = {};
    if (classId) where.classId = classId;

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { class: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
      }),
      prisma.subject.count({ where }),
    ]);

    res.json({
      success: true,
      data: subjects,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get subject by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: { class: true, teacher: { include: { user: true } } },
    });
    if (!subject) {
      res.status(404).json({ success: false, error: 'Subject not found' });
      return;
    }
    res.json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
});

// Create subject
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('name').trim().notEmpty(),
    body('code').trim().notEmpty(),
    body('classId').isString(),
    body('teacherId').isString(),
    body('weeklyHours').isInt(),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      // Verify class exists
      const classExists = await prisma.class.findUnique({
        where: { id: req.body.classId },
      });
      
      if (!classExists) {
        res.status(400).json({ 
          success: false, 
          error: 'Class not found.' 
        });
        return;
      }
      
      // Verify teacher exists
      const teacherExists = await prisma.teacher.findUnique({
        where: { id: req.body.teacherId },
      });
      
      if (!teacherExists) {
        res.status(400).json({ 
          success: false, 
          error: 'Teacher not found.' 
        });
        return;
      }
      
      const subject = await prisma.subject.create({
        data: req.body,
        include: { class: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
      });
      res.status(201).json({ success: true, data: subject });
    } catch (error) {
      next(error);
    }
  }
);

// Update subject
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('name').optional().trim().notEmpty(),
    body('teacherId').optional().isString(),
    body('weeklyHours').optional().isInt(),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const subject = await prisma.subject.update({
        where: { id: req.params.id },
        data: req.body,
        include: { class: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
      });
      res.json({ success: true, data: subject });
    } catch (error) {
      next(error);
    }
  }
);

// Delete subject
router.delete('/:id', authorizeRoles('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    await prisma.subject.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as subjectRouter };
