import { Request, Response } from 'express';
import { ArticleService } from '../services/ArticleService';
import { CreateArticleData, UpdateArticleData } from '../types';
import { AuthRequest } from '../types/AuthRequest';
import multer from 'multer';
import { config } from '../config/env.config';

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  private formatImageUrl(article: any): any {
    if (article.imagem_banner) {
      const port = process.env.PORT || config.server.port;
      article.imagem_banner_url = `http://localhost:${port}/uploads/${article.imagem_banner}`;
    } else {
      article.imagem_banner_url = null;
    }
    return article;
  }

  public listAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const pageParam = parseInt(req.query.page as string, 10);
      const limitParam = parseInt(req.query.limit as string, 10);

      const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
      const limit = Number.isNaN(limitParam) || limitParam < 1 ? 9 : limitParam;
      const skip = (page - 1) * limit;

      const categoria = req.query.categoria as string;
      const search = req.query.search as string;

      const result = await this.articleService.getArticlesWithPagination({
        page,
        limit,
        skip,
        categoria,
        search
      });

      const articlesWithUrls = result.articles.map(article => this.formatImageUrl(article));

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
      console.error(error);

      res.status(500).json({
        message: 'Erro ao listar artigos',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: 'ID inválido'
        });
        return;
      }

      const article = await this.articleService.getArticleById(id);

      if (!article) {
        res.status(404).json({
          message: 'Artigo não encontrado'
        });
        return;
      }

      const articleWithUrl = this.formatImageUrl(article);

      res.status(200).json({
        data: articleWithUrl
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao buscar artigo'
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
      
      const userId = req.userId ? Number(req.userId) : NaN;

      if (!Number.isInteger(userId) || userId <= 0) {
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
      const articleWithUrl = this.formatImageUrl(article);

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

        res.status(500).json({
        message: 'Erro ao criar artigo',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
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
      const userId = req.userId ? Number(req.userId) : NaN;

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

      if (!Number.isInteger(userId) || userId <= 0) {
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

        res.status(500).json({
        message: 'Erro ao atualizar artigo'
      });
    }
  };

  public delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.userId ? Number(req.userId) : NaN;

      if (isNaN(id)) {  
        res.status(400).json({
          message: 'ID inválido'
        });
        return;
      }

      if (!Number.isInteger(userId) || userId <= 0) {
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
        res.status(500).json({      
        message: 'Erro ao deletar artigo'
      });
    }
  };
}
