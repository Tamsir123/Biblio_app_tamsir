#!/bin/bash

# Script de déploiement Railway pour l'application Biblio
echo "🚀 Préparation du déploiement Railway"
echo "===================================="

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo "📝 Initialisation du repository Git..."
    git init
    git branch -M main
fi

# Créer .gitignore s'il n'existe pas
if [ ! -f ".gitignore" ]; then
    echo "📝 Création du fichier .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
build/
*/dist/
*/build/

# Environment files
.env
.env.local
.env.production
.env.development

# Logs
logs/
*.log
npm-debug.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Docker
.dockerignore

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Uploads (pour le développement local)
uploads/
backend-gestion-biblio/uploads/

# Ngrok
ngrok.yml
*.ngrok
EOF
fi

echo "✅ Repository Git préparé"

# Ajouter tous les fichiers
echo "📁 Ajout des fichiers au repository..."
git add .

# Commit initial
echo "💾 Création du commit initial..."
git status
echo ""
read -p "Voulez-vous créer le commit initial ? (y/N) : " confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    git commit -m "Initial commit: Application de gestion de bibliothèque pour Railway"
    echo "✅ Commit créé avec succès"
else
    echo "⏸️  Commit annulé. Vous pouvez le faire manuellement avec :"
    echo "   git commit -m 'Votre message'"
fi

echo ""
echo "📋 Prochaines étapes :"
echo "1. Créer un repository sur GitHub"
echo "2. Lier le repository :"
echo "   git remote add origin https://github.com/VOTRE_USERNAME/biblio-app.git"
echo "   git push -u origin main"
echo ""
echo "3. Aller sur https://railway.app"
echo "4. Se connecter avec GitHub"
echo "5. Cliquer sur 'New Project' > 'Deploy from GitHub repo'"
echo "6. Sélectionner votre repository 'biblio-app'"
echo ""
echo "🌐 Railway détectera automatiquement :"
echo "   - Frontend React (port 3000)"
echo "   - Backend Node.js (port 5000)"
echo "   - Base de données MySQL"
echo ""
echo "🎉 Votre application sera accessible 24h/24 !"

# Vérifier si Railway CLI est installé
if command -v railway &> /dev/null; then
    echo ""
    echo "🚂 Railway CLI détecté !"
    read -p "Voulez-vous déployer maintenant avec Railway CLI ? (y/N) : " deploy_now
    
    if [[ $deploy_now =~ ^[Yy]$ ]]; then
        echo "🚀 Déploiement avec Railway CLI..."
        railway login
        railway init
        railway up
    fi
else
    echo ""
    echo "💡 Pour installer Railway CLI (optionnel) :"
    echo "   npm install -g @railway/cli"
fi
