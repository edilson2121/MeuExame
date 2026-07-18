# ===========================================
# MeuExame Frontend - Dockerfile de Produção
# ===========================================

# Estágio 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++ libc-dev linux-headers

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte
COPY . .

# Gerar build de produção
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ===========================================
# Estágio 2: Produção
# ===========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Criar diretórios
RUN mkdir -p /app/public /app/uploads && \
    chown nextjs:nodejs /app/public /app/uploads

# Copiar arquivos do build
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/uploads ./uploads

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED 1

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
