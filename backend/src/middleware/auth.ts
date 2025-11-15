import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export type AuthUser = {
  id: string;
  username: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'unauthorized' });
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = { id: decoded.sub, username: decoded.username, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

export function requireRole(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'unauthorized' });
    if (!allowed.includes(user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}
