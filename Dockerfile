# ---------- deps ----------
FROM node:18-alpine AS deps
WORKDIR /app

# Needed by sharp on alpine (optional but recommended)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
# Use legacy-peer-deps because your tree has peer conflicts (plaiceholder/sharp)
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# ---------- build ----------
FROM node:18-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next 11 + webpack hash issue on OpenSSL 3
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV NODE_ENV=production

RUN npm run build

# ---------- runtime ----------
FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV PORT=5001

# Copy only what Next needs at runtime
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 5001
CMD ["npm", "run", "start"]
