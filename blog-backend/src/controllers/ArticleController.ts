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
      const articles = await this.articleService.getAllArticles();

      res.status(200).json({
        success: true,
        message: 'Artigos listados com sucesso',
        data: articles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar artigos'
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      const article = await this.articleService.getArticleById(id);

      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Artigo não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: article
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar artigo'
      });
    }
  };

  public create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const articleData: CreateArticleData = req.body;
      const userId = req.userId; // Vem do middleware de autenticação

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!articleData.titulo || !articleData.conteudo) {
        res.status(400).json({
          success: false,
          message: 'Título e conteúdo são obrigatórios'
        });
        return;
      }

      const articleDataWithImage: CreateArticleData = {
        titulo: articleData.titulo,
        conteudo: articleData.conteudo,
        imagem_banner:req.file ? req.file.filename : undefined
      };

      const article = await this.articleService.createArticle(articleDataWithImage, userId);

      res.status(201).json({
        success: true,
        message: 'Artigo criado com sucesso',
        data: article
      });

    } catch (error) {
      
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            message: 'Arquivo muito grande. Tamanho máximo: 5MB'
          });
          return;
        }
      }
      
      if (error instanceof Error) {

       const errorMessage = error.message.toLowerCase();
       
        if (errorMessage.includes ('obrigatório') || errorMessage.includes ('vazio')) {

          res.status(400).json({
            success: false,
            message: error.message
          });
          return;
        }
      }

        res.status(500).json({
        success: false,
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
      const updateData: UpdateArticleData = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }

        if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const updateDataWithImage: UpdateArticleData = {
        titulo: updateData.titulo,
        conteudo: updateData.conteudo,
        imagem_banner:req.file ? req.file.filename : undefined
      };


      const updatedArticle = await this.articleService.updateArticle(id, userId, updateDataWithImage);

      res.status(200).json({
        success: true,
        message: 'Artigo atualizado com sucesso',
        data: updatedArticle
      });
      
    } catch (error) {
      if (error instanceof Error) {

       const errorMessage = error.message.toLowerCase();
       
        if (errorMessage.includes ('obrigatório') || errorMessage.includes ('vazio')) {
          res.status(400).json({
            success: false,
            message: error.message
          });
          return;
        }
        if (errorMessage.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          });
          return;
        }
        if (errorMessage.includes('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          });
          return;
        }
      }

        res.status(500).json({
        success: false,
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
          success: false,
          message: 'ID inválido'
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
        }   

       const deleted = await this.articleService.deleteArticle(id, userId); 

      res.status(204).send();

    } catch (error) {
      if (error instanceof Error) {

       const errorMessage = error.message.toLowerCase();
       
        if (errorMessage.includes ('permissão')) {
          res.status(403).json({
            success: false,
            message: error.message
          });
          return;
        }
        
        if (errorMessage.includes('não encontrado')) {
          res.status(404).json({
            success: false,
            message: error.message
          });
          return;
        }
      }
        res.status(500).json({      
        success: false,
        message: 'Erro ao deletar artigo'
      });
    }
  };
}