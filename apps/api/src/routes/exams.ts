import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get all exams
router.get('/', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { classId, subjectId, page = 1, limit = 10 } = req.query;
    const where: any = {};
    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { subject: { include: { teacher: { include: { user: { select: { firstName: true, lastName: true } } } } } }, class: true },
        orderBy: { date: 'desc' },
      }),
      prisma.exam.count({ where }),
    ]);

    res.json({
      success: true,
      data: exams,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get exam by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: { subject: true, class: true, results: { include: { student: { include: { user: true } } } } },
    });
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }
    res.json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
});

// Get student report card
router.get('/report-card/:studentId', async (req: AuthRequest, res, next) => {
  try {
    const { studentId } = req.params;
    const results = await prisma.examResult.findMany({
      where: { studentId },
      include: { exam: { include: { subject: true, class: true } } },
    });

    const reportCard = results.map(result => ({
      subject: result.exam.subject.name,
      examName: result.exam.name,
      examType: result.exam.type,
      date: result.exam.date,
      marksObtained: result.marksObtained,
      totalMarks: result.exam.totalMarks,
      percentage: Math.round((result.marksObtained / result.exam.totalMarks) * 100),
      grade: result.grade,
      remarks: result.remarks,
    }));

    res.json({ success: true, data: reportCard });
  } catch (error) {
    next(error);
  }
});

// Create exam
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('name').trim().notEmpty(),
    body('type').isIn(['MIDTERM', 'FINAL', 'QUIZ', 'ASSIGNMENT']),
    body('subjectId').isString(),
    body('classId').isString(),
    body('date').isISO8601(),
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('totalMarks').isInt(),
    body('passingMarks').isInt(),
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
      
      const exam = await prisma.exam.create({
        data: req.body,
        include: { subject: true, class: true },
      });
      res.status(201).json({ success: true, data: exam });
    } catch (error) {
      next(error);
    }
  }
);

// Create exam results
router.post(
  '/:id/results',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('results').isArray(),
    body('results.*.studentId').isString(),
    body('results.*.marksObtained').isFloat(),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const { results } = req.body;
      const examResults = await Promise.all(
        results.map((result: any) =>
          prisma.examResult.upsert({
            where: { examId_studentId: { examId: req.params.id, studentId: result.studentId } },
            update: { marksObtained: result.marksObtained, grade: result.grade, remarks: result.remarks },
            create: { ...result, examId: req.params.id },
          })
        )
      );
      res.status(201).json({ success: true, data: examResults });
    } catch (error) {
      next(error);
    }
  }
);

// Update exam
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const exam = await prisma.exam.update({
        where: { id: req.params.id },
        data: req.body,
        include: { subject: true, class: true },
      });
      res.json({ success: true, data: exam });
    } catch (error) {
      next(error);
    }
  }
);

// Delete exam
router.delete(
  '/:id',
  authorizeRoles('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      await prisma.exam.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: 'Exam deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as examRouter };
