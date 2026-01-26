import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'Arquivo muito grande. Tamanho máximo: 5MB' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }

  // Custom upload error codes
  if (err && err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ success: false, message: err.message || 'Tipo de arquivo inválido' });
  }

  // Other errors
  if (err) {
    return res.status(500).json({ success: false, message: err.message || 'Erro interno' });
  }

  return next();
}

export default errorHandler;