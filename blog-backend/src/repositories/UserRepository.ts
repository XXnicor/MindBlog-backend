import connection from '../database/database';
import { RegisterData, UserRow, UpdateProfileData, UserStats } from '../types';
import { User } from '../models/User';

export class UserRepository {
  private toDomain(row: UserRow): User {
    const user = User.fromDatabase(row);
    return user;
  }

  private toPersistence(user: User): Partial<UserRow> {
    const out: Partial<UserRow> = {};

    if (user.id !== null) {
      out.id = user.id;
    }
    out.nome = user.nome;
    out.email = user.email;
    out.senha = user.getSenhaHash();
    out.avatar = user.avatar;
    out.bio = user.bio;
    if (user.created_at) out.created_at = user.created_at;
    if (user.updated_at) out.updated_at = user.updated_at;

    return out;
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await connection.query<UserRow>('SELECT * FROM users WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.toDomain(result.rows[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error}`);
    }
  }

  public async findById(id: number): Promise<User | null> {
    try {
      const result = await connection.query<UserRow>('SELECT * FROM users WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.toDomain(result.rows[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por ID: ${error}`);
    }
  }

  public async create(userData: RegisterData): Promise<number> {
    try {
      const result = await connection.query<{ id: number }>(
        'INSERT INTO users (nome, email, senha, avatar, bio) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userData.nome, userData.email, userData.senha, userData.avatar || null, userData.bio || null]
      );

      return result.rows[0].id;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error}`);
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      const result = await connection.query<User>(
        'SELECT id, nome, email, avatar, bio, created_at, updated_at FROM users'
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar usuários: ${error}`);
    }
  }

  public async update(id: number, userData: Partial<RegisterData>): Promise<boolean> {
    try {
      const fields: string[] = [];
      const values: unknown[] = [];

      if (userData.nome) {
        values.push(userData.nome);
        fields.push(`nome = $${values.length}`);
      }
      if (userData.email) {
        values.push(userData.email);
        fields.push(`email = $${values.length}`);
      }
      if (userData.senha) {
        values.push(userData.senha);
        fields.push(`senha = $${values.length}`);
      }
      if (userData.avatar !== undefined) {
        values.push(userData.avatar);
        fields.push(`avatar = $${values.length}`);
      }
      if (userData.bio !== undefined) {
        values.push(userData.bio);
        fields.push(`bio = $${values.length}`);
      }

      if (fields.length === 0) {
        return false;
      }

      values.push(id);
      const idPlaceholder = `$${values.length}`;

      const result = await connection.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ${idPlaceholder}`,
        values
      );

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error}`);
    }
  }

  public async updateProfile(id: number, profileData: UpdateProfileData): Promise<boolean> {
    try {
      const fields: string[] = [];
      const values: unknown[] = [];

      if (profileData.nome) {
        values.push(profileData.nome);
        fields.push(`nome = $${values.length}`);
      }
      if (profileData.email) {
        values.push(profileData.email);
        fields.push(`email = $${values.length}`);
      }
      if (profileData.bio !== undefined) {
        values.push(profileData.bio);
        fields.push(`bio = $${values.length}`);
      }
      if (profileData.avatar !== undefined) {
        values.push(profileData.avatar);
        fields.push(`avatar = $${values.length}`);
      }
      if (profileData.senha_nova) {
        values.push(profileData.senha_nova);
        fields.push(`senha = $${values.length}`);
      }

      if (fields.length === 0) {
        return false;
      }

      values.push(id);
      const idPlaceholder = `$${values.length}`;

      const result = await connection.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ${idPlaceholder}`,
        values
      );

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Erro ao atualizar perfil: ${error}`);
    }
  }

  public async getUserStats(userId: number): Promise<UserStats> {
    try {
      const result = await connection.query<UserStats>(
        `SELECT 
          COUNT(DISTINCT a.id) as "totalArticles",
          COALESCE(SUM(a.views), 0) as "totalViews",
          COALESCE(SUM(a.likes), 0) as "totalLikes",
          (SELECT COUNT(*) FROM comments WHERE id_article IN (SELECT id FROM articles WHERE id_autor = $1)) as "totalComments"
        FROM articles a
        WHERE a.id_autor = $2`,
        [userId, userId]
      );

      const stats = result.rows[0];
      return {
        totalArticles: Number(stats?.totalArticles) || 0,
        totalViews: Number(stats?.totalViews) || 0,
        totalLikes: Number(stats?.totalLikes) || 0,
        totalComments: Number(stats?.totalComments) || 0,
      };
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas do usuário: ${error}`);
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const result = await connection.query('DELETE FROM users WHERE id = $1', [id]);

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error}`);
    }
  }
}
