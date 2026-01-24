
export class Article {
  private constructor(
    public readonly id: number | null,
    public readonly title: string,
    public readonly content: string,
    public readonly bannerPath: string | null,
    public readonly authorId: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  /**
   * Factory method para criar novo artigo (antes de persistir)
   */
  static create(
    title: string,
    content: string,
    authorId: number,
    bannerPath: string | null = null
  ): Article {
    
    if (!title || title.trim().length === 0) {
      throw new Error('Título não pode ser vazio');
    }

    if (!content || content.trim().length < 10) {
        throw new Error('Conteúdo deve ter no mínimo 10 caracteres');
    }

    if (!bannerPath) {
      bannerPath = null;
    }

    if (authorId <= 0) {
      throw new Error('authorId inválido');
    }

    return new Article(null, title, content, bannerPath, authorId);
  }

  /**
   * Factory method para reconstruir artigo do banco
   */
  static fromDatabase(data: {
    id: number;
    title: string;
    content: string;
    banner_path: string | null;
    author_id: number;
    created_at?: Date;
    updated_at?: Date;
  }): Article {

    return new Article(
      data.id,
      data.title,
      data.content,
      data.banner_path,
      data.author_id,
      data.created_at,
      data.updated_at
    );
  }

  /**
   * Converte para DTO (dados públicos)
   */
  toDTO(): { 
    id: number | null;
    title: string; 
    content: string; 
    bannerPath: string | null;
    authorId: number;
    createdAt?: Date;
    updatedAt?: Date;
  } 
  
  {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      bannerPath: this.bannerPath,
      authorId: this.authorId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}