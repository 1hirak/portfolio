FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json .npmrc ./
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=1536" NODE_ENV=production pnpm build

FROM node:22-alpine AS runner
RUN apk add --no-cache curl
RUN addgroup -S strapi && adduser -S strapi -G strapi
WORKDIR /app
COPY --from=builder --chown=strapi:strapi /app/build ./build
COPY --from=builder --chown=strapi:strapi /app/config ./config
COPY --from=builder --chown=strapi:strapi /app/src ./src
COPY --from=builder --chown=strapi:strapi /app/node_modules ./node_modules
COPY --from=builder --chown=strapi:strapi /app/package.json ./
COPY --from=builder --chown=strapi:strapi /app/database ./database
COPY --from=builder --chown=strapi:strapi /app/.npmrc ./
RUN mkdir -p /app/database/migrations /app/public/uploads && chown -R strapi:strapi /app

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:1337/_health || exit 1

USER strapi
ENV NODE_ENV=production
CMD ["node", "node_modules/.bin/strapi", "start"]
