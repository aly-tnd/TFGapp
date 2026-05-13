import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message
    });
  }

  console.error('❌ Unexpected error:', err);
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Error interno del servidor'
  });
};

export const asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<unknown> | unknown) => {
  return (req: Request, res: Response, next?: NextFunction) => {
    Promise.resolve(fn(req, res)).catch((err: Error) => {
      if (next) next(err);
      else {
        console.error('Error:', err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
    });
  };
};
