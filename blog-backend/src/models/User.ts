import { UserRow } from '../types';

export class User {
  private constructor(
    public readonly id: number | null,
    public readonly nome: string,
    public readonly email: string,
    private readonly senhaHash: string,
    public readonly avatar: string | null = null,
    public readonly bio: string | null = null,
    public readonly created_at?: Date,
    public readonly updated_at?: Date
  ) {}

  /**
   * Factory method para criar novo usuário (antes de persistir)*/
  static create(nome: string, email: string, passwordPlainText: string): User {

    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome não pode ser vazio');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    if (!passwordPlainText || passwordPlainText.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }

    return new User(null, nome, email, passwordPlainText, null, null);
  }

  /**
   * Factory method para reconstruir usuário do banco
   */
  static fromDatabase(row: UserRow): User {
    return new User(
      row.id,
      row.nome,
      row.email,
      row.senha,
      row.avatar || null,
      row.bio || null,
      row.created_at,
      row.updated_at
    );
  }

  /**
   * Converte para DTO (sem senha)
   */
  toDTO(): { id: number | null; nome: string; email: string; avatar?: string | null; bio?: string | null } {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      avatar: this.avatar,
      bio: this.bio
    };
  }

  getSenhaHash(): string {
    return this.senhaHash;
  }
}