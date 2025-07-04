# 🛠️ Guide de Troubleshooting - Déploiement

## 🚨 **Problèmes Courants et Solutions**

### 1. **Erreurs Backend Render**

#### ❌ "Build Failed"
```bash
# Vérifier les dépendances
cd backend-gestion-biblio
npm audit fix
```
**Solution** : Mettre à jour package.json avec des versions stables

#### ❌ "Database Connection Failed"
- **Cause** : Render MySQL n'est pas gratuit
- **Solutions** :
  1. Utiliser PostgreSQL Render (gratuit)
  2. Service externe : PlanetScale, Railway, Aiven
  3. Adapter le code pour PostgreSQL

#### ❌ "CORS Errors"
- Vérifier `FRONTEND_URL` dans les variables Render
- Format : `https://votre-app.vercel.app` (sans slash final)

### 2. **Erreurs Frontend Vercel**

#### ❌ "Build Command Failed"
```bash
# Test local
cd frontend-gestion-biblio
npm run build
```
**Solution** : Corriger les erreurs TypeScript/ESLint

#### ❌ "API Calls Failing"
- Vérifier `VITE_API_BASE_URL` dans Vercel
- Format : `https://votre-backend.onrender.com` (sans /api)

#### ❌ "404 on Page Refresh"
- ✅ Le `vercel.json` inclut la config SPA correcte

### 3. **Variables d'Environnement**

#### Render (Backend) - Variables manquantes :
```
JWT_SECRET=[Générer avec "Generate Value"]
FRONTEND_URL=https://votre-app.vercel.app
DATABASE_URL=[Auto ou service externe]
```

#### Vercel (Frontend) - Variable manquante :
```
VITE_API_BASE_URL=https://votre-backend.onrender.com
```

### 4. **Vérifications Post-Déploiement**

#### ✅ Tests Backend
```bash
curl https://votre-backend.onrender.com/
# Doit retourner JSON avec "success": true
```

#### ✅ Tests Frontend
- Ouvrir : `https://votre-app.vercel.app`
- Vérifier la console pour erreurs API

### 5. **Migration Base de Données**

#### Option 1 : PostgreSQL Render
```javascript
// Adapter database.js pour PostgreSQL
const pool = mysql.createPool({
  // Remplacer par pg configuration
});
```

#### Option 2 : Service Externe
- **PlanetScale** : MySQL compatible, plan gratuit
- **Railway** : MySQL, PostgreSQL
- **Aiven** : Plusieurs bases de données

### 6. **Commandes de Debug**

#### Logs Render
```
# Dans Render Dashboard > Logs
# Rechercher erreurs de connexion/startup
```

#### Logs Vercel
```
# Dans Vercel Dashboard > Functions/Deployments
# Vérifier build logs
```

## 🆘 **Checklist de Déploiement**

- [ ] Code pushé sur GitHub
- [ ] render.yaml présent et correct
- [ ] vercel.json présent et correct
- [ ] Variables d'environnement configurées
- [ ] Base de données accessible
- [ ] URLs croisées mises à jour
- [ ] Tests endpoints fonctionnels

## 📧 **Contacts d'Urgence**
- Render Support : help@render.com
- Vercel Support : support@vercel.com
- Documentation : voir GUIDE-DEPLOIEMENT-RENDER-VERCEL.md

---
💡 **Conseil** : Déployer backend en premier, puis frontend avec la bonne API URL
