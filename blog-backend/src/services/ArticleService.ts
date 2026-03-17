import { resolve } from 'path';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { Article, ArticleWithAuthor, CreateArticleData, UpdateArticleData, PaginationParams, PaginationResult } from '../types';
import { deleteFile, resolveUploadPath } from '../utils/fileUtils';

export class ArticleService {
  private articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  public async createArticle(articleData: CreateArticleData, authorId: number): Promise<ArticleWithAuthor> {
    try {
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

      const articleId = await this.articleRepository.create(articleData, authorId);

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

  public async getArticleById(id: number): Promise<ArticleWithAuthor | null> {
    try {
      const article = await this.articleRepository.findByIdWithAuthor(id);
      
      if (article) {
        await this.articleRepository.incrementViews(id);
        article.views += 1; // Atualiza o objeto retornado
      }
      
      return article;
    } catch (error) {
      throw new Error('Erro ao buscar artigo');
    }
  }

  public async getAllArticles(): Promise<ArticleWithAuthor[]> {
    try {
      return await this.articleRepository.findAllWithAuthors();
    } catch (error) {
      throw new Error('Erro ao listar artigos');
    }
  }

  public async getArticlesWithPagination(params: PaginationParams): Promise<PaginationResult<ArticleWithAuthor>> {
    return this.articleRepository.findWithPagination(params);
  }

  public async getArticlesByAuthor(authorId: number): Promise<Article[]> {
    try {
      return await this.articleRepository.findByAuthor(authorId);
    } catch (error) {
      throw new Error('Erro ao buscar artigos do autor');
    }
  }

  public async updateArticle(id: number, userId: number, updateData: UpdateArticleData): Promise<Article> {
    try {
      const article = await this.articleRepository.findById(id);
      if (!article) {
        throw new Error('Artigo não encontrado');
      }

      const isAuthor = await this.articleRepository.isAuthor(id, userId);
      if (!isAuthor) {
        throw new Error('Você não tem permissão para editar este artigo');
      }
      
      if(updateData.imagem_banner && article.imagem_banner){
        const oldFilePath= resolveUploadPath(article.imagem_banner);
        deleteFile(oldFilePath);
      }

      const finalUpdateData: UpdateArticleData = { ...updateData };

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

      const updated = await this.articleRepository.update(id, finalUpdateData);
      if (!updated) {
        throw new Error('Erro ao atualizar artigo');
      }

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

  public async deleteArticle(id: number, userId: number): Promise<boolean> {
    try {
      const article = await this.articleRepository.findById(id);

      if (!article) {
        throw new Error('Artigo não encontrado');
      }

      const isAuthor = await this.articleRepository.isAuthor(id, userId);
      if (!isAuthor) {
        throw new Error('Você não tem permissão para deletar este artigo');
      }

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