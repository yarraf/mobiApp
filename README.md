# Mobile App

Application mobile pour le site de recettes polonaises [smakidnia.pl](https://smakidnia.pl) — *Przepisy Na Każdą Okazję* (Recettes pour chaque occasion).

## Fonctionnalités

- **Accueil** — dernières recettes avec chargement paginé et pull-to-refresh
- **Catégories** — grille de catégories, recettes filtrées par catégorie
- **Recherche** — recherche full-text via l'API WordPress
- **Favoris** — sauvegarde locale des recettes (fonctionne hors ligne)
- **Détail recette** — affichage HTML complet avec mise en forme (titres, listes, images)
- **Multilingue** — Polonais, Français, Anglais (détection automatique + choix manuel via 🌐)

## Stack technique

| Technologie | Usage |
|---|---|
| [Expo](https://expo.dev) SDK 54 | Framework React Native |
| TypeScript | Typage statique |
| React Navigation v7 | Navigation (bottom tabs + stack) |
| Axios | Appels API REST |
| AsyncStorage | Persistance favoris & langue |
| expo-localization | Détection de la langue du téléphone |
| i18n-js | Internationalisation (FR / EN / PL) |
| react-native-render-html | Rendu HTML du contenu WordPress |

## Source de données

Toutes les recettes sont récupérées depuis l'API REST WordPress :

```
https://smakidnia.pl/wp-json/wp/v2/posts
https://smakidnia.pl/wp-json/wp/v2/categories
```

## Installation

```bash
git clone https://github.com/yarraf/mobiApp.git
cd mobiApp
npm install
```

## Lancer l'application

```bash
npm start          # Expo dev server — scanner le QR avec Expo Go
npm run android    # Émulateur Android
npm run ios        # Simulateur iOS (macOS uniquement)
npm run web        # Navigateur web
```

## Structure du projet

```
src/
├── api/            # Couche API WordPress (fetchRecipes, fetchCategories...)
├── components/     # Composants réutilisables (RecipeCard, SearchBar, LanguagePicker...)
├── constants/      # Tokens de design (couleurs, espacements, typographie)
├── hooks/          # Hooks personnalisés (useFavorites, useLocale)
├── i18n/           # Fichiers de traduction (fr.ts, en.ts, pl.ts)
├── navigation/     # Configuration de la navigation
├── screens/        # Écrans de l'application
├── types/          # Types TypeScript partagés
└── utils/          # Utilitaires (stripHtml, formatDate)
```

## Multilingue

La langue est détectée automatiquement depuis les paramètres du téléphone. L'utilisateur peut changer la langue via le bouton **🌐** dans l'en-tête. Le choix est persisté entre les sessions.

Pour ajouter le support multilingue du contenu WordPress, installer le plugin **Polylang** sur le site et passer le paramètre `lang` à l'API.
