# SecureTools Deployment Assistant for Windows PowerShell

# Ensure we run in the project directory
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectDir
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "    SecureTools GitHub & Hosting Deployment Assistant" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Target Directory: $ProjectDir`n" -ForegroundColor Gray

# 1. Check if Git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Git is not installed or not in your system PATH." -ForegroundColor Red
    Write-Host "Please download and install Git from: https://git-scm.com/" -ForegroundColor Yellow
    Write-Host "After installing, restart PowerShell and run this script again." -ForegroundColor Yellow
    Read-Host "`nPress Enter to exit"
    Exit
}

# 2. Check if already initialized as git repository
if (!(Test-Path ".git")) {
    Write-Host "[*] Initializing Git repository..." -ForegroundColor Cyan
    git init
    # Set default branch to main
    git config --local init.defaultBranch main
} else {
    Write-Host "[*] Git repository already initialized." -ForegroundColor Gray
}

# 3. Commit files
Write-Host "[*] Staging files..." -ForegroundColor Cyan
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "[*] Committing files..." -ForegroundColor Cyan
    git commit -m "Initial commit of SecureTools platform with advanced motion design layer"
    Write-Host "[+] Files committed successfully!" -ForegroundColor Green
} else {
    Write-Host "[+] Everything is already up-to-date and committed." -ForegroundColor Green
}

# 4. Git Push Configuration
Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "GitHub Push Steps:" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "1. Go to https://github.com/new and create a new repository."
Write-Host "   - Name it something like 'secure-tools'."
Write-Host "   - Leave it PUBLIC if you want free GitHub Pages hosting."
Write-Host "   - Do NOT check 'Initialize this repository with a README'."
Write-Host "2. Copy the HTTPS repository URL (ends with .git)."

$remoteUrl = Read-Host "`nEnter your GitHub repository URL (or press Enter to skip linking)"

if ($remoteUrl) {
    # Check if origin remote already exists
    $existingRemote = git remote | Select-String "origin"
    if ($existingRemote) {
        Write-Host "[*] Updating existing remote URL to: $remoteUrl" -ForegroundColor Cyan
        git remote set-url origin $remoteUrl
    } else {
        Write-Host "[*] Adding remote origin: $remoteUrl" -ForegroundColor Cyan
        git remote add origin $remoteUrl
    }

    Write-Host "[*] Renaming branch to main..." -ForegroundColor Cyan
    git branch -M main

    Write-Host "[*] Pushing code to GitHub..." -ForegroundColor Cyan
    Write-Host "Please enter your credentials if prompted by the Windows Git Credential Manager." -ForegroundColor Yellow
    git push -u origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[+] Successfully pushed code to GitHub!" -ForegroundColor Green
        
        Write-Host "`n==========================================================" -ForegroundColor Cyan
        Write-Host "How to Deploy to GitHub Pages (Free Hosting):" -ForegroundColor Cyan
        Write-Host "==========================================================" -ForegroundColor Cyan
        Write-Host "1. Go to your repository page on GitHub.com"
        Write-Host "2. Click on 'Settings' (top-right tab of the repository menu)."
        Write-Host "3. Scroll down the left sidebar and click on 'Pages'."
        Write-Host "4. Under 'Build and deployment' -> 'Source':"
        Write-Host "   - Select 'Deploy from a branch'."
        Write-Host "5. Under 'Branch':"
        Write-Host "   - Click the drop-down (currently 'None') and select 'main'."
        Write-Host "   - Click 'Save'."
        Write-Host "6. Wait 1-2 minutes. GitHub will deploy your site!"
        Write-Host "7. Refresh the Page settings. Your live URL will appear at the top."
        Write-Host "   Example: https://your-username.github.io/secure-tools/"
    } else {
        Write-Host "[!] Push failed. Please check your internet connection or GitHub permissions." -ForegroundColor Red
    }
} else {
    Write-Host "[*] Skipped repository linking. You can do this manually later using:" -ForegroundColor Yellow
    Write-Host "    git remote add origin <your-repository-url>" -ForegroundColor Gray
    Write-Host "    git push -u origin main" -ForegroundColor Gray
}

Read-Host "`nDeployment process finished. Press Enter to exit"
