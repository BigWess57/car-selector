# Pistes d'améliorations (Si c'était un projet réel)

## Backend & DB
- Ajouter Zod pour la validation stricte des entrées API (POST) pour l'enregistrement des sélections.
- Mettre en place des migrations SQL réelles (drizzle-kit generate) au lieu de `push` pour la prod.
- Indexer `brand_id` dans la table models pour optimiser les jointures.

## Frontend & UX
- Implémenter React Query (@tanstack/react-query) pour le caching et la déduplication des requêtes (pour le changement de marques notamment)
- Ajouter des tests E2E avec Playwright.

## Sécurité
- Ajouter un Rate Limiting par utilisateur sur l'API (avec Vercel par exemple)
- Mettre en place une authentification.
