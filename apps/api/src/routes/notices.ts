import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';
import { io } from '../index';

const router = Router();

router.use(authenticateToken);

// Get all notices
router.get('/', apiLimiter, async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const where: any = {};
    if (category) where.category = category;

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { publisher: { select: { firstName: true, lastName: true } } },
        orderBy: { publishDate: 'desc' },
      }),
      prisma.notice.count({ where }),
    ]);

    res.json({
      success: true,
      data: notices,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get notice by ID
router.get('/:id', async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: req.params.id },
      include: { publisher: true },
    });
    if (!notice) {
      res.status(404).json({ success: false, error: 'Notice not found' });
      return;
    }
    res.json({ success: true, data: notice });
  } catch (error) {
    next(error);
  }
});

// Create notice
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('category').isIn(['GENERAL', 'ACADEMIC', 'EVENT', 'URGENT']),
    body('targetAudience').isArray(),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const notice = await prisma.notice.create({
        data: { ...req.body, publishedBy: req.userId, publishDate: new Date(), attachments: req.body.attachments || [] },
        include: { publisher: { select: { firstName: true, lastName: true } } },
      });

      // Emit notification via Socket.io
      if (io && req.schoolId) {
        notice.targetAudience.forEach((role: string) => {
          io.emitNotification(req.schoolId!, role, 'new-notice', notice);
        });
      }

      res.status(201).json({ success: true, data: notice });
    } catch (error) {
      next(error);
    }
  }
);

// Update notice
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('title').optional().trim().notEmpty(),
    body('content').optional().trim().notEmpty(),
    body('category').optional().isIn(['GENERAL', 'ACADEMIC', 'EVENT', 'URGENT']),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const notice = await prisma.notice.update({
        where: { id: req.params.id },
        data: req.body,
        include: { publisher: { select: { firstName: true, lastName: true } } },
      });
      res.json({ success: true, data: notice });
    } catch (error) {
      next(error);
    }
  }
);

// Delete notice
router.delete(
  '/:id',
  authorizeRoles('ADMIN'),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      await prisma.notice.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: 'Notice deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as noticeRouter };
