# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for prisma and other native modules
RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

# Create app directory and set permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

# Copy only necessary files from builder
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Copy assets (needed for fonts/etc later)
COPY --from=builder --chown=node:node /app/assets ./assets

USER node

EXPOSE 3001

CMD ["node", "dist/main"]
