import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  
  // Log completo do erro no servidor (não exposto ao cliente)
  console.error(`[${timestamp}] Error Handler - Route: ${req.method} ${req.path}`, {
    message: err.message,
    stack: err.stack,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'file_too_large',
        message: 'Arquivo muito grande. Tamanho máximo: 5MB' 
      });
    }
    return res.status(400).json({ 
      error: 'upload_error',
      message: 'Erro no upload do arquivo' 
    });
  }

  // Custom upload error codes
  if (err && err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ 
      error: 'invalid_file_type',
      message: 'Tipo de arquivo inválido' 
    });
  }

  // Other errors - sempre retorna JSON consistente
  if (err) {
    return res.status(500).json({ 
      error: 'internal_server_error',
      message: 'Erro interno do servidor' 
    });
  }

  return next();
}

export default errorHandler;