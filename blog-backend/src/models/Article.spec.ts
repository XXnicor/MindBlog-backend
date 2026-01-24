// src/models/Article.spec.ts
import { Article } from './Article';

describe('Article Model', () => {
  it('deve criar artigo válido', () => {
    const article = Article.create(
      'Meu Primeiro Artigo',
      'Este é o conteúdo do artigo com mais de 10 caracteres.',
      1
    );

    expect(article.title).toBe('Meu Primeiro Artigo');
    expect(article.content).toBe('Este é o conteúdo do artigo com mais de 10 caracteres.');
    expect(article.authorId).toBe(1);
    expect(article.id).toBeNull(); // novo artigo
    expect(article.bannerPath).toBeNull();
  });

  it('deve criar artigo com banner', () => {
    const article = Article.create(
      'Artigo com Banner',
      'Conteúdo suficiente aqui.',
      1,
      '/uploads/banner.jpg'
    );

    expect(article.bannerPath).toBe('/uploads/banner.jpg');
  });

  it('deve lançar erro para título vazio', () => {
    expect(() => {
      Article.create('', 'Conteúdo válido aqui.', 1);
    }).toThrow('Título não pode ser vazio');
  });

  it('deve lançar erro para conteúdo curto', () => {
    expect(() => {
      Article.create('Título válido', 'Curto', 1);
    }).toThrow('Conteúdo deve ter no mínimo 10 caracteres');
  });

  it('deve lançar erro para authorId inválido', () => {
    expect(() => {
      Article.create('Título', 'Conteúdo válido aqui.', 0);
    }).toThrow('authorId inválido');
  });

  it('deve reconstruir artigo do banco', () => {
    const article = Article.fromDatabase({
      id: 1,
      title: 'Artigo do Banco',
      content: 'Conteúdo recuperado do banco de dados.',
      banner_path: '/uploads/banner.jpg',
      author_id: 5,
      created_at: new Date('2025-01-01'),
      updated_at: new Date('2025-01-10')
    });

    expect(article.id).toBe(1);
    expect(article.title).toBe('Artigo do Banco');
    expect(article.authorId).toBe(5);
    expect(article.bannerPath).toBe('/uploads/banner.jpg');
    expect(article.createdAt).toEqual(new Date('2025-01-01'));
  });

  it('toDTO deve expor todos os campos públicos', () => {
    const article = Article.fromDatabase({
      id: 1,
      title: 'Teste',
      content: 'Conteúdo teste aqui.',
      banner_path: null,
      author_id: 1,
      created_at: new Date('2025-01-01')
    });

    const dto = article.toDTO();
    
    expect(dto.id).toBe(1);
    expect(dto.title).toBe('Teste');
    expect(dto.content).toBe('Conteúdo teste aqui.');
    expect(dto.bannerPath).toBeNull();
    expect(dto.authorId).toBe(1);
    expect(dto.createdAt).toEqual(new Date('2025-01-01'));
  });
});