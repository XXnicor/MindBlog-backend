import { Request } from 'express';

export interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserDTO {
  id: number;
  nome: string;
  email: string;
}

export interface Article {
  id: number;
  titulo: string;
  conteudo: string;
  id_autor: number;
  data_publicacao: Date;
  data_alteracao: Date;
  imagem_banner: string | null;
}

export interface ArticleWithAuthor extends Article {
  autor_nome: string;
  autor_email: string;
}

export interface AuthRequest extends Request {
  userId?: number;
  file?: Express.Multer.File;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

export interface CreateArticleData {
  titulo: string;
  conteudo: string;
  imagem_banner?: string;
}

export interface UpdateArticleData {
  titulo?: string;
  conteudo?: string;
  imagem_banner?: string;
}

export interface JwtPayload {
  userId: number;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
}