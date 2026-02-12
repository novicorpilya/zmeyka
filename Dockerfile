# Production Dockerfile for Frontend (Nuxt)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Set build time environment variables if needed
ARG API_BASE_URL
ENV NUXT_PUBLIC_API_BASE=$API_BASE_URL

RUN npm run build

# Final image
FROM node:20-alpine AS runner

WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Copy only output and package.json
COPY --from=builder --chown=node:node /app/.output ./.output
COPY --from=builder --chown=node:node /app/package.json ./package.json

USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
