import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get attendance
router.get('/', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { studentId, date, classId, page = 1, limit = 10 } = req.query;
    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (date) where.date = new Date(date as string);
    if (classId) {
      const students = await prisma.student.findMany({ where: { classId: classId as string }, select: { id: true } });
      where.studentId = { in: students.map((s: { id: string }) => s.id) };
    }

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { student: { include: { user: { select: { firstName: true, lastName: true } }, class: true } } },
        orderBy: { date: 'desc' },
      }),
      prisma.attendance.count({ where }),
    ]);

    res.json({
      success: true,
      data: attendance,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get attendance report
router.get('/report', async (req: AuthRequest, res, next) => {
  try {
    const { classId, startDate, endDate } = req.query;
    const students = await prisma.student.findMany({
      where: { classId: classId as string },
      include: { user: true, attendance: { where: { date: { gte: new Date(startDate as string), lte: new Date(endDate as string) } } } },
    });

    const report = students.map((student: any) => {
      const present = student.attendance.filter((a: any) => a.status === 'PRESENT').length;
      const absent = student.attendance.filter((a: any) => a.status === 'ABSENT').length;
      const late = student.attendance.filter((a: any) => a.status === 'LATE').length;
      return {
        student: { id: student.id, name: `${student.user.firstName} ${student.user.lastName}`, admissionNo: student.admissionNo },
        stats: { present, absent, late, total: student.attendance.length, percentage: student.attendance.length > 0 ? Math.round((present / student.attendance.length) * 100) : 0 },
      };
    });

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
});

// Mark attendance
router.post(
  '/',
  authorizeRoles('ADMIN', 'TEACHER'),
  validateRequest([
    body('records').isArray(),
    body('records.*.studentId').isString(),
    body('records.*.date').isISO8601(),
    body('records.*.status').isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const { records } = req.body;
      const attendance = await Promise.all(
        records.map((record: any) =>
          prisma.attendance.upsert({
            where: { studentId_date: { studentId: record.studentId, date: new Date(record.date) } },
            update: { status: record.status, remarks: record.remarks, markedBy: req.userId },
            create: { ...record, date: new Date(record.date), markedBy: req.userId },
          })
        )
      );
      res.status(201).json({ success: true, data: attendance });
    } catch (error) {
      next(error);
    }
  }
);

// Update attendance
router.put(
  '/:id',
  authorizeRoles('ADMIN', 'TEACHER'),
  validateRequest([
    body('status').isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const attendance = await prisma.attendance.update({
        where: { id: req.params.id },
        data: { ...req.body, markedBy: req.userId },
        include: { student: { include: { user: true } } },
      });
      res.json({ success: true, data: attendance });
    } catch (error) {
      next(error);
    }
  }
);

export { router as attendanceRouter };
