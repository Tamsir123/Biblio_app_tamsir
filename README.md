# BiblioApp

## Présentation
BiblioApp est une application web de gestion de bibliothèque universitaire, permettant la gestion des livres, des utilisateurs, des emprunts, des avis et des notifications. Le projet est composé :
- d’un backend Node.js/Express (API RESTful, MySQL)
- d’un frontend React (Vite, TypeScript)

## Structure du projet

- `backend-gestion-biblio/` : API Express, logique métier, accès MySQL, authentification JWT, gestion des fichiers (images de couverture, profils).
- `frontend-gestion-biblio/` : Application React (Vite), interface d’administration et de consultation.
- `docker-compose.yml` : Lancement groupé backend + base de données.

## Schéma de la base de données (extrait réel)

Voir le fichier : `backend-gestion-biblio/database/schema_complet.sql`

Exemple de tables principales :

```
users (id, name, email, password, role, profile_image, ...)
books (id, title, author, isbn, genre, description, cover_image, total_quantity, available_quantity, publication_year, ...)
borrowings (id, user_id, book_id, borrowed_at, due_date, returned_at, status, ...)
reviews (id, user_id, book_id, rating, comment, is_approved, ...)
notifications (id, user_id, type, title, message, is_read, ...)
```

Pour le schéma SQL complet, voir le fichier `schema_complet.sql`.

## Installation & Lancement

### Prérequis
- Node.js >= 18
- Docker (optionnel mais recommandé)
- MySQL (si hors Docker)

### Lancement avec Docker
```bash
docker-compose up --build
```
- Backend : http://localhost:5000
- MySQL : localhost:3306 (voir identifiants dans docker-compose.yml)

### Lancement manuel
1. **Backend**
   ```bash
   cd backend-gestion-biblio
   npm install
   npm start
   ```
2. **Frontend**
   ```bash
   cd frontend-gestion-biblio
   npm install
   npm run dev
   ```

## Hébergement / Démonstration

- **Frontend** : https://frontend-gestion-biblio-2ietamsir.vercel.app
- **Backend/API** : https://backend-gestion-biblio-production.up.railway.app

La variable d’environnement VITE_API_URL du frontend pointe bien vers l’API Railway :
```
VITE_API_URL=https://backend-gestion-biblio-production.up.railway.app
```

## Documentation API
Voir le fichier `backend-gestion-biblio/README.md` (à compléter) pour la liste des routes, paramètres, exemples de requêtes et réponses.

## Sécurité & Bonnes pratiques
- Authentification JWT
- Middleware de validation et nettoyage des entrées
- Gestion des rôles (admin, étudiant)
- Upload sécurisé des fichiers (images)



