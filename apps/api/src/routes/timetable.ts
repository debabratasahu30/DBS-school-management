import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get timetable by class
router.get('/', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { classId } = req.query;
    const where: any = {};
    if (classId) where.classId = classId;

    const timetable = await prisma.timetable.findMany({
      where,
      include: { class: true, subject: { include: { teacher: { include: { user: { select: { firstName: true, lastName: true } } } } } } },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    res.json({ success: true, data: timetable });
  } catch (error) {
    next(error);
  }
});

// Create timetable entry
router.post(
  '/',
  validateRequest([
    body('classId').isString(),
    body('subjectId').isString(),
    body('dayOfWeek').isInt({ min: 1, max: 7 }),
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      // Verify class exists
      const classExists = await prisma.class.findUnique({
        where: { id: req.body.classId },
      });
      
      if (!classExists) {
        return res.status(400).json({ 
          success: false, 
          error: 'Class not found.' 
        });
      }
      
      // Verify subject exists
      const subjectExists = await prisma.subject.findUnique({
        where: { id: req.body.subjectId },
      });
      
      if (!subjectExists) {
        return res.status(400).json({ 
          success: false, 
          error: 'Subject not found.' 
        });
      }
      
      const timetable = await prisma.timetable.create({
        data: req.body,
        include: { class: true, subject: true },
      });
      res.status(201).json({ success: true, data: timetable });
    } catch (error) {
      next(error);
    }
  }
);

// Update timetable entry
router.put(
  '/:id',
  validateRequest([
    body('subjectId').optional().isString(),
    body('dayOfWeek').optional().isInt({ min: 1, max: 7 }),
    body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const timetable = await prisma.timetable.update({
        where: { id: req.params.id },
        data: req.body,
        include: { class: true, subject: true },
      });
      res.json({ success: true, data: timetable });
    } catch (error) {
      next(error);
    }
  }
);

// Delete timetable entry
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    await prisma.timetable.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Timetable entry deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as timetableRouter };
