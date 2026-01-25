
export class Article {
  private constructor(
    public readonly id: number | null,
    public readonly titulo: string,
    public readonly conteudo: string,
    public readonly imagem_banner: string | null,
    public readonly id_autor: number,
    public readonly data_publicacao?: Date,
    public readonly data_alteracao?: Date
  ) {}

  /**
   * Factory method para criar novo artigo (antes de persistir)
   */
  static create(
    titulo: string,
    conteudo: string,
    id_autor: number,
    imagem_banner: string | null = null
  ): Article {
    if (!titulo || titulo.trim().length === 0) {
      throw new Error('Título não pode ser vazio');
    }

    if (!conteudo || conteudo.trim().length < 10) {
      throw new Error('Conteúdo deve ter no mínimo 10 caracteres');
    }

    if (!imagem_banner) {
      imagem_banner = null;
    }

    if (id_autor <= 0) {
      throw new Error('id_autor inválido');
    }

    return new Article(null, titulo, conteudo, imagem_banner, id_autor);
  }

  /**
   * Factory method para reconstruir artigo do banco
   */
  static fromDatabase(data: {
    id: number;
    titulo: string;
    conteudo: string;
    imagem_banner: string | null;
    id_autor: number;
    data_publicacao?: Date;
    data_alteracao?: Date;
  }): Article {
    return new Article(
      data.id,
      data.titulo,
      data.conteudo,
      data.imagem_banner,
      data.id_autor,
      data.data_publicacao,
      data.data_alteracao
    );
  }

  /**
   * Converte para DTO (dados públicos)
   */
  toDTO(): {
    id: number | null;
    titulo: string;
    conteudo: string;
    imagem_banner: string | null;
    id_autor: number;
    data_publicacao?: Date;
    data_alteracao?: Date;
  } {
    return {
      id: this.id,
      titulo: this.titulo,
      conteudo: this.conteudo,
      imagem_banner: this.imagem_banner,
      id_autor: this.id_autor,
      data_publicacao: this.data_publicacao,
      data_alteracao: this.data_alteracao
    };
  }
}