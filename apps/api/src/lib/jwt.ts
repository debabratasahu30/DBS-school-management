import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  schoolId: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as any);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};
