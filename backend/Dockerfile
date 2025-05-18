FROM node:22-alpine3.21 AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /workdir
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM deps AS test
COPY . .
CMD ["pnpm", "test"]

FROM deps AS dev
WORKDIR /workdir
COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "start:dev"]

FROM deps AS builder
WORKDIR /workdir
COPY . .
RUN pnpm build

FROM deps AS prod-deps
WORKDIR /workdir
RUN pnpm install --prod

EXPOSE 3000

CMD ["node", "dist/main"]
