# Script para exportar projeto para Word
param(
    [string]$ProjectPath = ".",
    [string]$OutputFile = "Projeto_MeuExame.docx"
)

Write-Host "📦 GERANDO DOCUMENTO WORD DO PROJETO" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Word está instalado
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    Write-Host "✅ Microsoft Word encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Microsoft Word não encontrado. Usando HTML como alternativa." -ForegroundColor Yellow
    $useHTML = $true
}

# Coletar arquivos do projeto
Write-Host "📂 Coletando arquivos..." -ForegroundColor Yellow

$excludeFolders = @("node_modules", ".next", "dist", "build", ".git", "coverage", ".vscode", ".idea", "tmp", "temp")
$excludeExtensions = @(".log", ".lock", ".map", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".woff", ".woff2", ".ttf", ".eot")

$files = Get-ChildItem -Path $ProjectPath -Recurse -File | Where-Object {
    $exclude = $false
    $relativePath = $_.FullName.Substring((Resolve-Path $ProjectPath).Path.Length + 1)
    
    foreach ($folder in $excludeFolders) {
        if ($relativePath -match "^$folder\\" -or $relativePath -match "\\$folder\\") {
            $exclude = $true
            break
        }
    }
    
    if (-not $exclude) {
        foreach ($ext in $excludeExtensions) {
            if ($_.Extension -eq $ext) {
                $exclude = $true
                break
            }
        }
    }
    
    -not $exclude
}

$totalFiles = $files.Count
Write-Host "✅ Encontrados $totalFiles arquivos" -ForegroundColor Green
Write-Host ""

if ($totalFiles -eq 0) {
    Write-Host "❌ Nenhum arquivo encontrado!" -ForegroundColor Red
    exit
}

# Criar documento
if ($useHTML) {
    # Versão HTML
    $html = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Projeto MeuExame</title>
    <style>
        body { font-family: 'Courier New', monospace; margin: 20px; background: #f5f5f5; }
        .header { background: #1a237e; color: white; padding: 20px; border-radius: 8px; }
        .file { background: white; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
        .file-header { background: #263238; color: white; padding: 10px 15px; font-weight: bold; }
        .file-content { padding: 15px; background: #fafafa; overflow-x: auto; }
        .file-content pre { margin: 0; white-space: pre-wrap; font-size: 12px; }
        .line-num { color: #999; user-select: none; }
        .summary { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📁 PROJETO MEUEXAME - CÓDIGO COMPLETO</h1>
        <p>Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')</p>
        <p>Total de arquivos: $totalFiles</p>
    </div>
"@

    $counter = 1
    foreach ($file in $files | Sort-Object FullName) {
        $relativePath = $file.FullName.Substring((Resolve-Path $ProjectPath).Path.Length + 1)
        Write-Host "📄 Processando: $relativePath ($counter/$totalFiles)" -ForegroundColor Green
        
        $html += @"
    <div class="file">
        <div class="file-header"># $counter - $relativePath</div>
        <div class="file-content">
            <pre>
"@
        
        try {
            $lines = Get-Content $file.FullName -Encoding UTF8
            $lineNum = 1
            foreach ($line in $lines) {
                $escapedLine = $line -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;'
                $html += "   <span class='line-num'>$($lineNum.ToString().PadLeft(4))</span> | $escapedLine`n"
                $lineNum++
            }
        } catch {
            $html += "   ⚠️ Erro ao ler o arquivo`n"
        }
        
        $html += @"
            </pre>
        </div>
    </div>
"@
        $counter++
    }
    
    $html += @"
</body>
</html>
"@
    
    $html | Out-File -FilePath "Projeto_MeuExame.html" -Encoding utf8
    Write-Host "✅ Arquivo HTML gerado: Projeto_MeuExame.html" -ForegroundColor Green
    Write-Host "📂 Abra no Word: Arquivo > Abrir > Selecione o arquivo HTML" -ForegroundColor Yellow
    
} else {
    # Versão Word
    Write-Host "📝 Criando documento Word..." -ForegroundColor Cyan
    
    $doc = $word.Documents.Add()
    
    # Título
    $word.Selection.Font.Size = 24
    $word.Selection.Font.Bold = 1
    $word.Selection.TypeText("📁 PROJETO MEUEXAME - CÓDIGO COMPLETO")
    $word.Selection.TypeParagraph()
    $word.Selection.TypeParagraph()
    
    $word.Selection.Font.Size = 12
    $word.Selection.Font.Bold = 0
    $word.Selection.TypeText("Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')")
    $word.Selection.TypeParagraph()
    $word.Selection.TypeText("Total de arquivos: $totalFiles")
    $word.Selection.TypeParagraph()
    $word.Selection.TypeParagraph()
    
    # Sumário
    $word.Selection.Font.Size = 18
    $word.Selection.Font.Bold = 1
    $word.Selection.TypeText("📋 SUMÁRIO")
    $word.Selection.TypeParagraph()
    $word.Selection.TypeParagraph()
    
    $word.Selection.Font.Size = 12
    $word.Selection.Font.Bold = 0
    
    $counter = 1
    $groupedFiles = $files | Group-Object { $_.DirectoryName } | Sort-Object Name
    foreach ($group in $groupedFiles) {
        $folderName = Split-Path $group.Name -Leaf
        $word.Selection.TypeText("$counter. 📂 $folderName")
        $word.Selection.TypeParagraph()
        $counter++
    }
    
    $word.Selection.TypeParagraph()
    $word.Selection.TypeParagraph()
    $word.Selection.TypeText("═══════════════════════════════════════════════")
    $word.Selection.TypeParagraph()
    $word.Selection.TypeParagraph()
    
    # Exportar arquivos
    $counter = 1
    foreach ($file in $files | Sort-Object FullName) {
        $relativePath = $file.FullName.Substring((Resolve-Path $ProjectPath).Path.Length + 1)
        Write-Host "📄 Exportando: $relativePath ($counter/$totalFiles)" -ForegroundColor Green
        
        $word.Selection.Font.Size = 14
        $word.Selection.Font.Bold = 1
        $word.Selection.Font.Color = 16711680
        $word.Selection.TypeText("📄 ARQUIVO: $relativePath")
        $word.Selection.TypeParagraph()
        
        $word.Selection.Font.Size = 10
        $word.Selection.Font.Bold = 0
        $word.Selection.Font.Color = 0
        $word.Selection.TypeText("Linhas: $(Get-Content $file.FullName | Measure-Object -Line).Lines")
        $word.Selection.TypeParagraph()
        $word.Selection.TypeParagraph()
        
        try {
            $lines = Get-Content $file.FullName -Encoding UTF8
            $word.Selection.Font.Name = "Consolas"
            $word.Selection.Font.Size = 9
            
            $lineNum = 1
            foreach ($line in $lines) {
                $word.Selection.TypeText("$($lineNum.ToString().PadLeft(4)) | $line")
                $word.Selection.TypeParagraph()
                $lineNum++
            }
        } catch {
            $word.Selection.TypeText("⚠️ Erro ao ler o arquivo")
            $word.Selection.TypeParagraph()
        }
        
        $word.Selection.TypeParagraph()
        $word.Selection.TypeParagraph()
        $counter++
    }
    
    $doc.SaveAs([ref]"Projeto_MeuExame.docx", [ref]16)
    $doc.Close()
    $word.Quit()
    
    Write-Host "✅ Documento Word gerado: Projeto_MeuExame.docx" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Exportação concluída!" -ForegroundColor Green
Write-Host "📁 Arquivo salvo em: $(Get-Location)" -ForegroundColor Cyan