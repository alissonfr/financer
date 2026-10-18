# finance (monorepo)

- `finance-angular/` — frontend Angular 19 (SSR, Tailwind)
- `finance-nestjs/` — API NestJS 10 + TypeORM + Postgres

Cada projeto mantém seu próprio `package.json`, `package-lock.json`, `node_modules` e `Dockerfile`.
O `package.json` da raiz só orquestra scripts via `npm --prefix`.

## Regra de commits (OBRIGATÓRIA)

- **Nunca** faça `git commit` (nem `git push`, `git commit --amend`, `git merge`, `git rebase` ou qualquer
  outra coisa que crie/reescreva commits) neste repositório por iniciativa própria.
- Só commite quando o usuário pedir explicitamente, naquele momento, algo como "commita" / "faz o commit".
  Uma autorização vale apenas para aquele pedido — não se estende a tarefas seguintes.
- Ao terminar uma tarefa, deixe as alterações no working tree e, no máximo, informe que estão prontas para commit.
