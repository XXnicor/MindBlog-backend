export class Comment {
  private constructor(
    public readonly id: number | null,
    public readonly text: string,
    public readonly id_article: number,
    public readonly id_author: number,
    public readonly likes: number = 0,
    public readonly created_at?: Date,
    public readonly updated_at?: Date
  ) {}

  /**
   * Factory method para criar novo comentário (antes de persistir)
   */
  static create(
    text: string,
    id_article: number,
    id_author: number
  ): Comment {
    if (!text || text.trim().length === 0) {
      throw new Error('Comentário não pode ser vazio');
    }

    if (text.length > 1000) {
      throw new Error('Comentário deve ter no máximo 1000 caracteres');
    }

    if (id_article <= 0) {
      throw new Error('id_article inválido');
    }

    if (id_author <= 0) {
      throw new Error('id_author inválido');
    }

    return new Comment(null, text, id_article, id_author, 0);
  }

  /**
   * Factory method para reconstruir comentário do banco
   */
  static fromDatabase(data: {
    id: number;
    text: string;
    id_article: number;
    id_author: number;
    likes?: number;
    created_at?: Date;
    updated_at?: Date;
  }): Comment {
    return new Comment(
      data.id,
      data.text,
      data.id_article,
      data.id_author,
      data.likes || 0,
      data.created_at,
      data.updated_at
    );
  }

  /**
   * Converte para DTO (dados públicos)
   */
  toDTO(): {
    id: number | null;
    text: string;
    id_article: number;
    id_author: number;
    likes: number;
    created_at?: Date;
    updated_at?: Date;
  } {
    return {
      id: this.id,
      text: this.text,
      id_article: this.id_article,
      id_author: this.id_author,
      likes: this.likes,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}
