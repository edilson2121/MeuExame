# SSL Certificates

Esta pasta deve conter os certificados SSL para HTTPS.

## Opção 1: Let's Encrypt (Recomendado)

```bash
# Instalar certbot
apt install certbot python3-certbot-nginx

# Gerar certificados
certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Ou para wildcard
certbot certonly --manual --preferred-challenges dns -d "*.seu-dominio.com"

# Os certificados serão salvos em:
# /etc/letsencrypt/live/seu-dominio.com/
```

## Opção 2: Certificados Próprios

Coloque seus arquivos aqui:
- `fullchain.pem` - Certificado + CA intermediária
- `privkey.pem` - Chave privada

## Opção 3: Auto-assinados (Desenvolvimento)

```bash
# Gerar certificado auto-assinado
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem -out fullchain.pem \
  -subj "/C=MZ/ST=Maputo/L=Maputo/O=MeuExame/CN=localhost"
```

## Configuração Docker

No `docker-compose.prod.yml`, monte o diretório:
```yaml
nginx:
  volumes:
    - ./docker/nginx/ssl:/etc/nginx/ssl:ro
```
