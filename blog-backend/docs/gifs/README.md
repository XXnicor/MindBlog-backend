# 📂 GIFs de Demonstração

Esta pasta contém os GIFs de demonstração das funcionalidades do sistema para exibição no README do GitHub.

## 📋 Lista de GIFs Necessários

Coloque seus GIFs nesta pasta com os seguintes nomes:

### 1. `login-register.gif`
**Demonstra:**
- Página de registro de novo usuário
- Preenchimento do formulário (nome, email, senha)
- Validação de campos
- Login com credenciais
- Recebimento do token JWT
- Redirecionamento para dashboard

**Duração recomendada:** 15-20 segundos

---

### 2. `create-article.gif`
**Demonstra:**
- Acesso à página de criar artigo
- Preenchimento de título, resumo e conteúdo
- Seleção de categoria
- Adição de tags
- Upload de imagem de banner
- Publicação do artigo
- Visualização do artigo criado

**Duração recomendada:** 20-30 segundos

---

### 3. `upload-avatar.gif`
**Demonstra:**
- Acesso ao perfil do usuário
- Clique no botão de editar perfil
- Upload de foto de avatar
- Preview da imagem
- Atualização de nome e bio
- Salvamento das alterações
- Visualização do novo avatar no perfil

**Duração recomendada:** 15-20 segundos

---

### 4. `comments.gif`
**Demonstra:**
- Visualização de um artigo
- Rolagem até a seção de comentários
- Digitação de um comentário
- Publicação do comentário
- Visualização do comentário publicado
- (Opcional) Deletar comentário próprio

**Duração recomendada:** 15-20 segundos

---

### 5. `list-search.gif`
**Demonstra:**
- Página inicial com lista de artigos
- Paginação funcionando (próxima página, anterior)
- Filtro por categoria
- Campo de busca em ação
- Resultados aparecendo em tempo real
- Clique em um artigo para visualizar

**Duração recomendada:** 20-25 segundos

---

### 6. `stats-dashboard.gif`
**Demonstra:**
- Acesso ao dashboard/estatísticas do usuário
- Visualização de cards com números:
  - Total de artigos publicados
  - Total de comentários recebidos
  - Views totais
  - Likes totais
- Listagem dos artigos do usuário
- (Opcional) Gráficos ou métricas adicionais

**Duração recomendada:** 10-15 segundos

---

## 🎨 Dicas para Criar GIFs de Qualidade

### Ferramentas Recomendadas:
- **[ScreenToGif](https://www.screentogif.com/)** (Windows) - Gratuito e poderoso
- **[Kap](https://getkap.co/)** (macOS) - Open source e leve
- **[Peek](https://github.com/phw/peek)** (Linux) - Simples e eficiente
- **[LICEcap](https://www.cockos.com/licecap/)** (Windows/macOS) - Leve

### Configurações Recomendadas:
- **Resolução**: 1280x720 ou 1920x1080
- **FPS**: 10-15 (suficiente para demonstração)
- **Tamanho do arquivo**: Máximo 10MB por GIF
- **Qualidade**: Otimize para web (use ferramentas como [ezgif.com](https://ezgif.com/optimize))

### Boas Práticas:
1. **Velocidade**: Não acelere demais - deixe tempo para o viewer entender
2. **Foco**: Mostre apenas a área relevante da tela
3. **Cursor**: Certifique-se de que o cursor está visível e destaca ações importantes
4. **Loop**: Configure para repetir automaticamente
5. **Limpeza**: Remova dados sensíveis (emails reais, senhas, etc.)
6. **Consistência**: Use o mesmo tema/aparência em todos os GIFs

### Exemplo de Fluxo:
1. Prepare o ambiente (limpe histórico, use dados de teste)
2. Ensaie a sequência antes de gravar
3. Grave com calma e de forma fluida
4. Edite para remover pausas longas
5. Otimize o tamanho do arquivo
6. Teste se o loop funciona bem

---

## 📝 Alternativa: Usar Placeholders

Se você ainda não tem os GIFs, pode usar placeholders temporários. Crie imagens PNG simples com o texto:

```
🎬 GIF EM BREVE
[Nome da Funcionalidade]
```

Você pode gerar esses placeholders em sites como:
- [placeholder.com](https://placeholder.com/)
- [dummyimage.com](https://dummyimage.com/)

Exemplo:
```markdown
<img src="https://via.placeholder.com/800x450/667eea/ffffff?text=Login+e+Registro+-+GIF+em+breve" alt="Login" width="800px">
```

---

## 🔄 Como Substituir os GIFs

Quando seus GIFs estiverem prontos:

1. Salve-os nesta pasta (`docs/gifs/`)
2. Use exatamente os nomes especificados acima
3. Faça commit das alterações
4. Push para o GitHub
5. O README exibirá automaticamente os GIFs

```bash
git add docs/gifs/
git commit -m "Adiciona GIFs de demonstração"
git push origin main
```

---

## ✅ Checklist

- [ ] `login-register.gif` - Autenticação
- [ ] `create-article.gif` - Criar artigo
- [ ] `upload-avatar.gif` - Upload de avatar
- [ ] `comments.gif` - Sistema de comentários
- [ ] `list-search.gif` - Listagem e busca
- [ ] `stats-dashboard.gif` - Dashboard de estatísticas

---

**Dica Final:** Mantenha os GIFs atualizados conforme o sistema evolui para que sempre reflitam as funcionalidades mais recentes! 🚀
