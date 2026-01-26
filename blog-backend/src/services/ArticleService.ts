// src/services/ArticleService.ts
import { resolve } from 'path';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { Article, ArticleWithAuthor, CreateArticleData, UpdateArticleData, PaginationParams, PaginationResult } from '../types';
import { deleteFile, resolveUploadPath } from '../utils/fileUtils';

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
      console.log('[ArticleService] Criando artigo:', { articleData, authorId });
      console.log('[ArticleService] CREATE - Author ID:', authorId, 'Tipo:', typeof authorId);

      // Validações
      if (!articleData.titulo || articleData.titulo.trim().length === 0) {
        throw new Error('Título é obrigatório');
      }
      if (articleData.titulo.length < 5 || articleData.titulo.length > 200) {
        throw new Error('Título deve ter entre 5 e 200 caracteres');
      }
      if (!articleData.conteudo || articleData.conteudo.trim().length === 0) {
        throw new Error('Conteúdo é obrigatório');
      }
      if (articleData.conteudo.length < 100) {
        throw new Error('Conteúdo deve ter no mínimo 100 caracteres');
      }
      if (!articleData.categoria) {
        articleData.categoria = 'Dev';
      }
      if (articleData.resumo && articleData.resumo.length > 200) {
        throw new Error('Resumo deve ter no máximo 200 caracteres');
      }

      // Cria o artigo
      const articleId = await this.articleRepository.create(articleData, authorId);
      console.log('[ArticleService] Artigo criado com ID:', articleId);

      // Retorna o artigo criado com dados do autor
      const article = await this.articleRepository.findByIdWithAuthor(articleId);
      if (!article) {
        throw new Error('Erro ao recuperar artigo criado');
      }

      return article;
    } catch (error) {
      console.error('[ArticleService] Erro ao criar artigo:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar artigo');
    }
  }

  /**
   * Busca um artigo pelo ID com dados do autor e incrementa views
   * @param id ID do artigo
   * @returns Artigo com dados do autor ou null
   */
  public async getArticleById(id: number): Promise<ArticleWithAuthor | null> {
    try {
      const article = await this.articleRepository.findByIdWithAuthor(id);
      
      // Incrementa visualizações
      if (article) {
        await this.articleRepository.incrementViews(id);
        article.views += 1; // Atualiza o objeto retornado
      }
      
      return article;
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
   * Lista artigos com paginação e filtros
   * @param params Parâmetros de paginação
   * @returns Artigos paginados
   */
  public async getArticlesWithPagination(params: PaginationParams): Promise<PaginationResult<ArticleWithAuthor>> {
    try {
      console.log('[ArticleService] Buscando artigos com paginação:', params);
      const result = await this.articleRepository.findWithPagination(params);
      console.log('[ArticleService] Artigos encontrados:', result.articles.length);
      return result;
    } catch (error) {
      console.error('[ArticleService] Erro ao listar artigos com paginação:', error);
      throw new Error('Erro ao listar artigos com paginação');
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
  public async updateArticle(id: number, userId: number, updateData: UpdateArticleData): Promise<Article> {
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
      
      if(updateData.imagem_banner && article.imagem_banner){
        const oldFilePath= resolveUploadPath(article.imagem_banner);
        deleteFile(oldFilePath);
      }

      const finalUpdateData: UpdateArticleData = { ...updateData };


      // Validações
      if (updateData.titulo && updateData.titulo.trim().length === 0) {
        throw new Error('Título não pode ser vazio');
      }
      if (updateData.titulo && (updateData.titulo.length < 5 || updateData.titulo.length > 200)) {
        throw new Error('Título deve ter entre 5 e 200 caracteres');
      }
      if (updateData.conteudo && updateData.conteudo.trim().length === 0) {
        throw new Error('Conteúdo não pode ser vazio');
      }
      if (updateData.conteudo && updateData.conteudo.length < 100) {
        throw new Error('Conteúdo deve ter no mínimo 100 caracteres');
      }
      if (updateData.resumo && updateData.resumo.length > 200) {
        throw new Error('Resumo deve ter no máximo 200 caracteres');
      }

      // Atualiza o artigo
      const updated = await this.articleRepository.update(id, finalUpdateData);
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
      console.log('[ArticleService] DELETE - Artigo ID:', id, 'User ID:', userId);
      
      // Verifica se o artigo existe
      const article = await this.articleRepository.findById(id);

      if (!article) {
        throw new Error('Artigo não encontrado');
      }

      console.log('[ArticleService] DELETE - Artigo encontrado:', { id: article.id, id_autor: article.id_autor });
      console.log('[ArticleService] DELETE - Comparação: article.id_autor=', article.id_autor, 'typeof=', typeof article.id_autor, '| userId=', userId, 'typeof=', typeof userId);

      // Verifica se o usuário é o autor
      const isAuthor = await this.articleRepository.isAuthor(id, userId);
      console.log('[ArticleService] DELETE - isAuthor resultado:', isAuthor);
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