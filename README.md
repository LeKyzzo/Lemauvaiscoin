# le mauvais coin

Des prestations douteuses, mais bien notées 🔥

## Prérequis

- **Docker** et **Docker Compose** (recommandé)
- OU **Node.js 18+** et **PostgreSQL 16+** (développement local)

---

## Installation avec Docker (Recommandé)

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd fdm
```

### 2. Lancer tous les services

```bash
docker-compose up -d --build
```

Cette commande démarre :
- **PostgreSQL** (base de données) - port 5432
- **API Business** - port 3002
- **API Gateway** - port 3001
- **Frontend Next.js** - port 3000
- **Nginx** (reverse proxy) - port 80

### 3. Accéder au site

- **http://localhost:3000** - Site web
- **http://localhost** - Via Nginx (production)

### 4. Commandes utiles

```bash
# Voir les logs
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart frontend

# Arrêter tous les services
docker-compose down

# Supprimer tout (y compris les données)
docker-compose down -v
```

---

## Installation locale (Développement)

### 1. Cloner et installer les dépendances

```bash
git clone <url-du-repo>
cd fdm
npm install
```

### 2. Configurer la base de données

Créer une base PostgreSQL et exécuter le script d'init :

```bash
psql -U postgres -c "CREATE DATABASE fdm_db;"
psql -U postgres -d fdm_db -f database/init.sql
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fdm_db
JWT_SECRET=votre-secret-jwt-super-securise-12345
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Le site est accessible sur **http://localhost:3000**

---

## Structure du projet

```
fdm/
├── app/                    # Pages et API Routes (Next.js App Router)
│   ├── api/               # Endpoints API
│   │   ├── ads/          # CRUD annonces
│   │   └── auth/         # Authentification
│   ├── ads/              # Pages annonces
│   ├── login/            # Page connexion
│   ├── register/         # Page inscription
│   └── profile/          # Page profil
├── components/            # Composants React
├── lib/                   # Utilitaires (db, auth)
├── database/             # Scripts SQL
├── api-business/         # Microservice annonces
├── api-gateway/          # Microservice auth/gateway
└── nginx/                # Config Nginx
```

---

## Fonctionnalités

- ✅ Inscription / Connexion (JWT)
- ✅ Création d'annonces
- ✅ Recherche et filtres par catégorie
- ✅ Thème clair / sombre
- ✅ Design responsive
- ✅ Sécurité (rate limiting, validation, sanitization)

---

## Production

Pour un déploiement en production, modifier dans `docker-compose.yml` :

```yaml
environment:
  JWT_SECRET: <un-vrai-secret-securise>
  DATABASE_URL: <url-de-votre-db-production>
```

Et configurer HTTPS via Nginx ou un reverse proxy.
