# Публикация сайта на GitHub Pages
# Запуск: правый клик -> "Выполнить с PowerShell" или: powershell -File publish-github.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\Git\bin;C:\Program Files\GitHub CLI;" + $env:Path

function Find-Git {
  $candidates = @(
    "git",
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files\Git\cmd\git.exe"
  )
  foreach ($c in $candidates) {
    if (Get-Command $c -ErrorAction SilentlyContinue) { return (Get-Command $c).Source }
  }
  return $null
}

$git = Find-Git
$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) { $gh = "gh" }
if (-not $git) {
  Write-Host ""
  Write-Host "Git не найден. Установите один из вариантов:" -ForegroundColor Yellow
  Write-Host "  1. GitHub Desktop: https://desktop.github.com/" -ForegroundColor Cyan
  Write-Host "  2. Git for Windows: https://git-scm.com/download/win" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "После установки запустите этот скрипт снова." -ForegroundColor Yellow
  exit 1
}

Set-Location $root

if (-not (Test-Path ".git")) {
  & $git init
  & $git branch -M main
}

& $git add .
& $git status --short

$changes = & $git status --porcelain
if ($changes) {
  & $git commit -m "Deploy landing site to GitHub Pages"
} else {
  Write-Host "Нет новых изменений для коммита." -ForegroundColor Green
}

if (-not (& $git remote get-url origin 2>$null)) {
  Write-Host ""
  Write-Host "Создаём репозиторий на GitHub..." -ForegroundColor Cyan
  $repoName = Read-Host "Имя репозитория (например vtoroy-sloy)"
  if (-not $repoName) { $repoName = "vtoroy-sloy" }
  & $gh auth login
  & $gh repo create $repoName --public --source=. --remote=origin --push
} else {
  Write-Host ""
  Write-Host "Отправка на GitHub..." -ForegroundColor Cyan
  & $git push -u origin main
}

Write-Host ""
Write-Host "Готово! Включите GitHub Pages:" -ForegroundColor Green
Write-Host "  GitHub -> Settings -> Pages -> Source: GitHub Actions" -ForegroundColor Cyan
Write-Host "  Сайт появится по адресу: https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПО/" -ForegroundColor Cyan
