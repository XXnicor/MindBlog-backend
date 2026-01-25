import { CommentRepository } from '../repositories/CommentRepository';
import { Comment, CommentWithAuthor, CreateCommentData } from '../types';

export class CommentService {
  private commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository) {
    this.commentRepository = commentRepository;
  }

  /**
   * Cria um novo comentário
   * @param commentData Dados do comentário
   * @param articleId ID do artigo
   * @param authorId ID do autor do comentário
   * @returns Comentário criado com dados do autor
   */
  public async createComment(
    commentData: CreateCommentData,
    articleId: number,
    authorId: number
  ): Promise<CommentWithAuthor> {
    try {
      // Validações
      if (!commentData.text || commentData.text.trim().length === 0) {
        throw new Error('Comentário não pode ser vazio');
      }

      if (commentData.text.length > 1000) {
        throw new Error('Comentário deve ter no máximo 1000 caracteres');
      }

      // Cria o comentário
      const commentId = await this.commentRepository.create(commentData, articleId, authorId);

      // Busca o comentário criado
      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        throw new Error('Erro ao recuperar comentário criado');
      }

      // Busca todos os comentários do artigo para retornar o comentário com autor
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

  /**
   * Lista todos os comentários de um artigo
   * @param articleId ID do artigo
   * @returns Array de comentários com dados dos autores
   */
  public async getCommentsByArticleId(articleId: number): Promise<CommentWithAuthor[]> {
    try {
      return await this.commentRepository.findByArticleId(articleId);
    } catch (error) {
      throw new Error('Erro ao listar comentários');
    }
  }

  /**
   * Conta quantos comentários um artigo tem
   * @param articleId ID do artigo
   * @returns Número de comentários
   */
  public async countCommentsByArticleId(articleId: number): Promise<number> {
    try {
      return await this.commentRepository.countByArticleId(articleId);
    } catch (error) {
      throw new Error('Erro ao contar comentários');
    }
  }

  /**
   * Deleta um comentário
   * @param id ID do comentário
   * @param userId ID do usuário que está deletando
   * @returns true se deletou com sucesso
   */
  public async deleteComment(id: number, userId: number): Promise<boolean> {
    try {
      // Verifica se o comentário existe e se o usuário é o autor
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
