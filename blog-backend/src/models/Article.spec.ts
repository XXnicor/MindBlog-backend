// src/models/Article.spec.ts
import { Article } from './Article';

describe('Article Model', () => {
  it('deve criar artigo válido', () => {
    const article = Article.create(
      'Meu Primeiro Artigo',
      'Este é o conteúdo do artigo com mais de 10 caracteres.',
      1
    );

    expect(article.titulo).toBe('Meu Primeiro Artigo');
    expect(article.conteudo).toBe('Este é o conteúdo do artigo com mais de 10 caracteres.');
    expect(article.id_autor).toBe(1);
    expect(article.id).toBeNull(); // novo artigo
    expect(article.imagem_banner).toBeNull();
  });

  it('deve criar artigo com banner', () => {
    const article = Article.create(
      'Artigo com Banner',
      'Conteúdo suficiente aqui.',
      1,
      '/uploads/banner.jpg'
    );

    expect(article.imagem_banner).toBe('/uploads/banner.jpg');
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
    }).toThrow('id_autor inválido');
  });

  it('deve reconstruir artigo do banco', () => {
    const article = Article.fromDatabase({
      id: 1,
      titulo: 'Artigo do Banco',
      conteudo: 'Conteúdo recuperado do banco de dados.',
      imagem_banner: '/uploads/banner.jpg',
      id_autor: 5,
      data_publicacao: new Date('2025-01-01'),
      data_alteracao: new Date('2025-01-10')
    });

    expect(article.id).toBe(1);
    expect(article.titulo).toBe('Artigo do Banco');
    expect(article.id_autor).toBe(5);
    expect(article.imagem_banner).toBe('/uploads/banner.jpg');
    expect(article.data_publicacao).toEqual(new Date('2025-01-01'));
  });

  it('toDTO deve expor todos os campos públicos', () => {
    const article = Article.fromDatabase({
      id: 1,
      titulo: 'Teste',
      conteudo: 'Conteúdo teste aqui.',
      imagem_banner: null,
      id_autor: 1,
      data_publicacao: new Date('2025-01-01')
    });

    const dto = article.toDTO();

    expect(dto.id).toBe(1);
    expect(dto.titulo).toBe('Teste');
    expect(dto.conteudo).toBe('Conteúdo teste aqui.');
    expect(dto.imagem_banner).toBeNull();
    expect(dto.id_autor).toBe(1);
    expect(dto.data_publicacao).toEqual(new Date('2025-01-01'));
  });
});