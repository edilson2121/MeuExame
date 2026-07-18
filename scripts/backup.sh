#!/bin/bash
# MeuExame - Script de Backup
# Uso: ./backup.sh [opções]
# Opções: --all, --db, --uploads, --config

set -e

# Configurações
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="${DB_NAME:-meuexame}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
S3_BUCKET="${S3_BUCKET:-meuexame-backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Criar diretório de backup se não existir
mkdir -p ${BACKUP_DIR}

# Função para backup do banco de dados
backup_db() {
    log_info "Iniciando backup do banco de dados..."
    
    local db_backup="${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"
    
    if pg_dump -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" | gzip > "${db_backup}"; then
        log_info "Backup do banco criado: ${db_backup}"
        
        # Calcular checksum
        local checksum=$(sha256sum "${db_backup}" | awk '{print $1}')
        echo "${checksum}  ${db_backup}" > "${db_backup}.sha256"
        
        # Upload para S3 se configurado
        if [ -n "${AWS_ACCESS_KEY_ID}" ]; then
            log_info "Enviando para S3..."
            aws s3 cp "${db_backup}" "s3://${S3_BUCKET}/db/"
            aws s3 cp "${db_backup}.sha256" "s3://${S3_BUCKET}/db/"
        fi
    else
        log_error "Falha ao criar backup do banco de dados"
        return 1
    fi
}

# Função para backup dos uploads
backup_uploads() {
    log_info "Iniciando backup dos uploads..."
    
    local uploads_backup="${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz"
    
    if [ -d "/app/uploads" ]; then
        tar -czf "${uploads_backup}" -C /app/uploads . 2>/dev/null || true
        log_info "Backup dos uploads criado: ${uploads_backup}"
        
        # Upload para S3 se configurado
        if [ -n "${AWS_ACCESS_KEY_ID}" ]; then
            aws s3 cp "${uploads_backup}" "s3://${S3_BUCKET}/uploads/"
        fi
    else
        log_warn "Diretório de uploads não encontrado, pulando..."
    fi
}

# Função para backup das configurações
backup_config() {
    log_info "Iniciando backup das configurações..."
    
    local config_backup="${BACKUP_DIR}/config_${TIMESTAMP}.tar.gz"
    
    # Backup das variáveis de ambiente (sem secrets)
    tar -czf "${config_backup}" \
        docker-compose.yml \
        docker-compose.prod.yml \
        .env.example \
        2>/dev/null || true
    
    log_info "Backup das configurações criado: ${config_backup}"
}

# Função para limpar backups antigos
cleanup_old_backups() {
    log_info "Limpando backups com mais de ${RETENTION_DAYS} dias..."
    
    find ${BACKUP_DIR} -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    find ${BACKUP_DIR} -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete
    find ${BACKUP_DIR} -name "*.sha256" -mtime +${RETENTION_DAYS} -delete
    
    log_info "Limpeza concluída"
}

# Menu de opções
show_help() {
    echo "Uso: $0 [opção]"
    echo ""
    echo "Opções:"
    echo "  --all       Fazer backup completo (banco + uploads + config)"
    echo "  --db        Fazer backup apenas do banco de dados"
    echo "  --uploads   Fazer backup apenas dos uploads"
    echo "  --config    Fazer backup apenas das configurações"
    echo "  --cleanup   Limpar backups antigos"
    echo "  --help      Mostrar esta ajuda"
}

# Processar argumentos
case "${1:-}" in
    --all)
        backup_db
        backup_uploads
        backup_config
        cleanup_old_backups
        ;;
    --db)
        backup_db
        ;;
    --uploads)
        backup_uploads
        ;;
    --config)
        backup_config
        ;;
    --cleanup)
        cleanup_old_backups
        ;;
    --help|*)
        show_help
        ;;
esac

log_info "Script concluído com sucesso!"
