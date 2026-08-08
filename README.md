# Users Manager

Aplicação para listar personagens de Rick and Morty, com filtros, paginação, edição de nome e exclusão de registros.

## Como rodar

Requisitos: Node.js, npm e Docker.

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Esse comando cria o `.env` copiando as configurações de `.env.example`.

3. Inicie o PostgreSQL:

```bash
docker compose up -d
```

4. Execute as migrations:

```bash
npm run db:migrate
```

5. Importe os usuários:

```bash
npm run db:seed
```

A seed não altera usuários que já possuem o mesmo ID no banco. Ela cria apenas os que ainda não existem.

6. Inicie o back-end:

```bash
npm run dev:server
```

7. Em outro terminal, inicie o front-end:

```bash
npm run dev:web
```

Por padrão, o front-end usa `http://localhost:5173` e a API usa `http://localhost:3000`. Confira nos terminais as URLs utilizadas ao iniciar cada aplicação.
