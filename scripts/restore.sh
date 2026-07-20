#!/bin/bash
# MeuExame - Script de Restore
# Uso: ./restore.sh <tipo> <arquivo>
# Tipos: db, uploads, all

set -e

# Configurações
BACKUP_DIR="/backups"
DB_NAME="${DB_NAME:-meuexame}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
S3_BUCKET="${S3_BUCKET:-meuexame-backups}"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Verificar argumentos
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Uso: $0 <tipo> <arquivo>"
    echo ""
    echo "Tipos:"
    echo "  db       Restaurar banco de dados"
    echo "  uploads  Restaurar uploads"
    echo "  list     Listar backups disponíveis"
    echo ""
    echo "Exemplo:"
    echo "  $0 db db_20240101_120000.sql.gz"
    exit 1
fi

TYPE=$1
FILE=$2

# Função para restaurar banco de dados
restore_db() {
    local backup_file="$1"
    
    if [ ! -f "${BACKUP_DIR}/${backup_file}" ]; then
        # Tentar baixar do S3
        if [ -n "${AWS_ACCESS_KEY_ID}" ]; then
            log_info "Baixando do S3..."
            aws s3 cp "s3://${S3_BUCKET}/db/${backup_file}" "${BACKUP_DIR}/"
        else
            log_error "Arquivo não encontrado: ${backup_file}"
            exit 1
        fi
    fi
    
    # Verificar checksum
    if [ -f "${BACKUP_DIR}/${backup_file}.sha256" ]; then
        log_info "Verificando integridade..."
        cd "${BACKUP_DIR}"
        if ! sha256sum -c "${backup_file}.sha256" 2>/dev/null; then
            log_error "Checksum inválido! Backup pode estar corrompido."
            read -p "Deseja continuar mesmo assim? (s/n): " confirm
            [ "$confirm" != "s" ] && exit 1
        fi
        cd - > /dev/null
    fi
    
    log_warn "Esta ação substituirá todos os dados atuais!"
    read -p "Tem certeza que deseja continuar? (s/n): " confirm
    [ "$confirm" != "s" ] && exit 0
    
    log_info "Restaurando banco de dados..."
    
    # Criar backup do estado atual antes de restaurar
    local pre_restore="${BACKUP_DIR}/pre_restore_$(date +%Y%m%d_%H%M%S).sql.gz"
    log_info "Criando backup de segurança: ${pre_restore}"
    pg_dump -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" | gzip > "${pre_restore}" || true
    
    # Parar aplicação
    log_info "Parando serviços..."
    if command -v docker-compose &> /dev/null; then
        docker-compose stop backend || true
    fi
    
    # Dropar e recriar banco
    log_info "Recriando banco de dados..."
    PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -c "DROP DATABASE IF EXISTS ${DB_NAME};"
    PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -c "CREATE DATABASE ${DB_NAME};"
    
    # Restaurar
    log_info "Restaurando dados..."
    gunzip -c "${BACKUP_DIR}/${backup_file}" | PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}"
    
    log_info "Banco de dados restaurado com sucesso!"
}

# Função para restaurar uploads
restore_uploads() {
    local backup_file="$1"
    
    if [ ! -f "${BACKUP_DIR}/${backup_file}" ]; then
        if [ -n "${AWS_ACCESS_KEY_ID}" ]; then
            log_info "Baixando do S3..."
            aws s3 cp "s3://${S3_BUCKET}/uploads/${backup_file}" "${BACKUP_DIR}/"
        else
            log_error "Arquivo não encontrado: ${backup_file}"
            exit 1
        fi
    fi
    
    log_warn "Esta ação substituirá todos os uploads atuais!"
    read -p "Tem certeza que deseja continuar? (s/n): " confirm
    [ "$confirm" != "s" ] && exit 0
    
    log_info "Restaurando uploads..."
    
    # Backup do estado atual
    if [ -d "/app/uploads" ]; then
        tar -czf "${BACKUP_DIR}/pre_uploads_$(date +%Y%m%d_%H%M%S).tar.gz" -C /app/uploads . 2>/dev/null || true
    fi
    
    mkdir -p /app/uploads
    tar -xzf "${BACKUP_DIR}/${backup_file}" -C /app/uploads
    
    log_info "Uploads restaurados com sucesso!"
}

# Função para listar backups
list_backups() {
    echo ""
    echo "=== Backups de Banco de Dados ==="
    ls -lh ${BACKUP_DIR}/db_*.sql.gz 2>/dev/null || echo "Nenhum backup encontrado"
    
    echo ""
    echo "=== Backups de Uploads ==="
    ls -lh ${BACKUP_DIR}/uploads_*.tar.gz 2>/dev/null || echo "Nenhum backup encontrado"
    
    echo ""
    echo "=== Backups de Configuração ==="
    ls -lh ${BACKUP_DIR}/config_*.tar.gz 2>/dev/null || echo "Nenhum backup encontrado"
}

# Processar comando
case "$TYPE" in
    db)
        restore_db "$FILE"
        ;;
    uploads)
        restore_uploads "$FILE"
        ;;
    list)
        list_backups
        ;;
    *)
        log_error "Tipo inválido: $TYPE"
        echo "Use --help para ver as opções"
        exit 1
        ;;
esac

log_info "Restore concluído!"
