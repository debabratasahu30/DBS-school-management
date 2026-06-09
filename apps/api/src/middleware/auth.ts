import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  role?: string;
  schoolId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.role = decoded.role;
    req.schoolId = decoded.schoolId;
    
    // Log for debugging
    console.log('Authenticated user:', { userId: req.userId, email: req.email, role: req.role, schoolId: req.schoolId });
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
};
