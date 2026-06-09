import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get all books
router.get('/books', apiLimiter, async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const where: any = {};
    if (category) where.category = category;

    const [books, total] = await Promise.all([
      prisma.libraryBook.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.libraryBook.count({ where }),
    ]);

    res.json({
      success: true,
      data: books,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Create book
router.post(
  '/books',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('title').trim().notEmpty(),
    body('author').trim().notEmpty(),
    body('isbn').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('totalCopies').isInt(),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const book = await prisma.libraryBook.create({
        data: { ...req.body, availableCopies: req.body.totalCopies },
      });
      res.status(201).json({ success: true, data: book });
    } catch (error) {
      next(error);
    }
  }
);

// Update book
router.put(
  '/books/:id',
  authorizeRoles('ADMIN'),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const book = await prisma.libraryBook.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: book });
    } catch (error) {
      next(error);
    }
  }
);

// Delete book
router.delete(
  '/books/:id',
  authorizeRoles('ADMIN'),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      await prisma.libraryBook.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Get book issues
router.get('/issues', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { studentId, status, page = 1, limit = 10 } = req.query;
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;

    const [issues, total] = await Promise.all([
      prisma.bookIssue.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { book: true, student: { include: { user: { select: { firstName: true, lastName: true } } } } },
        orderBy: { issueDate: 'desc' },
      }),
      prisma.bookIssue.count({ where }),
    ]);

    res.json({
      success: true,
      data: issues,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Issue book
router.post(
  '/issues',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('bookId').isString(),
    body('studentId').isString(),
    body('dueDate').isISO8601(),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const { bookId, studentId, dueDate } = req.body;

      // Check book availability
      const book = await prisma.libraryBook.findUnique({ where: { id: bookId } });
      if (!book || book.availableCopies <= 0) {
        res.status(400).json({ success: false, error: 'Book not available' });
        return;
      }

      const issue = await prisma.bookIssue.create({
        data: {
          bookId,
          studentId,
          issueDate: new Date(),
          dueDate: new Date(dueDate),
          status: 'ISSUED',
          issuedBy: req.userId,
        },
        include: { book: true, student: { include: { user: true } } },
      });

      // Update available copies
      await prisma.libraryBook.update({
        where: { id: bookId },
        data: { availableCopies: { decrement: 1 } },
      });

      res.status(201).json({ success: true, data: issue });
    } catch (error) {
      next(error);
    }
  }
);

// Return book
router.put(
  '/issues/:id/return',
  authorizeRoles('ADMIN'),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const issue = await prisma.bookIssue.findUnique({ where: { id: req.params.id } });
      if (!issue) {
        res.status(404).json({ success: false, error: 'Issue not found' });
        return;
      }

      const fine = issue.returnDate && new Date(issue.returnDate) > new Date(issue.dueDate) ? 5 : 0;

      const updatedIssue = await prisma.bookIssue.update({
        where: { id: req.params.id },
        data: {
          returnDate: new Date(),
          status: 'RETURNED',
          fine,
        },
        include: { book: true, student: { include: { user: true } } },
      });

      // Update available copies
      await prisma.libraryBook.update({
        where: { id: issue.bookId },
        data: { availableCopies: { increment: 1 } },
      });

      res.json({ success: true, data: updatedIssue });
    } catch (error) {
      next(error);
    }
  }
);

export { router as libraryRouter };
