import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '../database/database';
import { Comment, CommentWithAuthor, CreateCommentData } from '../types';

export class CommentRepository {
  
  public async create(commentData: CreateCommentData, articleId: number, authorId: number): Promise<number> {
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO comments (text, id_article, id_author, likes) VALUES (?, ?, ?, 0)',
        [commentData.text, articleId, authorId]
      );

      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar comentário: ${error}`);
    }
  }

  public async findById(id: number): Promise<Comment | null> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM comments WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0] as Comment;
    } catch (error) {
      throw new Error(`Erro ao buscar comentário por ID: ${error}`);
    }
  }

  public async findByArticleId(articleId: number): Promise<CommentWithAuthor[]> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT 
          c.*,
          u.nome as author_name,
          u.avatar as author_avatar
        FROM comments c
        INNER JOIN users u ON c.id_author = u.id
        WHERE c.id_article = ?
        ORDER BY c.created_at DESC`,
        [articleId]
      );

      return rows as CommentWithAuthor[];
    } catch (error) {
      throw new Error(`Erro ao buscar comentários do artigo: ${error}`);
    }
  }

  public async countByArticleId(articleId: number): Promise<number> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM comments WHERE id_article = ?',
        [articleId]
      );

      return rows[0].total || 0;
    } catch (error) {
      throw new Error(`Erro ao contar comentários: ${error}`);
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM comments WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar comentário: ${error}`);
    }
  }

  public async isAuthor(commentId: number, userId: number): Promise<boolean> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM comments WHERE id = ? AND id_author = ?',
        [commentId, userId]
      );

      return rows.length > 0;
    } catch (error) {
      throw new Error(`Erro ao verificar autoria do comentário: ${error}`);
    }
  }
}
