FROM node:20-alpine

WORKDIR /app

# ============================================
# 1. Instalar dependências do sistema em etapas
#    para evitar I/O errors
# ============================================

# Atualizar índice de pacotes primeiro
RUN apk update

# Instalar dependências individuais com retry
RUN apk add --no-cache python3 || apk add --no-cache python3 --force
RUN apk add --no-cache make || apk add --no-cache make --force
RUN apk add --no-cache openssl libcrypto3 libssl3 || \
    apk add --no-cache openssl libcrypto3 libssl3 --force

# Instalar g++ por último (é o maior pacote e causa mais problemas)
RUN apk add --no-cache g++ || \
    apk add --no-cache g++ --force-broken-world

ENV PYTHON=/usr/bin/python3

# ============================================
# 2. Copiar e instalar dependências do Node
# ============================================

COPY package*.json ./
COPY prisma ./prisma

# Instalar dependências com flags para evitar problemas
RUN npm install --legacy-peer-deps

# ============================================
# 3. Copiar o resto do código
# ============================================

COPY . .

# ============================================
# 4. Gerar Prisma client e build
# ============================================

RUN npx prisma generate
RUN npm run build

# ============================================
# 5. Configurar porta e comando de start
# ============================================

EXPOSE 3001

CMD ["npm", "run", "start:prod"]