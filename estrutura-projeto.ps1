# ============================================
# SCRIPT: Gerar Estrutura do Projeto
# Projeto: MeuExame - VERSAO SEM CARACTERES ESPECIAIS
# ============================================

$ProjectPath = "C:\Users\Administrator\Desktop\meuexame\MeuExame"
$OutputFile = "$ProjectPath\estrutura-projeto.txt"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GERANDO ESTRUTURA DO PROJETO MEUEXAME" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Get-DirectoryTree {
    param([string]$Path, [string]$Indent = "", [int]$MaxDepth = 10)
    
    $output = ""
    $items = Get-ChildItem -Path $Path -Force | Sort-Object { $_.PSIsContainer } -Descending
    
    $excludeFolders = @("node_modules", ".git", ".next", "dist", "build", "coverage", ".vscode", "temp", "tmp", "logs")
    
    $filteredItems = $items | Where-Object {
        if ($_.PSIsContainer) {
            return $excludeFolders -notcontains $_.Name
        }
        return $true
    }
    
    $count = $filteredItems.Count
    $i = 0
    
    foreach ($item in $filteredItems) {
        $i++
        $isLast = ($i -eq $count)
        
        if ($isLast) {
            $prefix = "+-- "
            $prefixIndent = "    "
        } else {
            $prefix = "|-- "
            $prefixIndent = "|   "
        }
        
        if ($item.PSIsContainer) {
            $output += "$Indent$prefix[DIR] $($item.Name)/`n"
            
            if ($MaxDepth -gt 0) {
                $output += Get-DirectoryTree -Path $item.FullName -Indent "$Indent$prefixIndent" -MaxDepth ($MaxDepth - 1)
            }
        } else {
            $size = if ($item.Length -gt 1MB) {
                "{0:N2} MB" -f ($item.Length / 1MB)
            } elseif ($item.Length -gt 1KB) {
                "{0:N2} KB" -f ($item.Length / 1KB)
            } else {
                "{0} B" -f $item.Length
            }
            
            $output += "$Indent$prefix[FILE] $($item.Name) ($size)`n"
        }
    }
    
    return $output
}

function Get-FileStats {
    param([string]$Path)
    
    $stats = @{}
    $totalFiles = 0
    $totalSize = 0
    
    $excludeFolders = @("node_modules", ".git", ".next", "dist", "build", "coverage", ".vscode")
    
    $files = Get-ChildItem -Path $Path -Recurse -File -Force | Where-Object {
        $inExcluded = $false
        foreach ($folder in $excludeFolders) {
            if ($_.FullName -match "\\$folder\\") {
                $inExcluded = $true
                break
            }
        }
        return -not $inExcluded
    }
    
    foreach ($file in $files) {
        $ext = if ($file.Extension) { $file.Extension.Substring(1).ToLower() } else { "sem_extensao" }
        if (-not $stats.ContainsKey($ext)) {
            $stats[$ext] = 0
        }
        $stats[$ext]++
        $totalFiles++
        $totalSize += $file.Length
    }
    
    return @{
        Stats = $stats
        TotalFiles = $totalFiles
        TotalSize = $totalSize
    }
}

Write-Host "Coletando estrutura do projeto..." -ForegroundColor Yellow
Write-Host ""

$structure = Get-DirectoryTree -Path $ProjectPath -MaxDepth 10
$fileStats = Get-FileStats -Path $ProjectPath

$content = @"
========================================
MEUEXAME - ESTRUTURA DO PROJETO
========================================

Data: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
Projeto: MeuExame
Caminho: $ProjectPath

========================================
ESTATISTICAS
========================================

Total de Arquivos: $($fileStats.TotalFiles)
Tamanho Total: $("{0:N2} MB" -f ($fileStats.TotalSize / 1MB))

Distribuicao por tipo:
"@

$fileStats.Stats.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    $ext = if ($_.Key) { $_.Key } else { "sem_extensao" }
    $content += "  .$ext : $($_.Value) arquivo(s)`n"
}

$content += @"

========================================
ESTRUTURA DE DIRETORIOS
========================================

"@

$content += $structure

$content | Out-File -FilePath $OutputFile -Encoding UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PROCESSO CONCLUIDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Arquivo gerado: $OutputFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "Resumo:" -ForegroundColor Yellow
Write-Host "  Total de Arquivos: $($fileStats.TotalFiles)" -ForegroundColor Cyan
Write-Host "  Tamanho Total: $("{0:N2} MB" -f ($fileStats.TotalSize / 1MB))" -ForegroundColor Cyan
Write-Host ""
Write-Host "Principais extensoes:" -ForegroundColor Yellow
$fileStats.Stats.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5 | ForEach-Object {
    $ext = if ($_.Key) { $_.Key } else { "sem_extensao" }
    Write-Host "  .$ext : $($_.Value) arquivo(s)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "Para visualizar a estrutura, execute:" -ForegroundColor Yellow
Write-Host "  Get-Content '$OutputFile'" -ForegroundColor Gray
