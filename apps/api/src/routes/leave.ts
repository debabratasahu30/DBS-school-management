import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';
import { io } from '../index';

const router = Router();

router.use(authenticateToken);

// Get all leave applications
router.get('/', apiLimiter, async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const { studentId, status, page = 1, limit = 10 } = req.query;
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      prisma.leaveApplication.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { student: { include: { user: { select: { firstName: true, lastName: true } }, class: true } }, applicant: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.leaveApplication.count({ where }),
    ]);

    res.json({
      success: true,
      data: applications,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get leave application by ID
router.get('/:id', async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const application = await prisma.leaveApplication.findUnique({
      where: { id: req.params.id },
      include: { student: { include: { user: true, class: true } }, applicant: true },
    });
    if (!application) {
      res.status(404).json({ success: false, error: 'Leave application not found' });
      return;
    }
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

// Create leave application
router.post(
  '/',
  validateRequest([
    body('studentId').isString(),
    body('leaveType').isIn(['SICK', 'PERSONAL', 'FAMILY', 'OTHER']),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('reason').trim().notEmpty(),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const application = await prisma.leaveApplication.create({
        data: { ...req.body, status: 'PENDING', appliedBy: req.userId },
        include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } },
      });

      // Emit notification via Socket.io
      if (io && req.schoolId) {
        io.emitNotification(req.schoolId!, 'TEACHER', 'new-leave-application', application);
      }

      res.status(201).json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  }
);

// Approve/Reject leave application
router.put(
  '/:id/status',
  authorizeRoles('ADMIN', 'TEACHER'),
  validateRequest([
    body('status').isIn(['APPROVED', 'REJECTED']),
    body('rejectionReason').optional().trim().notEmpty(),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const { status, rejectionReason } = req.body;
      const application = await prisma.leaveApplication.update({
        where: { id: req.params.id },
        data: {
          status,
          approvedBy: req.userId,
          approvalDate: new Date(),
          rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        },
        include: { student: { include: { user: true } } },
      });

      // Emit notification via Socket.io
      if (io && req.schoolId) {
        io.emitNotification(req.schoolId!, 'PARENT', `leave-${status.toLowerCase()}`, application);
      }

      res.json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  }
);

export { router as leaveRouter };
