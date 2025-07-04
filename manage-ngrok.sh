#!/bin/bash

# Script de gestion ngrok pour l'application Biblio
echo "🔧 Gestion des tunnels ngrok"
echo "============================"

# Fonctions utiles
show_status() {
    echo "📊 Statut des tunnels :"
    if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
        echo "✅ Interface ngrok accessible sur http://localhost:4040"
        curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | "  \(.name): \(.public_url)"' 2>/dev/null || echo "  (jq non disponible pour formatage JSON)"
    else
        echo "❌ Aucun tunnel ngrok actif"
    fi
}

show_urls() {
    echo ""
    echo "🌐 URLs publiques actuelles :"
    if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
        FRONTEND_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.name=="frontend") | .public_url')
        BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.name=="backend") | .public_url')
        
        if [ "$FRONTEND_URL" != "null" ] && [ ! -z "$FRONTEND_URL" ]; then
            echo "📱 Frontend : $FRONTEND_URL"
        fi
        if [ "$BACKEND_URL" != "null" ] && [ ! -z "$BACKEND_URL" ]; then
            echo "🔧 Backend  : $BACKEND_URL"
        fi
        
        if [ "$FRONTEND_URL" != "null" ] && [ "$BACKEND_URL" != "null" ] && [ ! -z "$FRONTEND_URL" ] && [ ! -z "$BACKEND_URL" ]; then
            echo ""
            echo "📋 Instructions pour partage :"
            echo "   Donnez cette URL à votre professeur : $FRONTEND_URL"
        fi
    else
        echo "❌ Aucun tunnel ngrok actif"
    fi
}

stop_tunnels() {
    echo "🛑 Arrêt des tunnels ngrok..."
    pkill -f ngrok
    sleep 2
    echo "✅ Tunnels arrêtés"
}

start_tunnels() {
    echo "🚀 Démarrage des tunnels ngrok..."
    if [ -f "./expose-ngrok.sh" ]; then
        ./expose-ngrok.sh &
        echo "⏳ Attente de la configuration des tunnels..."
        sleep 5
        show_urls
    else
        echo "❌ Script expose-ngrok.sh introuvable"
    fi
}

# Menu principal
case "$1" in
    "status"|"")
        show_status
        show_urls
        ;;
    "start")
        start_tunnels
        ;;
    "stop")
        stop_tunnels
        ;;
    "restart")
        stop_tunnels
        sleep 2
        start_tunnels
        ;;
    "urls")
        show_urls
        ;;
    *)
        echo "Usage: $0 [status|start|stop|restart|urls]"
        echo ""
        echo "Commandes :"
        echo "  status   - Affiche l'état des tunnels (défaut)"
        echo "  start    - Démarre les tunnels ngrok"
        echo "  stop     - Arrête tous les tunnels"
        echo "  restart  - Redémarre les tunnels"
        echo "  urls     - Affiche uniquement les URLs"
        ;;
esac
