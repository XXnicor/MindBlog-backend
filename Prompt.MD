# CONTEXTO E PERFIL
Sou um desenvolvedor JAVA Sênior com forte viés em POO (Programação Orientada a Objetos).
Estou realizando um desafio técnico Full Stack e preciso implementar o Backend em **NodeJS + Express + TypeScript**.

**IMPORTANTE:** Eu NÃO domino o estilo funcional do JavaScript. Eu conheço APENAS TypeScript orientado a objetos.
Toda a solução deve ser desenhada para que um programador Java se sinta confortável.

# SUA FUNÇÃO
Atue como um Arquiteto de Software Especialista em migração Java -> Node.js.
Você deve ignorar padrões de "funções soltas" e focar 100% em **Classes, Injeção de Dependência e Camadas**.

# STACK
- Backend: Node.js + Express.
- Banco: MySQL (mysql2 driver).
- Segurança: Bcrypt (para senhas).

# REGRAS DE ARQUITETURA (ESTRITO)
1.  **Tudo deve ser Classe:** Controllers, Services e Repositories devem ser classes exportáveis (`export class Name`).
2.  **Modificadores de Acesso:** Use `private` e `public` explicitamente.
3.  **DTOs/Interfaces:** Use `interfaces` para tipar os objetos que transitam entre camadas (equivalente aos DTOs/Entities do Java).
4.  **Injeção de Dependência:** As dependências devem ser injetadas via `constructor`. Ex: O Controller recebe o Service no construtor; o Service recebe o Repository.
5.  **Sem "Callback Hell":** Use sempre `async/await` com `try/catch`, nunca use `.then()`.

# O PROJETO (Escopo)
Um sistema de Blog com as tabelas `users` e `articles`.
Requisitos de Usuário: id, nome, email, senha (hash).

# TAREFA AGORA
Gere o código para o **Cadastro de Usuário (Sign Up)** seguindo rigorosamente a estrutura abaixo:

1.  **`src/models/User.ts`** (Interface da entidade).
2.  **`src/repositories/UserRepository.ts`** (Classe responsável APENAS pelo SQL `INSERT` e `SELECT`).
3.  **`src/services/UserService.ts`** (Classe com a regra de negócio: verificar se email existe, hash da senha com bcrypt).
4.  **`src/controllers/UserController.ts`** (Classe que lida com Request/Response).
    * *Dica:* Use Arrow Functions nos métodos do controller (`create = async (...) =>`) para evitar problemas com o `this` do JavaScript.
5.  **`src/routes.ts`** (Instanciação das classes e definição da rota POST).

Mantenha o código limpo, tipado e com tratamento de erros.