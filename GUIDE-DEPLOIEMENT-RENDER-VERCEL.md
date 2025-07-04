# 🚀 Guide de Déploiement : Render (Backend) + Vercel (Frontend)

## 📋 **Prérequis**
✅ Code pushé sur GitHub
✅ Fichiers de configuration créés (render.yaml, vercel.json)

## 1. 🔧 **Déploiement Backend sur Render**

### Étape 1 : Connexion à Render
1. Aller sur https://render.com
2. Se connecter avec GitHub
3. Autoriser l'accès à vos repositories

### Étape 2 : Créer le service Backend
1. Cliquer sur "New +" → "Web Service"
2. Connecter votre repository GitHub
3. Sélectionner le repository de votre projet
4. Configuration :
   - **Name** : `biblio-backend`
   - **Region** : `Frankfurt (EU Central)`
   - **Branch** : `main`
   - **Root Directory** : laisser vide
   - **Runtime** : `Node`
   - **Build Command** : `cd backend-gestion-biblio && npm install`
   - **Start Command** : `cd backend-gestion-biblio && npm start`

### Étape 3 : Créer la base de données MySQL
1. Dans le dashboard Render, cliquer "New +" → "PostgreSQL" (Render ne propose que PostgreSQL gratuit)
2. **Alternative** : Utiliser une base externe comme PlanetScale ou Railway

### Étape 4 : Configurer les variables d'environnement
Dans les settings du service backend, ajouter :
```
NODE_ENV=production
PORT=5000
JWT_SECRET=[généré automatiquement]
EMAIL_USER=tamsirdiouf294@gmail.com
EMAIL_PASS=ylgo kymz ztlk nysm
EMAIL_SERVICE=gmail
DATABASE_URL=[fourni par la base de données]
FRONTEND_URL=https://[votre-app].vercel.app
```

## 2. 📱 **Déploiement Frontend sur Vercel**

### Étape 1 : Connexion à Vercel
1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Autoriser l'accès aux repositories

### Étape 2 : Importer le projet
1. Cliquer "New Project"
2. Importer votre repository GitHub
3. Configuration :
   - **Project Name** : `biblio-frontend`
   - **Framework Preset** : `Vite`
   - **Root Directory** : `frontend-gestion-biblio`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

### Étape 3 : Variables d'environnement
Dans les settings du projet Vercel, ajouter :
```
VITE_API_URL=https://[votre-backend].onrender.com
NODE_ENV=production
```

### Étape 4 : Déployer
1. Cliquer "Deploy"
2. Attendre la fin du build
3. Récupérer l'URL Vercel : `https://[votre-app].vercel.app`

## 3. 🔄 **Configuration finale**

### Mettre à jour les URLs croisées
1. **Dans Render** : Mettre à jour `FRONTEND_URL` avec l'URL Vercel
2. **Dans Vercel** : Mettre à jour `VITE_API_URL` avec l'URL Render

### Test de fonctionnement
1. ✅ Backend accessible : `https://[votre-backend].onrender.com`
2. ✅ Frontend accessible : `https://[votre-app].vercel.app`
3. ✅ Communication frontend ↔ backend

## 🎉 **URLs finales**

Après déploiement, vous aurez :
- **🖥️ Frontend** : `https://biblio-frontend.vercel.app`
- **🔧 Backend** : `https://biblio-backend.onrender.com`
- **📊 Base de données** : Hébergée sur Render/PlanetScale

## ⚠️ **Notes importantes**

- **Render** : Premier déploiement peut prendre 10-15 minutes
- **Vercel** : Déploiement quasi-instantané
- **Auto-redéploiement** : À chaque push sur `main`
- **HTTPS** : Activé automatiquement sur les deux plateformes

## 🆘 **Dépannage**

- **Build failed** : Vérifier les logs dans le dashboard
- **CORS Error** : Vérifier `FRONTEND_URL` dans Render
- **API not found** : Vérifier `VITE_API_URL` dans Vercel

---

🚀 **Votre application sera accessible 24h/24 depuis n'importe où !**
