# 🚀 Guide Déploiement Simplifié - Render + Vercel

## ✅ **Statut Actuel**
- ✅ Code pushé sur GitHub
- ✅ render.yaml configuré  
- ✅ vercel.json configuré
- ⏳ Déploiement en cours...

## 🔧 **Étapes de Déploiement**

### 1. Backend sur Render
1. **Connecter GitHub à Render** : https://render.com
2. **Créer Web Service** : 
   - Sélectionner votre repository
   - Render détectera automatiquement `render.yaml`
   - Cliquer "Create Web Service"

3. **Variables manquantes à ajouter** :
   ```
   JWT_SECRET=[cliquer "Generate Value"]
   FRONTEND_URL=https://[VOTRE-APP].vercel.app
   ```

### 2. Frontend sur Vercel  
1. **Connecter GitHub à Vercel** : https://vercel.com
2. **Importer le projet** :
   - Sélectionner votre repository
   - Root Directory : `frontend-gestion-biblio`
   - Cliquer "Deploy"

3. **Ajouter la variable d'environnement** :
   ```
   VITE_API_BASE_URL=https://[VOTRE-BACKEND].onrender.com
   ```

### 3. Finalisation
1. **Mettre à jour les URLs croisées**
2. **Tester les endpoints**
3. **✅ Application en ligne !**

## 🆘 **Problèmes Courants**
- **Render MySQL** : Utiliser PostgreSQL (gratuit) ou service externe
- **Build Error** : Vérifier les dépendances dans package.json
- **CORS Error** : Vérifier FRONTEND_URL dans Render

## 📞 **URLs de Test**
- Backend : `https://[backend].onrender.com/api/health`  
- Frontend : `https://[frontend].vercel.app`

---
💡 **Tout est prêt pour le déploiement !**
