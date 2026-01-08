# 🚀 Guide de démarrage rapide

## Installation et lancement

### 1. Cloner le projet (si nécessaire)
```bash
cd fdm
```

### 2. Lancer tous les services avec Docker Compose
```bash
docker-compose up --build
```

Cette commande va :
- Construire les images Docker pour tous les services
- Démarrer PostgreSQL et initialiser la base de données
- Démarrer l'API Gateway (port 3001)
- Démarrer l'API Métier (port 3002)
- Démarrer le Frontend Next.js (port 3000)
- Démarrer Nginx (port 80)

### 3. Accéder à l'application

Une fois tous les services démarrés, vous pouvez accéder à :

- **Frontend** : http://localhost:3000
- **API Gateway** : http://localhost:3001
- **API Métier** : http://localhost:3002
- **Nginx (production)** : http://localhost:80

## 🎯 Premiers pas

1. **Créer un compte** : Cliquez sur "S'inscrire" et remplissez le formulaire
2. **Se connecter** : Utilisez vos identifiants pour vous connecter
3. **Créer une annonce** : Cliquez sur "Déposer une annonce" dans la navbar
4. **Explorer** : Parcourez les annonces, utilisez la recherche et les filtres

## 🛠️ Commandes utiles

### Arrêter les services
```bash
docker-compose down
```

### Arrêter et supprimer les volumes (base de données)
```bash
docker-compose down -v
```

### Voir les logs
```bash
docker-compose logs -f
```

### Voir les logs d'un service spécifique
```bash
docker-compose logs -f frontend
docker-compose logs -f api-gateway
docker-compose logs -f api-business
docker-compose logs -f postgres
```

### Redémarrer un service
```bash
docker-compose restart frontend
```

## 🐛 Dépannage

### Les services ne démarrent pas
- Vérifiez que les ports 3000, 3001, 3002, 5432 et 80 ne sont pas déjà utilisés
- Vérifiez les logs avec `docker-compose logs`

### Erreur de connexion à la base de données
- Attendez quelques secondes que PostgreSQL soit complètement démarré
- Vérifiez les logs de PostgreSQL : `docker-compose logs postgres`

### Le frontend ne se connecte pas à l'API
- Vérifiez que `NEXT_PUBLIC_API_URL` dans docker-compose.yml pointe vers `http://localhost:3001`
- Vérifiez les logs de l'API Gateway : `docker-compose logs api-gateway`

## 📝 Notes

- La base de données est persistante grâce aux volumes Docker
- Les modifications de code sont prises en compte automatiquement grâce aux volumes montés
- Pour un build de production, utilisez `docker-compose -f docker-compose.prod.yml up` (si créé)
