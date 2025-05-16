FROM node:22-alpine3.21 AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM deps AS test
COPY . .
CMD ["pnpm", "test"]

FROM deps AS dev
WORKDIR /app
COPY . .
EXPOSE 8000
CMD ["pnpm", "run", "start:dev"]

FROM deps AS builder
WORKDIR /app
COPY . .
RUN pnpm build

FROM deps AS prod-deps
WORKDIR /app
RUN pnpm install --prod

EXPOSE 8000

CMD ["node", "dist/main"]
