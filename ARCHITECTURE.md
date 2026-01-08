# 🏗️ Architecture du projet FDM

## Vue d'ensemble

FDM est une application web de marketplace de seconde main construite avec une architecture micro-services conteneurisée, respectant les contraintes du projet "Silly as a Service" (SaaS).

## Architecture en 4 Tiers

### Tier 1 : Frontend
- **Technologie** : Next.js 16 avec React 19 et TypeScript
- **Style** : Tailwind CSS avec animations Framer Motion
- **Port** : 3000
- **Container** : `fdm-frontend`
- **Fonctionnalités** :
  - Interface utilisateur moderne et responsive
  - Animations fluides avec Framer Motion
  - Mode sombre automatique
  - Gestion de l'authentification côté client
  - Affichage et gestion des annonces

### Tier 2 : API Gateway / Authentication
- **Technologie** : Node.js avec Express.js
- **Port** : 3001
- **Container** : `fdm-api-gateway`
- **Fonctionnalités** :
  - Point d'entrée principal de l'API
  - Gestion de l'authentification (inscription, connexion)
  - Génération et validation des tokens JWT
  - Proxy vers l'API Métier pour les requêtes d'annonces
  - Gestion des utilisateurs dans PostgreSQL

### Tier 3 : API Métier
- **Technologie** : Node.js avec Express.js
- **Port** : 3002
- **Container** : `fdm-api-business`
- **Fonctionnalités** :
  - CRUD complet pour les annonces
  - Recherche et filtrage des annonces
  - Pagination
  - Gestion des permissions (seul le propriétaire peut modifier/supprimer)
  - Accès à PostgreSQL pour les données

### Tier 4 : Database
- **Technologie** : PostgreSQL 16
- **Port** : 5432
- **Container** : `fdm-db`
- **Schéma** :
  - Table `users` : Informations des utilisateurs
  - Table `ads` : Annonces avec relations vers les utilisateurs
  - Index pour optimiser les performances
  - Triggers pour la mise à jour automatique de `updated_at`

## Communication entre les services

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTP
       │
┌──────▼─────────────────────────────────┐
│         Nginx (Port 80)                 │
│  - Reverse proxy                        │
│  - Load balancing (si nécessaire)       │
└──────┬──────────────────────────────────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
│  Frontend   │  │ API Gateway  │  │ API Métier   │
│  (Next.js)  │  │  (Express)   │  │  (Express)   │
│  Port 3000  │  │  Port 3001   │  │  Port 3002   │
└─────────────┘  └───────┬──────┘  └───────┬──────┘
                         │                 │
                         │  HTTP (Proxy)   │
                         │                 │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │   PostgreSQL    │
                         │   Port 5432     │
                         └─────────────────┘
```

## Réseau Docker

Tous les services communiquent via le réseau Docker interne `fdm-network` :
- Les services peuvent se référencer par leur nom de container
- Exemple : `api-gateway` peut accéder à `api-business` via `http://api-business:3002`
- Le frontend accède à l'API via `http://localhost:3001` (depuis le navigateur)

## Sécurité

- **Authentification** : JWT (JSON Web Tokens) avec expiration de 7 jours
- **Hachage des mots de passe** : bcryptjs avec 10 rounds
- **Validation** : Vérification des permissions pour les opérations sensibles
- **CORS** : Configuré pour permettre les requêtes depuis le frontend

## Persistance des données

- **Volumes Docker** : Les données PostgreSQL sont stockées dans un volume nommé `postgres_data`
- **Initialisation** : Le script `database/init.sql` est exécuté automatiquement au premier démarrage

## Déploiement

### Développement
```bash
docker-compose up
```
- Volumes montés pour le hot-reload
- Logs en temps réel
- Base de données persistante

### Production
- Build optimisé avec Next.js standalone
- Images Docker optimisées (Alpine Linux)
- Nginx pour servir le frontend et router les requêtes API
- Variables d'environnement pour la configuration

## Points d'entrée

1. **Frontend** : http://localhost:3000
2. **API Gateway** : http://localhost:3001
3. **API Métier** : http://localhost:3002
4. **Nginx** : http://localhost:80

## Endpoints API

### Authentification (API Gateway)
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Annonces (via API Gateway)
- `GET /api/ads` - Liste des annonces (filtres, pagination)
- `GET /api/ads/:id` - Détails d'une annonce
- `POST /api/ads` - Créer une annonce (authentifié)
- `PUT /api/ads/:id` - Modifier une annonce (propriétaire)
- `DELETE /api/ads/:id` - Supprimer une annonce (propriétaire)
- `GET /api/ads/user/:userId` - Annonces d'un utilisateur

## Technologies utilisées

### Frontend
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React (icônes)
- Axios

### Backend
- Node.js 20
- Express.js
- PostgreSQL 16
- JWT (jsonwebtoken)
- bcryptjs
- pg (driver PostgreSQL)

### Infrastructure
- Docker & Docker Compose
- Nginx
- Alpine Linux (images optimisées)

## Conformité aux exigences

✅ **4 Tiers distincts** : Frontend, API Gateway, API Métier, Database  
✅ **Conteneurisation complète** : Tous les services dans Docker  
✅ **Docker Compose** : Tout se lance via `docker-compose up`  
✅ **Communication réseau** : Réseau Docker interne  
✅ **Architecture micro-services** : Services indépendants et communicants  
✅ **Design moderne** : Interface soignée avec animations Framer Motion  
✅ **Fonctionnalités complètes** : CRUD annonces, authentification, recherche
