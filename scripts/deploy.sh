#!/bin/bash
# MeuExame - Script de Deploy
# Uso: ./deploy.sh [ambiente]
# Ambientes: staging, production

set -e

# Configurações
APP_NAME="meuexame"
APP_DIR="/app/${APP_NAME}"
BRANCH="${BRANCH:-main}"
REGISTRY="${REGISTRY:-}"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }

# Verificar ambiente
ENVIRONMENT="${1:-production}"
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    log_error "Ambiente inválido: $ENVIRONMENT"
    echo "Use: ./deploy.sh [staging|production]"
    exit 1
fi

log "Iniciando deploy para ${ENVIRONMENT}..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose não está instalado"
    exit 1
fi

# Verificar se está rodando como root ou tem sudo
if [ "$EUID" -ne 0 ] && ! groups | grep -q docker; then
    log_error "Execute como root ou adicione seu usuário ao grupo docker"
    exit 1
fi

# Backup antes do deploy
log_info "Criando backup de segurança..."
if [ -f "./scripts/backup.sh" ]; then
    ./scripts/backup.sh --all || log_warn "Backup falhou, continuando..."
fi

# Pull das últimas alterações
log_info "Baixando últimas alterações..."
cd ${APP_DIR}
git fetch origin
git checkout ${BRANCH}
git pull origin ${BRANCH}

# Build das imagens Docker
log_info "Construindo imagens Docker..."
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml build --no-cache frontend || docker-compose -f docker-compose.yml build frontend

# Parar serviços
log_info "Parando serviços..."
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml down

# Iniciar serviços
log_info "Iniciando serviços..."
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml up -d

# Aguardar serviços ficarem prontos
log_info "Aguardando serviços..."
sleep 10

# Verificar status
log_info "Verificando status dos serviços..."
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml ps

# Verificar logs
log_info "Logs do Backend (últimas 20 linhas):"
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml logs --tail=20 backend

log_info "Logs do Frontend (últimas 20 linhas):"
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml logs --tail=20 frontend

# Rodar migrations
log_info "Executando migrations do banco de dados..."
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml exec -T backend npx prisma migrate deploy || \
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml exec -T backend npx prisma db push

# Gerar Prisma Client
log_info "Gerando Prisma Client..."
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml exec -T backend npx prisma generate

# Limpar imagens não utilizadas
log_info "Limpando imagens não utilizadas..."
docker system prune -f

# Health check
log_info "Verificando saúde da aplicação..."
sleep 5
if curl -sf http://localhost/health > /dev/null 2>&1; then
    log "✅ Deploy concluído com sucesso!"
    log_info "Aplicação disponível em: http://localhost"
else
    log_warn "Health check falhou, mas serviços podem estar iniciando..."
    log_info "Verifique os logs com: docker-compose logs -f"
fi

# Mostrar status final
echo ""
log "=== Status Final ==="
docker-compose -f docker-compose.yml -f docker-compose.${ENVIRONMENT}.yml ps
echo ""
log "Deploy concluído!"
