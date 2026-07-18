FROM nginx:1.25-alpine

# Copiar configuração
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Criar diretório para uploads
RUN mkdir -p /app/uploads

# Expor porta
EXPOSE 80 443

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
