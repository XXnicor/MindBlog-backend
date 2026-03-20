export function formatArticleAutor(article: any): any {
  if (!article) return article;

  if (article.autor && typeof article.autor === 'object' && article.autor.id) {
    return article;
  }

  return {
    ...article,
    autor: {
      id:     article.id_autor      ?? null,
      nome:   article.autor_nome    ?? null,
      email:  article.autor_email   ?? null,
      avatar: article.autor_avatar  ?? null,
      bio:    article.autor_bio     ?? null
    }
  };
}

export function formatArticlesList(articles: any[]): any[] {
  if (!Array.isArray(articles)) return [];
  return articles.map(formatArticleAutor);
}
