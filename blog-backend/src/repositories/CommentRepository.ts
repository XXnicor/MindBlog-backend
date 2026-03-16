import connection from '../database/database';
import { Comment, CommentWithAuthor, CreateCommentData } from '../types';

export class CommentRepository {
  public async create(commentData: CreateCommentData, articleId: number, authorId: number): Promise<number> {
    try {
      const result = await connection.query<{ id: number }>(
        'INSERT INTO comments (text, id_article, id_author, likes) VALUES ($1, $2, $3, 0) RETURNING id',
        [commentData.text, articleId, authorId]
      );

      return result.rows[0].id;
    } catch (error) {
      throw new Error(`Erro ao criar comentário: ${error}`);
    }
  }

  public async findById(id: number): Promise<Comment | null> {
    try {
      const result = await connection.query<Comment>('SELECT * FROM comments WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar comentário por ID: ${error}`);
    }
  }

  public async findByArticleId(articleId: number): Promise<CommentWithAuthor[]> {
    try {
      const result = await connection.query<CommentWithAuthor>(
        `SELECT 
          c.*,
          u.nome as author_name,
          u.avatar as author_avatar
        FROM comments c
        INNER JOIN users u ON c.id_author = u.id
        WHERE c.id_article = $1
        ORDER BY c.created_at DESC`,
        [articleId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar comentários do artigo: ${error}`);
    }
  }

  public async countByArticleId(articleId: number): Promise<number> {
    try {
      const result = await connection.query<{ total: string }>(
        'SELECT COUNT(*) as total FROM comments WHERE id_article = $1',
        [articleId]
      );

      return Number(result.rows[0]?.total || 0);
    } catch (error) {
      throw new Error(`Erro ao contar comentários: ${error}`);
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const result = await connection.query('DELETE FROM comments WHERE id = $1', [id]);

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar comentário: ${error}`);
    }
  }

  public async isAuthor(commentId: number, userId: number): Promise<boolean> {
    try {
      const result = await connection.query('SELECT id FROM comments WHERE id = $1 AND id_author = $2', [commentId, userId]);

      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Erro ao verificar autoria do comentário: ${error}`);
    }
  }
}
