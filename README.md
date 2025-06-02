React-router Framework / ShadCN
https://ui.shadcn.com/docs/installation/react-router

Clerk
https://clerk.com/docs/quickstarts/react-router?_gl=1*d1mlgd*_gcl_au*MTQzMzg3MjI1Ni4xNzQ3MjkzMjIy*_ga*MTQ0MDAyNDk2Ny4xNzQ3MjkzMjIy*_ga_1WMF5X234K*czE3NDgwNjI3MTMkbzIkZzEkdDE3NDgwNjM0MjkkajAkbDAkaDA.

NestJS
nest new backend --skip-git --package-manager=pnpm

- nest g res business --no-spec

- Drizzle Setup

  - https://www.youtube.com/watch?v=xCjA88zNBx8
  - pnpm add drizzle-orm pg @nestjs/config
  - pnpm add -D drizzle-kit @types/pg
  - npx drizzle-kit generate

  RUN IN DOCKER:

  - npx drizzle-kit migrate
  - pnpm run db:seed

  - npx drizzle-kit studio

PostgreSQL
