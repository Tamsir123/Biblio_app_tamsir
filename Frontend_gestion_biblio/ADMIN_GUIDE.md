# Guide d'Administration - Système de Gestion de Bibliothèque

## 📋 Table des matières
1. [Connexion Administrateur](#connexion-administrateur)
2. [Interface d'Administration](#interface-dadministration)
3. [Gestion des Livres](#gestion-des-livres)
4. [Upload d'Images](#upload-dimages)
5. [Résolution des Problèmes](#résolution-des-problèmes)

---

## 🔐 Connexion Administrateur

### Accès Initial
- **URL** : `http://localhost:3000/login`
- **Redirection automatique** : Les administrateurs sont automatiquement redirigés vers `/admin` après connexion
- **Identifiants requis** : Email + Mot de passe avec rôle administrateur

### Vérification du Statut Admin
Pour qu'un utilisateur accède à l'interface admin, il doit :
1. ✅ Être connecté (token JWT valide)
2. ✅ Avoir le rôle `admin` dans la base de données
3. ✅ Le token doit contenir les informations de rôle

---

## 🎛️ Interface d'Administration

### Navigation
L'interface admin comprend 4 onglets principaux :

#### 📊 **Vue d'ensemble**
- Statistiques générales
- Compteurs : Utilisateurs, Livres, Emprunts actifs, Retards
- Tableau de bord rapide

#### 📚 **Gestion des livres** *(Principal)*
- Liste complète des livres
- Actions : Ajouter, Modifier, Supprimer
- Upload d'images de couverture
- Recherche et filtrage

#### 👥 **Utilisateurs** *(En développement)*
- Gestion des comptes utilisateurs
- Rôles et permissions

#### 📄 **Emprunts** *(En développement)*
- Suivi des emprunts
- Gestion des retards

---

## 📚 Gestion des Livres

### ➕ Ajouter un Livre

#### Champs Obligatoires
- **Titre** *(requis)* : Maximum 200 caractères
- **Auteur** *(requis)* : Maximum 150 caractères
- **Année de publication** *(requis)* : Entre 1901 et 2155
- **Quantité totale** *(requis)* : Entre 0 et 1000 exemplaires

#### Champs Optionnels
- **Genre** : Maximum 50 caractères (Fiction, Science-fiction, etc.)
- **ISBN** : Maximum 20 caractères (Ex: 978-2-123456-78-9)
- **Description** : Maximum 5000 caractères
- **Image de couverture** : PNG, JPG, JPEG jusqu'à 5MB

#### Processus d'Ajout
1. Cliquer sur **"Ajouter un livre"**
2. Remplir le formulaire (champs obligatoires marqués *)
3. Optionnel : Ajouter une image de couverture
4. Cliquer sur **"Ajouter le livre"**

### ✏️ Modifier un Livre

#### Processus de Modification
1. Dans la liste des livres, cliquer sur **"Modifier"**
2. Le formulaire se pré-remplit avec les données existantes
3. Modifier les champs souhaités
4. Optionnel : Changer l'image de couverture
5. Cliquer sur **"Modifier le livre"**

### 🗑️ Supprimer un Livre

#### Processus de Suppression
1. Dans la liste des livres, cliquer sur **"Supprimer"**
2. Confirmer la suppression dans la popup
3. Le livre est définitivement supprimé

⚠️ **Attention** : La suppression est irréversible !

---

## 🖼️ Upload d'Images

### Formats Supportés
- **PNG** (recommandé pour la qualité)
- **JPG/JPEG** (recommandé pour la taille)
- **Taille maximale** : 5MB
- **Dimensions recommandées** : 300x450px (ratio 2:3)

### Processus d'Upload
1. Dans le formulaire livre, section "Image de couverture"
2. Cliquer sur **"Choisir une image"**
3. Sélectionner le fichier depuis votre ordinateur
4. L'aperçu s'affiche immédiatement
5. Option : **"Supprimer l'image"** pour enlever la sélection

### Bonnes Pratiques
- ✅ Utilisez des images de bonne qualité
- ✅ Respectez le ratio livre (portrait)
- ✅ Noms de fichiers explicites
- ✅ Optimisez la taille (< 1MB idéalement)

---

## 🔧 Résolution des Problèmes

### Erreur 403 (Forbidden)

#### Causes Possibles
1. **Token expiré** : Reconnectez-vous
2. **Rôle insuffisant** : Vérifiez que l'utilisateur a le rôle `admin`
3. **Token manquant** : Le localStorage peut être vide

#### Solutions
```javascript
// Vérifier le token dans la console du navigateur
console.log('Token:', localStorage.getItem('token'))
console.log('User:', localStorage.getItem('user'))
```

#### Étapes de Débogage
1. **F12** → Console
2. Vérifier le contenu du localStorage
3. Vérifier la réponse de l'API (Network tab)
4. Se reconnecter si nécessaire

### Erreur d'Upload d'Image

#### Vérifications
- ✅ Taille du fichier < 5MB
- ✅ Format supporté (PNG/JPG/JPEG)
- ✅ Connexion stable
- ✅ Backend opérationnel

### Redirection Admin

#### Configuration Attendue
Après connexion, si l'utilisateur est admin :
```javascript
// Dans le composant de connexion
if (user.role === 'admin') {
  navigate('/admin')
} else {
  navigate('/dashboard') // ou page utilisateur normal
}
```

### État de Développement

#### ✅ Fonctionnel
- Connexion/Déconnexion
- Gestion des livres (CRUD complet)
- Upload d'images
- Interface responsive

#### 🚧 En Développement
- Gestion des utilisateurs
- Gestion des emprunts
- Statistiques avancées
- Notifications

---

## 📞 Support

### Problèmes Techniques
1. Vérifier la console du navigateur (F12)
2. Vérifier que le backend est démarré (port 5000)
3. Vérifier la base de données
4. Redémarrer les services si nécessaire

### Logs Utiles
```bash
# Backend
cd /home/tamsir/Desktop/backend-gestion-biblio
npm start

# Frontend
cd /home/tamsir/Desktop/frontend-gestion-biblio
npm run dev
```

---

*Guide mis à jour : Juillet 2025*
*Version : 1.0*
