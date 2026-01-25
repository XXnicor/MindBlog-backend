
export class Article {
  private constructor(
    public readonly id: number | null,
    public readonly titulo: string,
    public readonly conteudo: string,
    public readonly imagem_banner: string | null,
    public readonly resumo: string | null,
    public readonly categoria: string,
    public readonly tags: string[] | null,
    public readonly id_autor: number,
    public readonly views: number = 0,
    public readonly likes: number = 0,
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
    categoria: string = 'Dev',
    imagem_banner: string | null = null,
    resumo: string | null = null,
    tags: string[] | null = null
  ): Article {
    if (!titulo || titulo.trim().length === 0) {
      throw new Error('Título não pode ser vazio');
    }

    if (titulo.length < 5 || titulo.length > 200) {
      throw new Error('Título deve ter entre 5 e 200 caracteres');
    }

    if (!conteudo || conteudo.trim().length < 100) {
      throw new Error('Conteúdo deve ter no mínimo 100 caracteres');
    }

    if (resumo && resumo.length > 200) {
      throw new Error('Resumo deve ter no máximo 200 caracteres');
    }

    const validCategories = ['Dev', 'DevOps', 'IA'];
    if (!validCategories.includes(categoria)) {
      throw new Error('Categoria deve ser Dev, DevOps ou IA');
    }

    if (!imagem_banner) {
      imagem_banner = null;
    }

    if (id_autor <= 0) {
      throw new Error('id_autor inválido');
    }

    return new Article(null, titulo, conteudo, imagem_banner, resumo, categoria, tags, id_autor, 0, 0);
  }

  /**
   * Factory method para reconstruir artigo do banco
   */
  static fromDatabase(data: {
    id: number;
    titulo: string;
    conteudo: string;
    imagem_banner: string | null;
    resumo?: string | null;
    categoria: string;
    tags?: string | string[] | null;
    id_autor: number;
    views?: number;
    likes?: number;
    data_publicacao?: Date;
    data_alteracao?: Date;
  }): Article {
    // Parse tags se vier como string JSON
    let parsedTags: string[] | null = null;
    if (data.tags) {
      if (typeof data.tags === 'string') {
        try {
          parsedTags = JSON.parse(data.tags);
        } catch {
          parsedTags = null;
        }
      } else if (Array.isArray(data.tags)) {
        parsedTags = data.tags;
      }
    }

    return new Article(
      data.id,
      data.titulo,
      data.conteudo,
      data.imagem_banner,
      data.resumo || null,
      data.categoria,
      parsedTags,
      data.id_autor,
      data.views || 0,
      data.likes || 0,
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
    resumo: string | null;
    categoria: string;
    tags: string[] | null;
    id_autor: number;
    views: number;
    likes: number;
    data_publicacao?: Date;
    data_alteracao?: Date;
  } {
    return {
      id: this.id,
      titulo: this.titulo,
      conteudo: this.conteudo,
      imagem_banner: this.imagem_banner,
      resumo: this.resumo,
      categoria: this.categoria,
      tags: this.tags,
      id_autor: this.id_autor,
      views: this.views,
      likes: this.likes,
      data_publicacao: this.data_publicacao,
      data_alteracao: this.data_alteracao
    };
  }
}