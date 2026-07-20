# ============================================================
# MEUEXAME - SCRIPT DE INICIALIZAÇÃO
# ============================================================

Write-Host "🚀 INICIANDO MEUEXAME..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
 = Get-Command docker -ErrorAction SilentlyContinue
if (-not ) {
    Write-Host "⚠️ Docker não encontrado. Instalando dependências localmente..." -ForegroundColor Yellow
    
    # Backend
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    npx prisma generate
    npx prisma db push
    npx prisma db seed
    
    # Frontend
    Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
    Set-Location ../frontend
    npm install
    
    Write-Host ""
    Write-Host "✅ Instalação concluída!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para iniciar o backend:"
    Write-Host "  cd backend && npm run start:dev"
    Write-Host ""
    Write-Host "Para iniciar o frontend:"
    Write-Host "  cd frontend && npm run dev"
    Write-Host ""
    Write-Host "Acesse: http://localhost:3000"
    Write-Host "Admin: admin@meuexame.com / admin123"
    
} else {
    Write-Host "🐳 Docker encontrado. Usando Docker Compose..." -ForegroundColor Yellow
    
    # Run docker-compose
    docker-compose up -d
    
    Write-Host ""
    Write-Host "✅ Serviços iniciados!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Backend: http://localhost:3001"
    Write-Host "Frontend: http://localhost:3000"
    Write-Host "Admin: admin@meuexame.com / admin123"
    Write-Host ""
    Write-Host "Para ver logs: docker-compose logs -f"
    Write-Host "Para parar: docker-compose down"
}
