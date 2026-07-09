FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema (incluindo OpenSSL para o Prisma)
RUN apk add --no-cache python3 make g++ openssl libcrypto3 libssl3
ENV PYTHON=/usr/bin/python3

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]