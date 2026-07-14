# Generic Dockerfile for Next.js applications
# This is a template file - customize as needed for your specific requirements

# Use the current Node.js LTS line.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build the application
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

EXPOSE 3000
CMD ["npm", "run", "start"]
