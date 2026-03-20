import { Request, Response } from 'express';
import { ArticleService } from '../services/ArticleService';
import { CreateArticleData, UpdateArticleData } from '../types';
import { AuthRequest } from '../types/AuthRequest';
import multer from 'multer';

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  private formatImageUrl(article: any): any {
    if (article.imagem_banner) {
      const baseUrl = process.env.NODE_ENV === 'production'
        ? `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`
        : `http://localhost:${process.env.PORT ?? 3001}`;

      article.imagem_banner_url = `${baseUrl}/uploads/${article.imagem_banner}`;
    } else {
      article.imagem_banner_url = null;
    }
    return article;
  }

  private formatAuthor(article: any): any {
    return {
      ...article,
      autor: article.autor ?? {
        id: article.id_autor,
        nome: article.autor_nome,
        email: article.autor_email,
        avatar: article.autor_avatar,
        bio: article.autor_bio
      }
    };
  }

  public listAll = async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    const route = '/api/articles';
    
    try {
      const pageParam = parseInt(req.query.page as string, 10);
      const limitParam = parseInt(req.query.limit as string, 10);
      const categoria = req.query.categoria as string;
      const search = req.query.search as string;

      const page = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1;
      const limit = Number.isInteger(limitParam) && limitParam >= 1 ? Math.min(limitParam, 100) : 10;
      const skip = (page - 1) * limit;

      const result = await this.articleService.getArticlesWithPagination({
        page,
        limit,
        skip,
        categoria,
        search
      });

      const articlesWithUrls = result.articles
        .map(article => this.formatAuthor(article))
        .map(article => this.formatImageUrl(article));

      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${route} - Success - page:${page} limit:${limit} total:${result.pagination.totalItems} duration:${duration}ms`);

      res.status(200).json({
        articles: articlesWithUrls,
        pagination: {
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          totalItems: result.pagination.totalItems,
          itemsPerPage: result.pagination.itemsPerPage,
          hasNextPage: result.pagination.currentPage < result.pagination.totalPages,
          hasPreviousPage: result.pagination.currentPage > 1
        }
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      const err = error as Error;
      
      console.error(`[${new Date().toISOString()}] ${route} - Error - duration:${duration}ms`, {
        message: err.message,
        stack: err.stack,
        query: {
          page: req.query.page,
          limit: req.query.limit,
          categoria: req.query.categoria,
          search: req.query.search
        }
      });

      res.status(500).json({
      error: 'internal_server_error',
      message: err.message
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ message: 'ID inválido' });
        return;
      }

      const article = await this.articleService.getArticleById(id);

      if (!article) {
        res.status(404).json({ message: 'Artigo não encontrado' });
        return;
      }

      const articleFormatted = this.formatImageUrl(this.formatAuthor(article));

      res.status(200).json({ data: articleFormatted });
    } catch (error) {
      const err = error as Error;
      console.error(`[ArticleController.getById] Erro:`, err.message);
      res.status(500).json({
        error: 'internal_server_error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Erro ao buscar artigo'
      });
    }
  };

  public create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      let tags: string[] | undefined = undefined;
      if (req.body.tags) {
        if (Array.isArray(req.body.tags)) {
          tags = req.body.tags;
        } else if (typeof req.body.tags === 'string') {
          try {
            tags = JSON.parse(req.body.tags);
          } catch (e) {
            res.status(400).json({
              message: 'Tags inválidas'
            });
            return;
          }
        }
      }

      let articleData: CreateArticleData = {
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        resumo: req.body.resumo,
        categoria: req.body.categoria || 'Dev',
        tags: tags,
        imagem_banner: req.file ? req.file.filename : undefined
      };
      
      const userId = req.user?.id;

      if (!userId || !Number.isInteger(userId) || userId <= 0) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!articleData.titulo || !articleData.conteudo) {
        res.status(400).json({
          message: 'Título e conteúdo são obrigatórios'
        });
        return;
      }

      const article = await this.articleService.createArticle(articleData, userId);
      const articleWithUrl = this.formatImageUrl(this.formatAuthor(article));

      res.status(201).json({
        data: articleWithUrl
      });

    } catch (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            message: 'Arquivo muito grande. Tamanho máximo: 5MB'
          });
          return;
        }
      }
      
      if (error instanceof Error) {

       const errorMessage = error.message.toLowerCase();
       
        if (errorMessage.includes ('obrigatório') || errorMessage.includes ('vazio') || errorMessage.includes ('caracteres')) {

          res.status(400).json({
            message: error.message
          });
          return;
        }
      }

      const err = error as Error;
      console.error(`[ArticleController.create] Erro:`, { message: err.message, stack: err.stack });
      res.status(500).json({
        error: 'internal_server_error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Erro ao criar artigo'
      });
    }
  };

  /**
   * Atualiza artigo (somente autor)
   * PUT /articles/:id
   */
  public update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;

      let updateData: UpdateArticleData = {
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        resumo: req.body.resumo,
        categoria: req.body.categoria,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
        imagem_banner: req.file ? req.file.filename : undefined
      };

      if (isNaN(id)) {
        res.status(400).json({
          message: 'ID inválido'
        });
        return;
      }

      if (!userId || !Number.isInteger(userId) || userId <= 0) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
      }

      const updatedArticle = await this.articleService.updateArticle(id, userId, updateData);
      const articleWithUrl = this.formatImageUrl(updatedArticle);

      res.status(200).json({
        data: articleWithUrl
      });
      
    } catch (error) {
      if (error instanceof Error) {

       const errorMessage = error.message.toLowerCase();
       
        if (errorMessage.includes ('obrigatório') || errorMessage.includes ('vazio') || errorMessage.includes ('caracteres')) {
          res.status(400).json({
            message: error.message
          });
          return;
        }
        if (errorMessage.includes('não encontrado')) {
          res.status(404).json({
            message: error.message
          });
          return;
        }
        if (errorMessage.includes('permissão')) {
          res.status(403).json({
            message: error.message
          });
          return;
        }
      }

      const err = error as Error;
      console.error(`[ArticleController.update] Erro:`, { message: err.message, stack: err.stack, id: req.params.id });
      res.status(500).json({
        error: 'internal_server_error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Erro ao atualizar artigo'
      });
    }
  };

  public delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;

      if (isNaN(id)) {
        res.status(400).json({
          message: 'ID inválido'
        });
        return;
      }

      if (!userId || !Number.isInteger(userId) || userId <= 0) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
        }   

       await this.articleService.deleteArticle(id, userId); 

      res.status(200).json({
        data: {
          message: 'Artigo deletado com sucesso'
        }
      });

    } catch (error) {
      if (error instanceof Error) {

       const errorMessage = error.message.toLowerCase();
       
        if (errorMessage.includes ('permissão')) {
          res.status(403).json({
            message: error.message
          });
          return;
        }
        
        if (errorMessage.includes('não encontrado')) {
          res.status(404).json({
            message: error.message
          });
          return;
        }
      }
      const err = error as Error;
      console.error(`[ArticleController.delete] Erro:`, { message: err.message, stack: err.stack, id: req.params.id });
      res.status(500).json({
        error: 'internal_server_error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Erro ao deletar artigo'
      });
    }
  };
}
