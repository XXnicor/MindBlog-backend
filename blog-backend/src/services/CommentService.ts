import { CommentRepository } from '../repositories/CommentRepository';
import { Comment, CommentWithAuthor, CreateCommentData } from '../types';

export class CommentService {
  private commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository) {
    this.commentRepository = commentRepository;
  }

  public async createComment(
    commentData: CreateCommentData,
    articleId: number,
    authorId: number
  ): Promise<CommentWithAuthor> {
    try {
      if (!commentData.text || commentData.text.trim().length === 0) {
        throw new Error('Comentário não pode ser vazio');
      }

      if (commentData.text.length > 1000) {
        throw new Error('Comentário deve ter no máximo 1000 caracteres');
      }

      const commentId = await this.commentRepository.create(commentData, articleId, authorId);

      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        throw new Error('Erro ao recuperar comentário criado');
      }

      const comments = await this.commentRepository.findByArticleId(articleId);
      const createdComment = comments.find(c => c.id === commentId);
      
      if (!createdComment) {
        throw new Error('Erro ao recuperar comentário com autor');
      }

      return createdComment;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar comentário');
    }
  }

  public async getCommentsByArticleId(articleId: number): Promise<CommentWithAuthor[]> {
    try {
      return await this.commentRepository.findByArticleId(articleId);
    } catch (error) {
      throw new Error('Erro ao listar comentários');
    }
  }

  public async countCommentsByArticleId(articleId: number): Promise<number> {
    try {
      return await this.commentRepository.countByArticleId(articleId);
    } catch (error) {
      throw new Error('Erro ao contar comentários');
    }
  }

  public async deleteComment(id: number, userId: number): Promise<boolean> {
    try {
      const isAuthor = await this.commentRepository.isAuthor(id, userId);
      if (!isAuthor) {
        throw new Error('Você não tem permissão para deletar este comentário');
      }

      const deleted = await this.commentRepository.delete(id);
      return deleted;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao deletar comentário');
    }
  }
}
