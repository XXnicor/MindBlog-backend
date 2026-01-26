
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { JwtPayload } from '../types';
import { config } from '../config/env.config';

export class AuthMiddleware {

  public authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({
        success: false,
        message: 'Token não fornecido',});
        return;
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
        res.status(401).json({
        success: false,
        message: 'Token vazio',});
        return;
      }
       const decoded = jwt.verify(token,config.jwt.secret) as JwtPayload;
        
       console.log('[AuthMiddleware] Token decodificado:', decoded);
       console.log('[AuthMiddleware] userId extraído:', decoded.userId, 'Tipo:', typeof decoded.userId);
       
       req.userId = decoded.userId;
        
       next(); 
      
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
        success: false,
        message: 'Token inválido',});
        return;
      }
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
        success: false,
        message: 'Token expirado',});
        return;
        }
       res.status(500).json({
        success: false,
        message: 'Erro ao verificar token',});
        return;
    }
  };
}