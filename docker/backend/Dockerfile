FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências de build
RUN apk add --no-cache python3 make g++

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código
COPY . .

# Gerar Prisma Client e build
RUN npx prisma generate
RUN npm run build

# Imagem final
FROM node:20-alpine

WORKDIR /app

# Instalar dependências de produção
RUN apk add --no-cache tini

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# Copiar código buildado
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs

# Expor porta
EXPOSE 3001

# Usar tini como init system
ENTRYPOINT ["/sbin/tini", "--"]

# Comando de start
CMD ["node", "dist/main"]
