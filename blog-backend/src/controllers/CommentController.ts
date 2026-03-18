import { Request, Response } from 'express';
import { CommentService } from '../services/CommentService';
import { CreateCommentData } from '../types';
import { AuthRequest } from '../types/AuthRequest';

export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  public list = async (req: Request, res: Response): Promise<void> => {
    try {
      const articleId = parseInt(req.params.id);

      if (isNaN(articleId)) {
        res.status(400).json({
          message: 'ID do artigo inválido'
        });
        return;
      }

      const comments = await this.commentService.getCommentsByArticleId(articleId);

      const formattedComments = comments.map(comment => ({
        id: comment.id.toString(),
        text: comment.text,
        author: {
          name: comment.author_name,
          avatar: comment.author_avatar || null
        },
        likes: comment.likes,
        date: comment.created_at
      }));

      res.status(200).json({
        data: formattedComments
      });
    } catch (error) {
      res.status(500).json({
        message: 'Erro ao listar comentários'
      });
    }
  };

  public create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const articleId = parseInt(req.params.id);
      const userId = req.user?.id;
      const commentData: CreateCommentData = req.body;

      if (isNaN(articleId)) {
        res.status(400).json({
          message: 'ID do artigo inválido'
        });
        return;
      }

      if (!userId || !Number.isInteger(userId) || userId <= 0) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!commentData.text || commentData.text.trim().length === 0) {
        res.status(400).json({
          message: 'Comentário não pode ser vazio'
        });
        return;
      }

      const comment = await this.commentService.createComment(commentData, articleId, userId);

      const formattedComment = {
        id: comment.id.toString(),
        text: comment.text,
        author: {
          name: comment.author_name,
          avatar: comment.author_avatar || null
        },
        likes: comment.likes,
        date: comment.created_at
      };

      res.status(201).json({
        data: formattedComment
      });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('vazio') || errorMessage.includes('caracteres')) {
          res.status(400).json({
            message: error.message
          });
          return;
        }
      }

      res.status(500).json({
        message: 'Erro ao criar comentário'
      });
    }
  };

  public delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const commentId = parseInt(req.params.id);
      const userId = req.user?.id;

      if (isNaN(commentId)) {
        res.status(400).json({
          message: 'ID do comentário inválido'
        });
        return;
      }

      if (!userId || !Number.isInteger(userId) || userId <= 0) {
        res.status(401).json({
          message: 'Usuário não autenticado'
        });
        return;
      }

      await this.commentService.deleteComment(commentId, userId);

      res.status(200).json({
        data: {
          message: 'Comentário deletado com sucesso'
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('permissão')) {
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
        message: 'Erro ao deletar comentário'
      });
    }
  };
}
