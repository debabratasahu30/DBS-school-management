import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get all fee structures
router.get('/structures', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { classId, academicYear, page = 1, limit = 10 } = req.query;
    const where: any = {};
    if (classId) where.classId = classId;
    if (academicYear) where.academicYear = academicYear;

    const [structures, total] = await Promise.all([
      prisma.feeStructure.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { class: true },
      }),
      prisma.feeStructure.count({ where }),
    ]);

    res.json({
      success: true,
      data: structures,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Create fee structure
router.post(
  '/structures',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('name').trim().notEmpty(),
    body('classId').isString(),
    body('amount').isFloat(),
    body('dueDate').isISO8601(),
    body('academicYear').trim().notEmpty(),
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
      
      const structure = await prisma.feeStructure.create({
        data: { ...req.body, schoolId: req.schoolId },
        include: { class: true },
      });
      res.status(201).json({ success: true, data: structure });
    } catch (error) {
      next(error);
    }
  }
);

// Get fee payments
router.get('/payments', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { studentId, status, page = 1, limit = 10 } = req.query;
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      prisma.feePayment.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { student: { include: { user: { select: { firstName: true, lastName: true } } } }, feeStructure: true, receiver: { select: { firstName: true, lastName: true } } },
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.feePayment.count({ where }),
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get outstanding fees
router.get('/outstanding', async (req: AuthRequest, res, next) => {
  try {
    const { classId } = req.query;
    const where: any = { status: { in: ['PENDING', 'OVERDUE', 'PARTIAL'] } };
    if (classId) {
      const students = await prisma.student.findMany({ where: { classId: classId as string }, select: { id: true } });
      where.studentId = { in: students.map(s => s.id) };
    }

    const outstanding = await prisma.feePayment.findMany({
      where,
      include: { student: { include: { user: { select: { firstName: true, lastName: true } }, class: true } }, feeStructure: true },
    });

    res.json({ success: true, data: outstanding });
  } catch (error) {
    next(error);
  }
});

// Create fee payment
router.post(
  '/payments',
  authorizeRoles('ADMIN', 'ACCOUNTANT'),
  validateRequest([
    body('studentId').isString(),
    body('feeStructureId').isString(),
    body('amount').isFloat(),
    body('paymentDate').isISO8601(),
    body('paymentMethod').isIn(['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE']),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const payment = await prisma.feePayment.create({
        data: { ...req.body, receivedBy: req.userId, status: 'PAID' },
        include: { student: { include: { user: { select: { firstName: true, lastName: true } } } }, feeStructure: true },
      });
      res.status(201).json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }
);

// Update fee payment
router.put(
  '/payments/:id',
  authorizeRoles('ADMIN', 'ACCOUNTANT'),
  async (req: AuthRequest, res, next) => {
    try {
      const payment = await prisma.feePayment.update({
        where: { id: req.params.id },
        data: req.body,
        include: { student: { include: { user: true } }, feeStructure: true },
      });
      res.json({ success: true, data: payment });
    } catch (error) {
      next(error);
    }
  }
);

export { router as feeRouter };
