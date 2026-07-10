# =============================================
# SCRIPT PARA EXPORTAR PROJETO MEUEXAME PARA WORD
# =============================================
# Este script lê TODOS os arquivos do projeto
# e gera um documento Word com todo o código
# =============================================

param(
    [string]$ProjectPath = ".",
    [string]$OutputFile = "Projeto_MeuExame_Completo.docx"
)

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        📦 EXPORTANDO PROJETO MEUEXAME PARA WORD           ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar se o PowerShell está atualizado
$PSVersion = $PSVersionTable.PSVersion
Write-Host "📌 PowerShell Version: $PSVersion" -ForegroundColor Gray

# =============================================
# 1. VERIFICAR MICROSOFT WORD
# =============================================
Write-Host "🔍 Verificando Microsoft Word..." -ForegroundColor Yellow

$useHTML = $false
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    Write-Host "✅ Microsoft Word encontrado!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Microsoft Word não encontrado. Usando HTML como alternativa." -ForegroundColor Yellow
    $useHTML = $true
}

# =============================================
# 2. COLETAR TODOS OS ARQUIVOS
# =============================================
Write-Host ""
Write-Host "📂 Coletando arquivos do projeto..." -ForegroundColor Yellow
Write-Host "   Caminho: $ProjectPath" -ForegroundColor Gray

# Pastas para EXCLUIR
$excludeFolders = @(
    "node_modules", ".next", "dist", "build", 
    ".git", "coverage", ".vscode", ".idea", 
    "tmp", "temp", "logs", "cache", 
    ".vercel", ".turbo", "out", "public",
    ".next", "__pycache__", ".pytest_cache"
)

# Extensões para EXCLUIR
$excludeExtensions = @(
    ".log", ".lock", ".map", ".png", ".jpg", 
    ".jpeg", ".gif", ".ico", ".woff", ".woff2", 
    ".ttf", ".eot", ".svg", ".ico", ".webp",
    ".mp4", ".mp3", ".wav", ".avi", ".mkv",
    ".zip", ".rar", ".7z", ".tar", ".gz",
    ".exe", ".dll", ".so", ".dylib",
    ".db", ".sqlite", ".sqlite3"
)

# Extensões para INCLUIR (prioridade)
$includeExtensions = @(
    ".ts", ".tsx", ".js", ".jsx", ".json",
    ".css", ".scss", ".html", ".htm",
    ".md", ".txt", ".yml", ".yaml",
    ".prisma", ".env", ".dockerignore",
    ".gitignore", ".eslintrc", ".prettierrc"
)

$totalFiles = 0
$files = @()

Write-Host ""
Write-Host "⏳ Escaneando arquivos..." -ForegroundColor Cyan

# Coletar arquivos recursivamente
$allFiles = Get-ChildItem -Path $ProjectPath -Recurse -File -ErrorAction SilentlyContinue

foreach ($file in $allFiles) {
    $exclude = $false
    $relativePath = $file.FullName.Substring((Resolve-Path $ProjectPath).Path.Length + 1)
    
    # Verificar pastas excluídas
    foreach ($folder in $excludeFolders) {
        if ($relativePath -match "^$folder\\" -or $relativePath -match "\\$folder\\") {
            $exclude = $true
            break
        }
    }
    
    # Verificar extensões excluídas
    if (-not $exclude) {
        foreach ($ext in $excludeExtensions) {
            if ($file.Extension -eq $ext) {
                $exclude = $true
                break
            }
        }
    }
    
    # Verificar extensões incluídas (prioridade)
    if (-not $exclude) {
        $include = $false
        foreach ($ext in $includeExtensions) {
            if ($file.Extension -eq $ext) {
                $include = $true
                break
            }
        }
        # Se não estiver na lista de inclusão, mas for texto, incluir
        if (-not $include) {
            try {
                $content = Get-Content $file.FullName -TotalCount 1 -ErrorAction SilentlyContinue
                $include = $true
            } catch {
                $include = $false
            }
        }
        if ($include) {
            $files += $file
        } else {
            $exclude = $true
        }
    }
    
    if (-not $exclude) {
        $totalFiles++
    }
}

# Ordenar arquivos
$files = $files | Sort-Object FullName

Write-Host ""
Write-Host "✅ Encontrados $totalFiles arquivos para exportar!" -ForegroundColor Green
Write-Host ""

