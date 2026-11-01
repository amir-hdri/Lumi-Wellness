# Next.js standalone image. Build from the repo root: docker build -f apps/web/Dockerfile .
FROM node:20-alpine AS deps
WORKDIR /srv
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json apps/web/
RUN npm ci --workspace=apps/web

FROM node:20-alpine AS builder
WORKDIR /srv
COPY --from=deps /srv/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* values are inlined into the bundle, so they have to be known at
# build time. The deploy guard in config/deploy-env.mjs rejects a build that
# still points at the mock layer or at localhost.
ENV NEXT_DOCKER_BUILD=1
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_USE_MOCKS=false
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_USE_MOCKS=$NEXT_PUBLIC_USE_MOCKS
RUN npm run build --workspace=apps/web

FROM node:20-alpine AS runner
WORKDIR /srv
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /srv/apps/web/.next/standalone ./
COPY --from=builder /srv/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /srv/apps/web/public ./apps/web/public
USER app
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
