// src/services/ArticleService.ts
import { ArticleRepository } from '../repositories/ArticleRepository';
import { Article, ArticleWithAuthor, CreateArticleData, UpdateArticleData } from '../types';

export class ArticleService {
  private articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  /**
   * Cria um novo artigo
   * @param articleData Dados do artigo
   * @param authorId ID do autor
   * @returns Artigo criado com dados do autor
   */
  public async createArticle(articleData: CreateArticleData, authorId: number): Promise<ArticleWithAuthor> {
    try {
      // Validações
      if (!articleData.titulo || articleData.titulo.trim().length === 0) {
        throw new Error('Título é obrigatório');
      }
      if (!articleData.conteudo || articleData.conteudo.trim().length === 0) {
        throw new Error('Conteúdo é obrigatório');
      }

      // Cria o artigo
      const articleId = await this.articleRepository.create(articleData, authorId);

      // Retorna o artigo criado com dados do autor
      const article = await this.articleRepository.findByIdWithAuthor(articleId);
      if (!article) {
        throw new Error('Erro ao recuperar artigo criado');
      }

      return article;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar artigo');
    }
  }

  /**
   * Busca um artigo pelo ID com dados do autor
   * @param id ID do artigo
   * @returns Artigo com dados do autor ou null
   */
  public async getArticleById(id: number): Promise<ArticleWithAuthor | null> {
    try {
      return await this.articleRepository.findByIdWithAuthor(id);
    } catch (error) {
      throw new Error('Erro ao buscar artigo');
    }
  }

  /**
   * Lista todos os artigos com dados dos autores
   * @returns Array de artigos com autores
   */
  public async getAllArticles(): Promise<ArticleWithAuthor[]> {
    try {
      return await this.articleRepository.findAllWithAuthors();
    } catch (error) {
      throw new Error('Erro ao listar artigos');
    }
  }

  /**
   * Lista artigos de um autor específico
   * @param authorId ID do autor
   * @returns Array de artigos do autor
   */
  public async getArticlesByAuthor(authorId: number): Promise<Article[]> {
    try {
      return await this.articleRepository.findByAuthor(authorId);
    } catch (error) {
      throw new Error('Erro ao buscar artigos do autor');
    }
  }

  /**
   * Atualiza um artigo
   * @param id ID do artigo
   * @param userId ID do usuário que está atualizando
   * @param updateData Dados para atualização
   * @returns Artigo atualizado com dados do autor
   */
  public async updateArticle(id: number, userId: number, updateData: UpdateArticleData): Promise<ArticleWithAuthor> {
    try {
      // Verifica se o artigo existe
      const article = await this.articleRepository.findById(id);
      if (!article) {
        throw new Error('Artigo não encontrado');
      }

      // Verifica se o usuário é o autor
      const isAuthor = await this.articleRepository.isAuthor(id, userId);
      if (!isAuthor) {
        throw new Error('Você não tem permissão para editar este artigo');
      }

      // Validações
      if (updateData.titulo && updateData.titulo.trim().length === 0) {
        throw new Error('Título não pode ser vazio');
      }
      if (updateData.conteudo && updateData.conteudo.trim().length === 0) {
        throw new Error('Conteúdo não pode ser vazio');
      }

      // Atualiza o artigo
      const updated = await this.articleRepository.update(id, updateData);
      if (!updated) {
        throw new Error('Erro ao atualizar artigo');
      }

      // Retorna o artigo atualizado
      const updatedArticle = await this.articleRepository.findByIdWithAuthor(id);
      if (!updatedArticle) {
        throw new Error('Erro ao recuperar artigo atualizado');
      }

      return updatedArticle;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao atualizar artigo');
    }
  }

  /**
   * Deleta um artigo
   * @param id ID do artigo
   * @param userId ID do usuário que está deletando
   * @returns true se deletou com sucesso
   */
  public async deleteArticle(id: number, userId: number): Promise<boolean> {
    try {
      // Verifica se o artigo existe
      const article = await this.articleRepository.findById(id);

      if (!article) {
        throw new Error('Artigo não encontrado');
      }

      // Verifica se o usuário é o autor
      const isAuthor = await this.articleRepository.isAuthor(id, userId);
      if (!isAuthor) {
        throw new Error('Você não tem permissão para deletar este artigo');
      }

      // Deleta o artigo
      const deleted = await this.articleRepository.delete(id);
      return deleted;
      
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao deletar artigo');
    }
  }
}