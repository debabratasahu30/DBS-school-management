import { Router } from 'express';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

router.use(authenticateToken);

// Get all transport routes
router.get('/', apiLimiter, async (req: AuthRequest, res, next): Promise<void> => {
  try {
    console.log('Prisma client models:', Object.keys(prisma).filter(k => !k.startsWith('_')));
    console.log('transportRoute exists:', 'transportRoute' in prisma);
    console.log('TransportRoute exists:', 'TransportRoute' in prisma);
    
    const { page = 1, limit = 10, search } = req.query;
    const where: any = { schoolId: req.schoolId };
    if (search) {
      where.OR = [
        { routeName: { contains: search as string, mode: 'insensitive' } },
        { vehicleNumber: { contains: search as string, mode: 'insensitive' } },
        { driverName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [routes, total] = await Promise.all([
      prisma.transportRoute.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transportRoute.count({ where }),
    ]);

    res.json({
      success: true,
      data: routes,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
});

// Get transport route by ID
router.get('/:id', async (req: AuthRequest, res, next): Promise<void> => {
  try {
    const route = await prisma.transportRoute.findUnique({
      where: { id: req.params.id },
    });
    if (!route) {
      res.status(404).json({ success: false, error: 'Transport route not found' });
      return;
    }
    res.json({ success: true, data: route });
  } catch (error) {
    next(error);
  }
});

// Create transport route
router.post(
  '/',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('routeName').trim().notEmpty(),
    body('vehicleNumber').trim().notEmpty(),
    body('driverName').trim().notEmpty(),
    body('driverPhone').trim().notEmpty(),
    body('capacity').isInt(),
    body('startPoint').trim().notEmpty(),
    body('endPoint').trim().notEmpty(),
    body('stops').trim().notEmpty(),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      console.log('Creating transport route with data:', req.body);
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
      
      const route = await prisma.transportRoute.create({
        data: { ...req.body, schoolId: req.schoolId },
      });
      
      console.log('Transport route created successfully:', route);
      res.status(201).json({ success: true, data: route });
    } catch (error) {
      console.error('Error creating transport route:', error);
      next(error);
    }
  }
);

// Update transport route
router.put(
  '/:id',
  authorizeRoles('ADMIN'),
  validateRequest([
    body('routeName').optional().trim().notEmpty(),
    body('vehicleNumber').optional().trim().notEmpty(),
    body('driverName').optional().trim().notEmpty(),
    body('driverPhone').optional().trim().notEmpty(),
    body('capacity').optional().isInt(),
    body('startPoint').optional().trim().notEmpty(),
    body('endPoint').optional().trim().notEmpty(),
    body('stops').optional().trim().notEmpty(),
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const route = await prisma.transportRoute.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: route });
    } catch (error) {
      next(error);
    }
  }
);

// Delete transport route
router.delete('/:id', authorizeRoles('ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    await prisma.transportRoute.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Transport route deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export { router as transportRouter };
