// src/repositories/UserRepository.ts
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '../database/connection';
import { User, RegisterData } from '../types';

export class UserRepository {

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0] as User;
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

      return rows[0] as User;
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