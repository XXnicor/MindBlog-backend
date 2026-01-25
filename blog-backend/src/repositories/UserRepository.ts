// src/repositories/UserRepository.ts
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '../database/database';
import { RegisterData, UserRow } from '../types';
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
    if (user.created_at) out.created_at = user.created_at;
    if (user.updated_at) out.updated_at = user.updated_at;

    return out;
  }


  public async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.toDomain(rows[0] as UserRow);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error}`);
    }
  }

  public async findById(id: number): Promise<User | null> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return this.toDomain(rows[0] as UserRow);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por ID: ${error}`);
    }
  }

  public async create(userData: RegisterData): Promise<number> {
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
        [userData.nome, userData.email, userData.senha]
      );

      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error}`);
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT id, nome, email, created_at, updated_at FROM users'
      );

      return rows as User[];
    } catch (error) {
      throw new Error(`Erro ao listar usuários: ${error}`);
    }
  }

  
  public async update(id: number, userData: Partial<RegisterData>): Promise<boolean> {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (userData.nome) {
        fields.push('nome = ?');
        values.push(userData.nome);
      }
      if (userData.email) {
        fields.push('email = ?');
        values.push(userData.email);
      }
      if (userData.senha) {
        fields.push('senha = ?');
        values.push(userData.senha);
      }

      if (fields.length === 0) {
        return false;
      }

      values.push(id);

      const [result] = await connection.query<ResultSetHeader>(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error}`);
    }
  }
  
  public async delete(id: number): Promise<boolean> {
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM users WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error}`);
    }
  }
}