# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Configurar registry mais rápido
RUN npm config set registry https://registry.npmmirror.com

# Copiar arquivos de configuração
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Instalar dependências com mais tempo e retries
RUN npm install --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
RUN cd backend && npm install --ignore-scripts --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
RUN cd frontend && npm install --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

# Copiar código fonte
COPY . .

# Gerar Prisma client
RUN cd backend && npx prisma generate

# Build do backend
RUN cd backend && npm run build

# Build do frontend
RUN cd frontend && NEXT_TYPESCRIPT_CHECK=skip npm run build || true

# Estágio 2: Produção
FROM node:20-alpine

WORKDIR /app

# Copiar dependências
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/frontend/package*.json ./frontend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules

# Copiar código buildado
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
# Copiar arquivos de configuração TypeScript
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/backend/tsconfig.json ./backend/
COPY --from=builder /app/backend/tsconfig.build.json ./backend/
# Copiar Prisma
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma

EXPOSE 3000 3001

CMD ["npm", "start"]
