#!/bin/bash

# Script pour exposer l'application via ngrok
echo "🌐 Exposition de l'application via ngrok"
echo "========================================"

# Vérifier si ngrok est installé
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok n'est pas installé"
    echo "📥 Installation de ngrok..."
    
    # Télécharger ngrok
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
    sudo apt update && sudo apt install ngrok
    
    echo "✅ ngrok installé"
    echo "ℹ️  Vous devez créer un compte sur https://ngrok.com et obtenir un authtoken"
    echo "📝 Puis exécuter : ngrok config add-authtoken VOTRE_TOKEN"
    echo ""
    read -p "Avez-vous configuré votre authtoken ? (y/N) : " configured
    
    if [[ ! $configured =~ ^[Yy]$ ]]; then
        echo "❌ Veuillez configurer ngrok d'abord"
        exit 1
    fi
fi

echo "🚀 Démarrage des tunnels ngrok..."

# Créer un fichier de configuration ngrok
cat > ngrok.yml << EOF
version: "3"
agent:
  authtoken: 2zPO40SgQegGxtO6W3o1zkynelR_3Tb3r2CtUZ5uGpmwrqxeM
tunnels:
  frontend:
    addr: 3000
    proto: http
  backend:
    addr: 5000
    proto: http
EOF

echo "📝 Configuration ngrok créée"
echo "🌐 Démarrage des tunnels..."

# Démarrer ngrok avec les deux tunnels
ngrok start --all --config=./ngrok.yml

echo "✅ Tunnels ngrok démarrés !"
echo "🌐 Vos URLs publiques sont affichées ci-dessus"
