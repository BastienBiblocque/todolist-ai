This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# TodoList Application

Une application de gestion de tâches construite avec Next.js, intégrant l'authentification et une base de données PostgreSQL.

## Fonctionnalités

- Authentification utilisateur (connexion/inscription)
- Création, modification et suppression de tâches
- Interface utilisateur responsive
- Sécurisation des routes API
- Tests unitaires complets

## Tests

L'application est testée à l'aide de Jest et React Testing Library. Les tests couvrent :

- Composants React (Navigation, etc.)
- Routes API (authentification, gestion des tâches)
- Middleware et sécurité

Pour exécuter les tests :

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Générer un rapport de couverture
npm run test:coverage
```

### Structure des Tests

- `__tests__/Navigation.test.tsx` : Tests du composant de navigation
- `__tests__/auth.test.ts` : Tests des routes d'authentification
- `__tests__/tasks.test.ts` : Tests des opérations CRUD sur les tâches

### Technologies de Test

- Jest : Framework de test
- React Testing Library : Tests des composants React
- MSW (Mock Service Worker) : Mock des requêtes API
- jest-environment-jsdom : Environnement DOM pour les tests

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
