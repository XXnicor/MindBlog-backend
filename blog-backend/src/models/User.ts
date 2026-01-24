
export class User {
  private constructor(
    public readonly id: number | null,
    public readonly nome: string,
    public readonly email: string,
    private readonly senhaHash: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  /**
   * Factory method para criar novo usuário (antes de persistir)*/
  static create(nome: string, email: string, senhaPlainText: string): User {

    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome não pode ser vazio');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    if (!senhaPlainText || senhaPlainText.length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }

    return new User(null, nome, email, senhaPlainText);
  }

  /**
   * Factory method para reconstruir usuário do banco
   */
  static fromDatabase(data: 
    {id: number;
    nome: string;
    email: string;
    senha: string; // já é hash
    created_at?: Date;
    updated_at?: Date;
  }): User {
    return new User(
      data.id,
      data.nome,
      data.email,
      data.senha,
      data.created_at,
      data.updated_at
    );
  }

  /**
   * Converte para DTO (sem senha)
   */
  toDTO(): { id: number | null; nome: string; email: string } {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email
    };
  }

  getSenhaHash(): string {
    return this.senhaHash;
  }
}