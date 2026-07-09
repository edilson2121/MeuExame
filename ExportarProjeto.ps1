# Script para exportar projeto para Word
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   EXPORTADOR DE PROJETO PARA WORD   " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Pastas a ignorar
$ignorarPastas = @("node_modules", ".next", "dist", "build", ".git", "coverage", ".vscode", ".idea", "tmp", "temp", "logs")
$ignorarExtensoes = @(".log", ".lock", ".map", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".mp3")

Write-Host "📂 Coletando arquivos..." -ForegroundColor Yellow

# Coletar arquivos
$arquivos = Get-ChildItem -Recurse -File | Where-Object {
    $excluir = $false
    $caminho = $_.FullName
    
    # Verificar se está em pastas ignoradas
    foreach ($pasta in $ignorarPastas) {
        if ($caminho -match "\\$pasta\\" -or $caminho -match "^$pasta\\") {
            $excluir = $true
            break
        }
    }
    
    # Verificar extensões ignoradas
    if (-not $excluir) {
        foreach ($ext in $ignorarExtensoes) {
            if ($_.Extension -eq $ext) {
                $excluir = $true
                break
            }
        }
    }
    
    -not $excluir
}

$total = $arquivos.Count
Write-Host "✅ Encontrados $total arquivos" -ForegroundColor Green
Write-Host ""

if ($total -eq 0) {
    Write-Host "❌ Nenhum arquivo encontrado!" -ForegroundColor Red
    exit
}

# Criar HTML
Write-Host "📄 Gerando arquivo HTML..." -ForegroundColor Yellow

$html = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Projeto MeuExame - Código Completo</title>
    <style>
        body { font-family: 'Courier New', monospace; margin: 20px; background: #f0f0f0; }
        .header { background: #1a237e; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .header h1 { margin: 0; }
        .summary { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .file { background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
        .file-header { background: #263238; color: white; padding: 10px 15px; font-weight: bold; cursor: pointer; }
        .file-header:hover { background: #37474f; }
        .file-content { padding: 15px; background: #fafafa; overflow-x: auto; max-height: 600px; overflow-y: auto; }
        .file-content pre { margin: 0; white-space: pre-wrap; font-size: 12px; }
        .line-num { color: #999; user-select: none; padding-right: 10px; }
        .toggle-btn { float: right; background: #4CAF50; color: white; border: none; padding: 2px 10px; border-radius: 4px; cursor: pointer; }
        .toggle-btn:hover { background: #45a049; }
    </style>
    <script>
        function toggleContent(id) {
            var content = document.getElementById('content_' + id);
            var btn = document.getElementById('btn_' + id);
            if (content.style.display === 'none') {
                content.style.display = 'block';
                btn.textContent = 'Ocultar';
            } else {
                content.style.display = 'none';
                btn.textContent = 'Mostrar';
            }
        }
    </script>
</head>
<body>
    <div class="header">
        <h1>📁 PROJETO MEUEXAME - CÓDIGO COMPLETO</h1>
        <p>📅 Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')</p>
        <p>📊 Total de arquivos: $total</p>
        <p>📂 Caminho: $(Get-Location)</p>
    </div>
    
    <div class="summary">
        <h2>📋 SUMÁRIO</h2>
        <ul>
"@

# Adicionar sumário
$contador = 1
$pastas = $arquivos | Group-Object { $_.DirectoryName } | Sort-Object Name
foreach ($pasta in $pastas) {
    $nomePasta = Split-Path $pasta.Name -Leaf
    $html += "            <li>$contador. 📂 $nomePasta</li>`n"
    $contador++
}

$html += @"
        </ul>
    </div>
    <hr>
"@

# Adicionar arquivos
$contador = 1
foreach ($arquivo in $arquivos | Sort-Object FullName) {
    $caminhoRelativo = $arquivo.FullName.Substring((Get-Location).Path.Length + 1)
    Write-Host "📄 Processando: $caminhoRelativo ($contador/$total)" -ForegroundColor Green
    
    $html += @"
    <div class="file">
        <div class="file-header" onclick="toggleContent('$contador')">
            📄 $caminhoRelativo
            <button class="toggle-btn" id="btn_$contador">Ocultar</button>
        </div>
        <div class="file-content" id="content_$contador">
            <pre>
"@
    
    try {
        $linhas = Get-Content $arquivo.FullName -Encoding UTF8 -ErrorAction SilentlyContinue
        if ($linhas) {
            $numLinha = 1
            foreach ($linha in $linhas) {
                $linhaEscapada = $linha -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;'
                $html += "   <span class='line-num'>$($numLinha.ToString().PadLeft(4))</span> | $linhaEscapada`n"
                $numLinha++
            }
        } else {
            $html += "   ⚠️ Arquivo vazio ou binário`n"
        }
    } catch {
        $html += "   ⚠️ Erro ao ler o arquivo`n"
    }
    
    $html += @"
            </pre>
        </div>
    </div>
"@
    $contador++
}

$html += @"
</body>
</html>
"@

# Salvar arquivo
$html | Out-File -FilePath "Projeto_MeuExame.html" -Encoding utf8

Write-Host ""
Write-Host "✅ EXPORTAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Arquivo gerado: Projeto_MeuExame.html" -ForegroundColor Yellow
Write-Host "📂 Local: $(Get-Location)\Projeto_MeuExame.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 COMO ABRIR NO WORD:" -ForegroundColor Yellow
Write-Host "1. Abra o Microsoft Word" -ForegroundColor White
Write-Host "2. Clique em Arquivo > Abrir" -ForegroundColor White
Write-Host "3. Selecione o arquivo Projeto_MeuExame.html" -ForegroundColor White
Write-Host "4. O Word vai converter automaticamente" -ForegroundColor White
Write-Host ""
Write-Host "📌 OU abra diretamente no navegador:" -ForegroundColor Yellow
Write-Host "   Clique duas vezes no arquivo .html" -ForegroundColor White