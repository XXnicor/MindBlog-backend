// src/utils/fileUtils.spec.ts
describe('FileUtils', () => {
  describe('deleteFile', () => {
    it('deve deletar arquivo existente', () => {
      // Given: arquivo existe no filesystem
      // When: deleteFile é chamado
      // Then: arquivo não existe mais
    });

    it('não deve lançar erro se arquivo não existe', () => {
      // Given: arquivo não existe
      // When: deleteFile é chamado
      // Then: não lança erro (fail silently)
    });
  });
});

// src/services/ArticleService.spec.ts
describe('ArticleService.updateArticle', () => {
  it('deve manter banner antigo se não enviar novo', async () => {
    // Given: artigo com banner 'old.jpg'
    // When: update sem campo imagem_banner
    // Then: banco mantém 'old.jpg', arquivo não é deletado
  });

  it('deve substituir banner antigo por novo', async () => {
    // Given: artigo com banner 'old.jpg'
    // When: update com novo arquivo 'new.jpg'
    // Then: 'old.jpg' deletado, banco tem 'new.jpg'
  });

  it('deve adicionar banner em artigo que não tinha', async () => {
    // Given: artigo sem banner (null)
    // When: update com arquivo 'new.jpg'
    // Then: banco atualizado com 'new.jpg', nenhum delete
  });

  it('deve atualizar apenas titulo sem mexer no banner', async () => {
    // Given: artigo com banner 'old.jpg'
    // When: update apenas { titulo: 'Novo' }
    // Then: titulo atualizado, banner inalterado
  });
});