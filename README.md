# car-selector - Test Technique

Une application Fullstack permettant de sélectionner une marque et un modèle de véhicule, puis d'enregistrer la sélection en base de données.

Ce projet a été réalisé dans le cadre d'un test technique.

## 🛠️ Stack Technique

- **Framework :** Next.js 16 (App Router)
- **Backend :** Hono (intégré via API Routes)
- **Database :** PostgreSQL (via Docker)
- **ORM :** Drizzle ORM
- **UI :** Tailwind CSS + shadcn/ui
- **Langage :** TypeScript


## 🚀 Pré-requis

- Node.js (v18+)
- Docker & Docker Compose

## ⚙️ Installation & Setup

### 1. Cloner et installer les dépendances

```bash
git clone https://github.com/BigWess57/car-selector.git
cd car-selector
npm install
```

### 2. Configuration d'environnement

Créez un fichier .env à la racine du projet et ajoutez-y la chaîne de connexion (correspondant à la configuration Docker ci-dessous) :

```bash
DATABASE_URL=postgres://postgres:password@localhost:5432/car_db
```

### 3. Lancer la Base de Données

Démarrez le conteneur PostgreSQL via Docker :

```bash
docker-compose up -d
```
Note : Le fichier docker-compose.yml est inclus à la racine.

### 4. Initialiser la Base de Données (Schema & Seed)

Une fois le conteneur lancé, push le schéma et insérez les données de test (Toyota, Renault...) :

```bash
# Création des tables
npx drizzle-kit push

# Remplissage des données (Seed)
npx tsx src/db/seed.ts
```

## ▶️ Lancer le projet

Lancez le serveur de développement :

```bash
npm run dev
```

Puis ouvrez http://localhost:3000 dans votre navigateur.
