import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError(401, 'Token no proporcionado'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secreto-seguro') as any;
    req.user = decoded;
    next();
  } catch {
    next(new AppError(401, 'Token inválido o expirado'));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return next(new AppError(403, 'No tienes permisos para acceder a este recurso'));
    }
    next();
  };
};
