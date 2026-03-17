export interface UserRow {
  id: number;
  nome: string;
  email: string;
  senha: string;
  avatar?: string | null;
  bio?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserDTO {
  id: number | null;
  nome: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
}

export interface User {
  id: number | null;
  nome: string;
  email: string;
  senha?: string;
  avatar?: string | null;
  bio?: string | null;
  created_at?: Date;
  updated_at?: Date;
  getSenhaHash?: () => string;
}

export interface Article {
  id: number;
  titulo: string;
  conteudo: string;
  resumo?: string | null;
  categoria: string;
  tags?: string[] | null;
  id_autor: number;
  data_publicacao: Date;
  data_alteracao?: Date;
  imagem_banner: string | null;
  views: number;
  likes: number;
}

export interface ArticleWithAuthor extends Article {
  autor_nome: string;
  autor_email: string;
  autor_avatar?: string | null;
  autor_bio?: string | null;
  commentsCount?: number;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  avatar?: string;
  bio?: string;
}

export interface CreateArticleData {
  titulo: string;
  conteudo: string;
  resumo?: string;
  categoria: string;
  tags?: string[];
  imagem_banner?: string;
}

export interface UpdateArticleData {
  titulo?: string;
  conteudo?: string;
  resumo?: string;
  categoria?: string;
  tags?: string[];
  imagem_banner?: string;
}

export interface UpdateProfileData {
  nome?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  senha_atual?: string;
  senha_nova?: string;
}

export interface Comment {
  id: number;
  text: string;
  id_article: number;
  id_author: number;
  likes: number;
  created_at: Date;
  updated_at: Date;
}

export interface CommentWithAuthor extends Comment {
  author_name: string;
  author_avatar?: string | null;
}

export interface CreateCommentData {
  text: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip?: number;
  categoria?: string;
  search?: string;
}

export interface PaginationResult<T> {
  articles: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface UserStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface JwtPayload {
  userId: number;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
}
export { AuthRequest } from './AuthRequest';
