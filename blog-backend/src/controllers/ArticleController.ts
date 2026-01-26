// src/controllers/ArticleController.ts
import { Request, Response } from 'express';
import { ArticleService } from '../services/ArticleService';
import { AuthRequest, CreateArticleData, UpdateArticleData } from '../types';
import multer from 'multer';
import { config } from '../config/env.config';

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService: ArticleService) {
    this.articleService = articleService;
  }

  // Helper para formatar URL da imagem
  private formatImageUrl(article: any): any {
    // Mantém o campo imagem_banner (nome do arquivo)
    // E adiciona o campo imagem_banner_url (URL completa)
    console.log('[ArticleController] Formatando imagem para artigo:', {
      id: article.id,
      titulo: article.titulo?.substring(0, 30),
      imagem_banner: article.imagem_banner
    });
    
    if (article.imagem_banner) {
      const port = process.env.PORT || config.server.port;
      article.imagem_banner_url = `http://localhost:${port}/uploads/${article.imagem_banner}`;
      console.log('[ArticleController] URL gerada:', article.imagem_banner_url);
    } else {
      article.imagem_banner_url = null;
      console.log('[ArticleController] Sem imagem_banner, URL definida como null');
    }
    return article;
  }

  public listAll = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('[ArticleController] Listando artigos:', req.query);
      
      // Parâmetros de paginação (default: page=1, limit=9)
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const categoria = req.query.categoria as string;
      const search = req.query.search as string;

      console.log('[ArticleController] Parâmetros:', { page, limit, categoria, search });

      // Usa paginação sempre
      const result = await this.articleService.getArticlesWithPagination({
        page,
        limit,
        categoria,
        search
      });

      console.log('[ArticleController] Artigos encontrados:', result.articles.length);

      // Formata URLs das imagens
      const articlesWithUrls = result.articles.map(article => this.formatImageUrl(article));

      // Retorna formato esperado
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
      console.error('[ArticleController] Erro ao listar artigos:', error);
      console.error('[ArticleController] Stack trace:', error instanceof Error ? error.stack : 'N/A');
      
      res.status(500).json({
        message: 'Erro ao listar artigos',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
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
      // Log para debug
      console.log('[ArticleController] Criando artigo:', {
        body: req.body,
        file: req.file ? req.file.filename : 'sem arquivo',
        userId: req.userId
      });

      // Processa tags de forma segura
      let tags: string[] | undefined = undefined;
      if (req.body.tags) {
        if (Array.isArray(req.body.tags)) {
          tags = req.body.tags;
        } else if (typeof req.body.tags === 'string') {
          try {
            tags = JSON.parse(req.body.tags);
          } catch (e) {
            console.error('[ArticleController] Erro ao fazer parse das tags:', e);
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
      const articleWithUrl = this.formatImageUrl(article);

      res.status(201).json({
        data: articleWithUrl
      });

    } catch (error) {
      // Log do erro completo para debug
      console.error('[ArticleController] Erro ao criar artigo:', error);
      
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