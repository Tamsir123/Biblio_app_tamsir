#!/bin/bash

# 🚀 Script de Vérification Pré-Déploiement
# Usage: ./check-deployment-ready.sh

echo "🔍 Vérification de l'état du projet pour déploiement..."
echo "=================================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de vérification
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 existe"
        return 0
    else
        echo -e "${RED}❌${NC} $1 manquant"
        return 1
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} Dossier $1 existe"
        return 0
    else
        echo -e "${RED}❌${NC} Dossier $1 manquant"
        return 1
    fi
}

errors=0

echo -e "\n📁 Structure des fichiers:"
echo "------------------------"
check_file "render.yaml" || ((errors++))
check_file "vercel.json" || ((errors++))
check_file "backend-gestion-biblio/package.json" || ((errors++))
check_file "frontend-gestion-biblio/package.json" || ((errors++))
check_file "backend-gestion-biblio/.env" || ((errors++))

echo -e "\n📂 Dossiers requis:"
echo "------------------"
check_directory "backend-gestion-biblio" || ((errors++))
check_directory "frontend-gestion-biblio" || ((errors++))

echo -e "\n🔧 Configuration Backend:"
echo "-------------------------"
if [ -f "backend-gestion-biblio/package.json" ]; then
    if grep -q "\"start\":" backend-gestion-biblio/package.json; then
        echo -e "${GREEN}✅${NC} Script 'start' défini"
    else
        echo -e "${RED}❌${NC} Script 'start' manquant dans package.json"
        ((errors++))
    fi
fi

echo -e "\n🎨 Configuration Frontend:"
echo "--------------------------"
if [ -f "frontend-gestion-biblio/package.json" ]; then
    if grep -q "\"build\":" frontend-gestion-biblio/package.json; then
        echo -e "${GREEN}✅${NC} Script 'build' défini"
    else
        echo -e "${RED}❌${NC} Script 'build' manquant dans package.json"
        ((errors++))
    fi
fi

echo -e "\n🔑 Variables d'environnement:"
echo "-----------------------------"
if [ -f "backend-gestion-biblio/.env" ]; then
    if grep -q "JWT_SECRET" backend-gestion-biblio/.env; then
        echo -e "${GREEN}✅${NC} JWT_SECRET présent"
    else
        echo -e "${YELLOW}⚠️${NC} JWT_SECRET manquant (sera généré par Render)"
    fi
    
    if grep -q "EMAIL_USER" backend-gestion-biblio/.env; then
        echo -e "${GREEN}✅${NC} Configuration email présente"
    else
        echo -e "${RED}❌${NC} Configuration email manquante"
        ((errors++))
    fi
fi

echo -e "\n📋 Fichiers de déploiement:"
echo "---------------------------"
check_file "DEPLOIEMENT-RAPIDE.md" || echo -e "${YELLOW}⚠️${NC} Guide de déploiement disponible"
check_file "TROUBLESHOOTING.md" || echo -e "${YELLOW}⚠️${NC} Guide de troubleshooting disponible"

echo -e "\n🌐 État Git:"
echo "------------"
if [ -d ".git" ]; then
    echo -e "${GREEN}✅${NC} Repository Git initialisé"
    
    # Vérifier s'il y a des commits
    if git log --oneline -1 &>/dev/null; then
        echo -e "${GREEN}✅${NC} Commits présents"
        
        # Vérifier remote origin
        if git remote get-url origin &>/dev/null; then
            echo -e "${GREEN}✅${NC} Remote origin configuré:"
            echo "    $(git remote get-url origin)"
        else
            echo -e "${RED}❌${NC} Remote origin non configuré"
            ((errors++))
        fi
    else
        echo -e "${RED}❌${NC} Aucun commit trouvé"
        ((errors++))
    fi
else
    echo -e "${RED}❌${NC} Repository Git non initialisé"
    ((errors++))
fi

echo -e "\n📊 RÉSUMÉ:"
echo "=========="
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🎉 PRÊT POUR DÉPLOIEMENT !${NC}"
    echo -e "${GREEN}✅ Tous les fichiers requis sont présents${NC}"
    echo -e "\n🚀 Prochaines étapes:"
    echo "1. Connecter le repository à Render"
    echo "2. Connecter le repository à Vercel" 
    echo "3. Configurer les variables d'environnement"
    echo "4. Mettre à jour les URLs croisées"
else
    echo -e "${RED}❌ $errors erreur(s) trouvée(s)${NC}"
    echo -e "${YELLOW}⚠️  Corriger les erreurs avant déploiement${NC}"
fi

echo -e "\n📖 Documentation:"
echo "- DEPLOIEMENT-RAPIDE.md : Guide étape par étape"  
echo "- TROUBLESHOOTING.md : Solutions aux problèmes"
echo "- render-env-variables-updated.txt : Variables Render"
echo "- vercel-env-variables-updated.txt : Variables Vercel"
