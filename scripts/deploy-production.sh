#!/bin/bash

# ===========================================
# Script de Deploy - MeuExame Production
# ===========================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerequisites
check_prerequisites() {
    log_info "Verificando prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker não está instalado"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose não está instalado"
        exit 1
    fi
    
    log_info "Prerequisites OK"
}

# Carregar variáveis de ambiente
load_env() {
    if [ -f .env ]; then
        log_info "Carregando variáveis de ambiente do .env"
        export $(cat .env | grep -v '^#' | xargs)
    else
        log_warn "Arquivo .env não encontrado, usando defaults"
    fi
}

# Build das imagens
build_images() {
    log_info "Construindo imagens Docker..."
    
    docker-compose -f docker-compose.prod.yml build --no-cache
}

# Iniciar serviços
start_services() {
    log_info "Iniciando serviços..."
    
    docker-compose -f docker-compose.prod.yml up -d
    
    log_info "Aguardando serviços ficarem healthy..."
    sleep 10
    
    # Verificar status
    docker-compose -f docker-compose.prod.yml ps
}

# Executar migrations
run_migrations() {
    log_info "Executando migrations do banco de dados..."
    
    docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy || {
        log_warn "Migration falhou, tentando db push..."
        docker-compose -f docker-compose.prod.yml exec -T backend npx prisma db push
    }
}

# Verificar health
check_health() {
    log_info "Verificando health dos serviços..."
    
    # Backend health
    BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health || echo "000")
    if [ "$BACKEND_HEALTH" = "200" ]; then
        log_info "Backend: OK"
    else
        log_warn "Backend: FALHOU (HTTP $BACKEND_HEALTH)"
    fi
    
    # Frontend health
    FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
    if [ "$FRONTEND_HEALTH" = "200" ]; then
        log_info "Frontend: OK"
    else
        log_warn "Frontend: FALHOU (HTTP $FRONTEND_HEALTH)"
    fi
}

# Limpar imagens antigas
cleanup() {
    log_info "Limpando imagens não usadas..."
    docker system prune -f || true
}

# Mostrar logs
show_logs() {
    log_info "Logs recentes (últimas 50 linhas):"
    docker-compose -f docker-compose.prod.yml logs --tail=50
}

# Função principal
main() {
    echo "=========================================="
    echo "  MeuExame - Deploy de Produção"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    load_env
    build_images
    start_services
    run_migrations
    check_health
    
    echo ""
    echo "=========================================="
    echo "  Deploy Concluído!"
    echo "=========================================="
    echo ""
    echo " URLs:"
    echo "  - Frontend: http://localhost"
    echo "  - Backend:  http://localhost/api"
    echo "  - Health:   http://localhost/api/health"
    echo ""
    
    read -p "Deseja ver os logs? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        show_logs
    fi
}

# Processar argumentos
case "${1:-}" in
    build)
        check_prerequisites
        load_env
        build_images
        ;;
    start)
        load_env
        start_services
        ;;
    migrate)
        load_env
        run_migrations
        ;;
    health)
        check_health
        ;;
    logs)
        show_logs
        ;;
    restart)
        load_env
        log_info "Parando serviços..."
        docker-compose -f docker-compose.prod.yml down
        start_services
        ;;
    clean)
        log_warn "Parando e removendo todos os containers..."
        docker-compose -f docker-compose.prod.yml down -v
        cleanup
        ;;
    *)
        main
        ;;
esac
