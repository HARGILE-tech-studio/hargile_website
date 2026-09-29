# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL=https://hargile.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# HARG-386 : script de vérification Sentry, lancé à la main dans le pod
# (kubectl exec ... node scripts/sentry-smoke.mjs) avec la même config que l'app.
# @sentry/node est tracé dans le node_modules standalone grâce à
# serverExternalPackages (next.config), sinon Turbopack l'inline dans le chunk.
COPY --from=builder --chown=nextjs:nodejs /app/scripts/sentry-smoke.mjs ./scripts/sentry-smoke.mjs
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/sentry/config.mjs ./src/lib/sentry/config.mjs

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
