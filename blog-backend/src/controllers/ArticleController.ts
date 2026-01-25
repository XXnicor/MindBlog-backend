// src/controllers/ArticleController.ts
import { Request, Response } from 'express';
import { ArticleService } from '../services/ArticleService';
import { AuthRequest, CreateArticleData, UpdateArticleData } from '../types';
import multer from 'multer';

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  public listAll = async (req: Request, res: Response): Promise<void> => {
    try {
      // Verifica se há parâmetros de paginação
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const categoria = req.query.categoria as string;
      const search = req.query.search as string;

      // Se houver parâmetros, usa paginação
      if (req.query.page || req.query.limit || req.query.categoria || req.query.search) {
        const result = await this.articleService.getArticlesWithPagination({
          page,
          limit,
          categoria,
          search
        });

        res.status(200).json({
          data: result
        });
        return;
      }

      // Caso contrário, retorna todos
      const articles = await this.articleService.getAllArticles();

      res.status(200).json({
        data: articles
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao listar artigos'
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

      res.status(200).json({
        data: article
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao buscar artigo'
      });
    }
  };

  public create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      let articleData: CreateArticleData = {
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        resumo: req.body.resumo,
        categoria: req.body.categoria || 'Dev',
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
        imagem_banner: req.file ? req.file.filename : undefined
      };
      
      const userId = req.userId;

      if (!userId) {
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

      res.status(201).json({
        data: article
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
        message: 'Erro ao criar artigo'

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
      const userId = req.userId;
      
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

        if (!userId) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
      }

      const updatedArticle = await this.articleService.updateArticle(id, userId, updateData);

      res.status(200).json({
        data: updatedArticle
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
      const userId = req.userId;

      if (isNaN(id)) {  
        res.status(400).json({
          message: 'ID inválido'
        });
        return;
      }

      if (!userId) {
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