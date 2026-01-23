// src/repositories/ArticleRepository.ts
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '../database/connection';
import { Article, ArticleWithAuthor, CreateArticleData, UpdateArticleData } from '../types';

export class ArticleRepository {

  public async create(articleData: CreateArticleData, authorId: number): Promise<number> {
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO articles (titulo, conteudo, id_autor, imagem_banner) VALUES (?, ?, ?, ?)',
        [articleData.titulo, articleData.conteudo, authorId, articleData.imagem_banner || null]
      );

      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar artigo: ${error}`);
    }
  }

  public async findById(id: number): Promise<Article | null> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM articles WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0] as Article;
    } catch (error) {
      throw new Error(`Erro ao buscar artigo por ID: ${error}`);
    }
  }

  public async findByIdWithAuthor(id: number): Promise<ArticleWithAuthor | null> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT 
          a.*,
          u.nome as autor_nome,
          u.email as autor_email
        FROM articles a
        INNER JOIN users u ON a.id_autor = u.id
        WHERE a.id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0] as ArticleWithAuthor;
    } catch (error) {
      throw new Error(`Erro ao buscar artigo com autor: ${error}`);
    }
  }

  public async findAll(): Promise<Article[]> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM articles ORDER BY data_publicacao DESC'
      );

      return rows as Article[];
    } catch (error) {
      throw new Error(`Erro ao listar artigos: ${error}`);
    }
  }

  public async findAllWithAuthors(): Promise<ArticleWithAuthor[]> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT 
          a.*,
          u.nome as autor_nome,
          u.email as autor_email
        FROM articles a
        INNER JOIN users u ON a.id_autor = u.id
        ORDER BY a.data_publicacao DESC`
      );

      return rows as ArticleWithAuthor[];
    } catch (error) {
      throw new Error(`Erro ao listar artigos com autores: ${error}`);
    }
  }

  public async findByAuthor(authorId: number): Promise<Article[]> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM articles WHERE id_autor = ? ORDER BY data_publicacao DESC',
        [authorId]
      );

      return rows as Article[];
    } catch (error) {
      throw new Error(`Erro ao buscar artigos por autor: ${error}`);
    }
  }

  
  public async update(id: number, articleData: UpdateArticleData): Promise<boolean> {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (articleData.titulo) {
        fields.push('titulo = ?');
        values.push(articleData.titulo);
      }
      if (articleData.conteudo) {
        fields.push('conteudo = ?');
        values.push(articleData.conteudo);
      }
      if (articleData.imagem_banner !== undefined) {
        fields.push('imagem_banner = ?');
        values.push(articleData.imagem_banner);
      }

      if (fields.length === 0) {
        return false;
      }

      // Adiciona atualização da data de alteração
      fields.push('data_alteracao = NOW()');
      values.push(id);

      const [result] = await connection.query<ResultSetHeader>(
        `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao atualizar artigo: ${error}`);
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM articles WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar artigo: ${error}`);
    }
  }

  public async isAuthor(articleId: number, userId: number): Promise<boolean> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM articles WHERE id = ? AND id_autor = ?',
        [articleId, userId]
      );

      return rows.length > 0;
    } catch (error) {
      throw new Error(`Erro ao verificar autoria: ${error}`);
    }
  }
}