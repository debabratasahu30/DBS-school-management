import { Router } from 'express';
import { body } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateToken);

// Get all classes
router.get('/', apiLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { academicYear, page = 1, limit = 10 } = req.query;
    const where: any = { schoolId: req.schoolId };
    if (academicYear) where.academicYear = academicYear;

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { classTeacher: { include: { user: { select: { firstName: true, lastName: true } } } }, _count: { select: { students: true } } },
      }),
      prisma.class.count({ where }),
    ]);

    res.json({
      success: true,
      data: classes,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get class by ID
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const classData = await prisma.class.findUnique({
      where: { id: req.params.id },
      include: { classTeacher: { include: { user: true } }, students: { include: { user: true } }, subjects: { include: { teacher: { include: { user: true } } } } },
    });
    if (!classData) {
      res.status(404).json({ success: false, error: 'Class not found' });
      return;
    }
    res.json({ success: true, data: classData });
  } catch (error) {
    next(error);
  }
});

// Create class
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('name').trim().notEmpty(),
    body('grade').trim().notEmpty(),
    body('section').trim().notEmpty(),
    body('capacity').isInt(),
    body('academicYear').trim().notEmpty(),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      console.log('Creating class with data:', req.body);
      console.log('School ID from token:', req.schoolId);
      
      // Verify school exists
      const school = await prisma.school.findUnique({
        where: { id: req.schoolId },
      });
      
      if (!school) {
        console.error('School not found with ID:', req.schoolId);
        res.status(400).json({ 
          success: false, 
          error: 'School not found. Please contact administrator.' 
        });
        return;
      }
      
      console.log('School found:', school.name);
      
      // Check if class with same grade, section, and academic year already exists
      const existingClass = await prisma.class.findFirst({
        where: {
          grade: req.body.grade,
          section: req.body.section,
          academicYear: req.body.academicYear,
          schoolId: req.schoolId,
        },
      });

      if (existingClass) {
        return res.status(400).json({ 
          success: false, 
          error: `Class with grade ${req.body.grade}, section ${req.body.section} already exists for academic year ${req.body.academicYear}` 
        });
      }
      
      // Prepare data - only include classTeacherId if provided
      const createData: any = {
        name: req.body.name,
        grade: req.body.grade,
        section: req.body.section,
        capacity: req.body.capacity,
        academicYear: req.body.academicYear,
        schoolId: req.schoolId,
      };
      
      if (req.body.classTeacherId) {
        createData.classTeacherId = req.body.classTeacherId;
      }
      
      console.log('Creating class with data:', createData);
      
      const classData = await prisma.class.create({
        data: createData,
        include: { classTeacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
      });
      
      console.log('Class created successfully:', classData);
      res.status(201).json({ success: true, data: classData });
    } catch (error) {
      console.error('Error creating class:', error);
      next(error);
    }
  }
);

// Update class
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('name').optional().trim().notEmpty(),
    body('capacity').optional().isInt(),
    body('classTeacherId').optional().isString(),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const classData = await prisma.class.update({
        where: { id: req.params.id },
        data: req.body,
        include: { classTeacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
      });
      res.json({ success: true, data: classData });
    } catch (error) {
      next(error);
    }
  }
);

// Delete class
router.delete('/:id', authorizeRoles('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    await prisma.class.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as classRouter };
