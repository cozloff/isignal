FROM node:22-alpine3.21 AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /workdir
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install
COPY . . 

FROM deps AS test
WORKDIR /workdir
CMD ["pnpm", "test:coverage"]
COPY . .

FROM deps AS builder
WORKDIR /workdir
RUN pnpm build

FROM deps AS dev
WORKDIR /workdir  
CMD [ "pnpm", "dev" ]


FROM deps AS prod-deps
WORKDIR /workdir
RUN pnpm install --prod

FROM base AS runner
WORKDIR /workdir
RUN addgroup --system --gid 1001 remix
RUN adduser --system --uid 1001 remix
USER remix
EXPOSE 3000
COPY --from=prod-deps --chown=remix:remix /workdir/package*.json ./
COPY --from=prod-deps --chown=remix:remix /workdir/node_modules ./node_modules
COPY --from=builder --chown=remix:remix /workdir/build ./build
COPY --from=builder --chown=remix:remix /workdir/public ./public
ENTRYPOINT ["pnpm", "start"]