if ($totalFiles -eq 0) {
    Write-Host "❌ Nenhum arquivo encontrado!" -ForegroundColor Red
    Write-Host "   Verifique o caminho do projeto." -ForegroundColor Red
    exit
}

# =============================================
# 3. CRIAR SUMÁRIO
# =============================================
Write-Host "📋 Criando sumário..." -ForegroundColor Yellow

$summary = @"
╔═══════════════════════════════════════════════════════════╗
║                    PROJETO MEUEXAME                      ║
╠═══════════════════════════════════════════════════════════╣
║ Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')            ║
║ Total de Arquivos: $totalFiles                           ║
╚═══════════════════════════════════════════════════════════╝

📂 ESTRUTURA DO PROJETO:
"@

$groupedFiles = $files | Group-Object { $_.DirectoryName } | Sort-Object Name
$counter = 1
foreach ($group in $groupedFiles) {
    $folderName = Split-Path $group.Name -Leaf
    $summary += "   $counter. 📂 $folderName ($($group.Count) arquivos)`n"
    $counter++
}

$summary += "`n" + "═" * 60 + "`n`n"

# =============================================
# 4. GERAR DOCUMENTO
# =============================================
if ($useHTML) {
    # ========== VERSÃO HTML ==========
    Write-Host "📝 Gerando documento HTML..." -ForegroundColor Yellow
    
    $html = @"
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projeto MeuExame - Código Completo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Consolas', 'Courier New', monospace; 
            background: #1a1a2e; 
            color: #e0e0e0;
            padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        
        .header {
            background: linear-gradient(135deg, #1a237e, #0d47a1);
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .header h1 { font-size: 36px; color: #fff; }
        .header p { color: #90caf9; margin-top: 10px; font-size: 16px; }
        .header .stats { 
            display: flex; 
            justify-content: center; 
            gap: 40px; 
            margin-top: 20px;
            flex-wrap: wrap;
        }
        .header .stats div {
            background: rgba(255,255,255,0.1);
            padding: 10px 25px;
            border-radius: 8px;
        }
        .header .stats .num { font-size: 28px; font-weight: bold; color: #fff; }
        .header .stats .label { font-size: 12px; color: #90caf9; }
        
        .summary {
            background: #16213e;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 4px solid #0d47a1;
        }
        .summary h2 { color: #90caf9; margin-bottom: 15px; }
        .summary .folder { 
            padding: 4px 10px;
            margin: 3px 0;
            border-radius: 4px;
            background: #1a1a2e;
        }
        .summary .folder:hover { background: #2a2a4e; }
        
        .file-block {
            background: #16213e;
            margin: 20px 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 1px solid #2a2a4e;
        }
        .file-header {
            background: #0d47a1;
            padding: 12px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        .file-header:hover { background: #1565c0; }
        .file-header .filename { color: #fff; font-weight: bold; font-size: 14px; }
        .file-header .badge {
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            color: #90caf9;
        }
        .file-content {
            padding: 0;
            overflow-x: auto;
            max-height: 600px;
            overflow-y: auto;
        }
        .file-content pre {
            margin: 0;
            padding: 15px 20px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #e0e0e0;
            background: #0d0d1a;
        }
        .file-content pre .line-num {
            display: inline-block;
            width: 40px;
            color: #4a4a6a;
            user-select: none;
            text-align: right;
            padding-right: 15px;
        }
        .file-content pre .line-content { color: #e0e0e0; }
        
        .file-content pre .comment { color: #6a9955; }
        .file-content pre .string { color: #ce9178; }
        .file-content pre .keyword { color: #569cd6; }
        .file-content pre .function { color: #dcdcaa; }
        .file-content pre .number { color: #b5cea8; }
        .file-content pre .operator { color: #d4d4d4; }
        
        .footer {
            text-align: center;
            padding: 30px;
            color: #4a4a6a;
            font-size: 12px;
            border-top: 1px solid #2a2a4e;
            margin-top: 30px;
        }
        
        .toggle-content { display: none; }
        .toggle-content.active { display: block; }
        
        .toggle-btn {
            background: none;
            border: none;
            color: #90caf9;
            cursor: pointer;
            font-size: 18px;
            padding: 0 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📁 PROJETO MEUEXAME</h1>
            <p>Código completo do sistema - $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')</p>
            <div class="stats">
                <div>
                    <div class="num">$totalFiles</div>
                    <div class="label">Arquivos</div>
                </div>
                <div>
                    <div class="num">$($files | Where-Object { $_.Extension -eq '.ts' -or $_.Extension -eq '.tsx' } | Measure-Object | Select-Object -ExpandProperty Count)</div>
                    <div class="label">TypeScript</div>
                </div>
                <div>
                    <div class="num">$($files | Where-Object { $_.Extension -eq '.js' -or $_.Extension -eq '.jsx' } | Measure-Object | Select-Object -ExpandProperty Count)</div>
                    <div class="label">JavaScript</div>
                </div>
                <div>
                    <div class="num">$($files | Where-Object { $_.Extension -eq '.json' } | Measure-Object | Select-Object -ExpandProperty Count)</div>
                    <div class="label">JSON</div>
                </div>
            </div>
        </div>
        
        <div class="summary">
            <h2>📋 SUMÁRIO ($totalFiles arquivos)</h2>
"@

$counter = 1
foreach ($group in $groupedFiles) {
    $folderName = Split-Path $group.Name -Leaf
    $count = ($group.Group | Measure-Object).Count
    $html += "            <div class='folder'>$counter. 📂 $folderName ($count arquivos)</div>`n"
    $counter++
}

$html += @"
        </div>
        
        <!-- ARQUIVOS -->
"@

$counter = 1
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring((Resolve-Path $ProjectPath).Path.Length + 1)
    $lines = (Get-Content $file.FullName -ErrorAction SilentlyContinue | Measure-Object -Line).Lines
    $ext = $file.Extension
    $fileId = "file_$counter"
    
    Write-Host "📄 Processando: $relativePath ($counter/$totalFiles)" -ForegroundColor Green
    
    $html += @"
        
        <div class="file-block" id="$fileId">
            <div class="file-header" onclick="toggleFile('$fileId')">
                <span class="filename">📄 $relativePath</span>
                <div>
                    <span class="badge">$ext</span>
                    <span class="badge">$lines linhas</span>
                    <span class="toggle-btn">▼</span>
                </div>
            </div>
            <div class="file-content toggle-content active">
                <pre>
"@
    
    try {
        $content = Get-Content $file.FullName -Encoding UTF8 -ErrorAction SilentlyContinue
        $lineNum = 1
        foreach ($line in $content) {
            $escapedLine = $line -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;'
            $html += "   <span class='line-num'>$($lineNum.ToString().PadLeft(4))</span><span class='line-content'>$escapedLine</span>`n"
            $lineNum++
        }
    } catch {
        $html += "   ⚠️ Erro ao ler o arquivo: $($_.Exception.Message)`n"
    }
    
    $html += @"
                </pre>
            </div>
        </div>
"@
    $counter++
}

$html += @"
        
        <div class="footer">
            <p>📁 Projeto MeuExame - Código Completo</p>
            <p>Gerado em $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')</p>
            <p>Total: $totalFiles arquivos</p>
        </div>
    </div>
    
    <script>
        function toggleFile(id) {
            const el = document.getElementById(id);
            const content = el.querySelector('.file-content');
            const btn = el.querySelector('.toggle-btn');
            content.classList.toggle('active');
            btn.textContent = content.classList.contains('active') ? '▼' : '▶';
        }
    </script>
</body>
</html>
"@

    $html | Out-File -FilePath "Projeto_MeuExame_Completo.html" -Encoding utf8
    Write-Host ""
    Write-Host "✅ ARQUIVO HTML GERADO!" -ForegroundColor Green
    Write-Host "📁 Projeto_MeuExame_Completo.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📂 Para abrir no Word:" -ForegroundColor Yellow
    Write-Host "   1. Abra o Microsoft Word" -ForegroundColor White
    Write-Host "   2. Arquivo > Abrir" -ForegroundColor White
    Write-Host "   3. Selecione o arquivo HTML" -ForegroundColor White
    Write-Host "   4. Salve como .docx" -ForegroundColor White

} else {
    # ========== VERSÃO WORD ==========
    Write-Host "📝 Gerando documento Word..." -ForegroundColor Yellow
    
    $doc = $word.Documents.Add()
    
    # =====================================
    # CABEÇALHO
    # =====================================
    $word.Selection.Font.Size = 26
    $word.Selection.Font.Bold = 1
    $word.Selection.Font.Color = 16711680
    $word.Selection.TypeText("📁 PROJETO MEUEXAME")
    $word.Selection.TypeParagraph()
    
    $word.Selection.Font.Size = 14
    $word.Selection.Font.Bold = 0
    $word.Selection.Font.Color = 0
    $word.Selection.TypeText("Código completo do sistema")
    $word.Selection.TypeParagraph()
    $word.Selection.TypeParagraph()
    
    $word.Selection.Font.Size = 11
    $word.Selection.TypeText("Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')")
    $word.Selection.TypeParagraph()
    $word.Selection.TypeText("Total de arquivos: $totalFiles")
    $word.Selection.TypeParagraph()
    $word.Selection.TypeParagraph()
    
    # =====================================
    # SUMÁRIO
    # =====================================
    $word.Selection.Font.Size = 18
    $word.Selection.Font.Bold = 1
    $word.Selection.Font.Color = 16711680
    $word.Selection.TypeText("📋 SUMÁRIO")
    $word.Selection.TypeParagraph()
    $word.Selection.TypeParagraph()
    
    $word.Selection.Font.Size = 12
    $word.Selection.Font.Bold = 0
    $word.Selection.Font.Color = 0
    
    $counter = 1
    foreach ($group in $groupedFiles) {
        $folderName = Split-Path $group.Name -Leaf
        $count = ($group.Group | Measure-Object).Count
        $word.Selection.TypeText("   $counter. 📂 $folderName ($count arquivos)")
        $word.Selection.TypeParagraph()
        $counter++
    }
    
    $word.Selection.TypeParagraph()
    $word.Selection.TypeText("═" * 60)
    $word.Selection.TypeParagraph()
    $word.Selection.TypeParagraph()
    
    # =====================================
    # ARQUIVOS
    # =====================================
    $counter = 1
    foreach ($file in $files) {
        $relativePath = $file.FullName.Substring((Resolve-Path $ProjectPath).Path.Length + 1)
        $lines = (Get-Content $file.FullName -ErrorAction SilentlyContinue | Measure-Object -Line).Lines
        
        Write-Host "📄 Exportando: $relativePath ($counter/$totalFiles)" -ForegroundColor Green
        
        # Título do arquivo
        $word.Selection.Font.Size = 14
        $word.Selection.Font.Bold = 1
        $word.Selection.Font.Color = 16711680
        $word.Selection.TypeText("📄 ARQUIVO: $relativePath")
        $word.Selection.TypeParagraph()
        
        $word.Selection.Font.Size = 10
        $word.Selection.Font.Bold = 0
        $word.Selection.Font.Color = 0
        $word.Selection.TypeText("Linhas: $lines | Extensão: $($file.Extension)")
        $word.Selection.TypeParagraph()
        $word.Selection.TypeParagraph()
        
        # Conteúdo
        $word.Selection.Font.Name = "Consolas"
        $word.Selection.Font.Size = 8
        $word.Selection.Font.Bold = 0
        
        try {
            $content = Get-Content $file.FullName -Encoding UTF8 -ErrorAction SilentlyContinue
            $lineNum = 1
            foreach ($line in $content) {
                $word.Selection.TypeText("$($lineNum.ToString().PadLeft(4)) | $line")
                $word.Selection.TypeParagraph()
                $lineNum++
            }
        } catch {
            $word.Selection.TypeText("⚠️ Erro ao ler o arquivo: $($_.Exception.Message)")
            $word.Selection.TypeParagraph()
        }
        
        $word.Selection.TypeParagraph()
        $word.Selection.TypeParagraph()
        $counter++
    }
    
    # =====================================
    # SALVAR
    # =====================================
    $doc.SaveAs([ref]"Projeto_MeuExame_Completo.docx", [ref]16)
    $doc.Close()
    $word.Quit()
    
    Write-Host ""
    Write-Host "✅ DOCUMENTO WORD GERADO!" -ForegroundColor Green
    Write-Host "📁 Projeto_MeuExame_Completo.docx" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ EXPORTAÇÃO CONCLUÍDA!                     ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Resumo:" -ForegroundColor Cyan
Write-Host "   📁 Total de arquivos: $totalFiles" -ForegroundColor White
Write-Host "   📂 Pastas: $($groupedFiles.Count)" -ForegroundColor White
Write-Host "   📄 Arquivo gerado: $(Get-Location)\Projeto_MeuExame_Completo.$(if($useHTML){'html'}else{'docx'})" -ForegroundColor Cyan
Write-Host ""
Write-Host "📂 Abrir pasta:" -ForegroundColor Yellow
Write-Host "   explorer ." -ForegroundColor White
Write-Host ""