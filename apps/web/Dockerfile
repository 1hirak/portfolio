FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
COPY package.json .npmrc ./
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=1024" NEXT_PUBLIC_STRAPI_URL= STRAPI_INTERNAL_URL=http://cms:1337 pnpm build

FROM node:22-alpine AS runner
RUN apk add --no-cache curl
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs
WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

USER nextjs
CMD ["node", "server.js"]
