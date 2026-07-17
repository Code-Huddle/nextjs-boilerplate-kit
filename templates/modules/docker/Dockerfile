# Generic Dockerfile for Next.js applications
# This is a template file - customize as needed for your specific requirements

# Use the current Node.js LTS line.
FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build the application
FROM node:26-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next ./.next

RUN npm ci --omit=dev --ignore-scripts \
  && npm cache clean --force \
  && chown -R node:node /app

EXPOSE 3000
USER node
CMD ["npm", "run", "start"]
