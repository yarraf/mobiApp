# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server (scan QR with Expo Go)
npm run android    # Start with Android emulator
npm run ios        # Start with iOS simulator (macOS only)
npm run web        # Start in browser
npx expo start --lan --clear   # LAN mode (same WiFi, no VPN)
```

No linter or test runner is configured yet.

## Architecture

This is an **Expo (SDK 54) + TypeScript** app for [smakidnia.pl](https://smakidnia.pl), a Polish WordPress recipe site. All recipe data is fetched from the WordPress REST API at `https://smakidnia.pl/wp-json/wp/v2/`.

### Data flow

`src/api/wordpress.ts` is the single API layer. It maps raw `WPPost`/`WPCategory` objects into the app's `Recipe`/`Category` types (defined in `src/types/index.ts`). All screens import from the API layer — never call `axios` directly in screens.

### Navigation

Two-level navigation defined in `src/navigation/AppNavigator.tsx`:
- **Bottom tabs** (`TabParamList`): Home, Categories, Search, Favorites
- **Root stack** (`RootStackParamList`): wraps the tabs and adds `RecipeDetail` as a full-screen push

When navigating to a recipe detail, always pass both `recipeId` and `title` params.

### Favorites

`src/hooks/useFavorites.ts` manages favorites using `AsyncStorage`. It stores full `Recipe` objects so the Favorites screen works offline. Call `toggleFavorite(recipe)` and `isFavorite(id)` from any screen — the hook re-reads storage on mount.

### Styling

All design tokens (colors, spacing, font sizes, border radii) live in `src/constants/theme.ts`. Primary brand color is `#E8521A`. Never use hardcoded hex values in component stylesheets — import from theme.

### WordPress content

Recipe titles, excerpts, and content come as raw HTML from WordPress. Always pass them through `stripHtml()` from `src/utils/htmlParser.ts` before rendering in `Text` components.

The full recipe body (`recipe.content`) is rendered using `react-native-render-html` in `RecipeDetailScreen` — do not use `stripHtml()` for the body, pass the raw HTML directly via the `source={{ html }}` prop. Tag styles are defined inline in the screen via `htmlTagStyles`.

### Internationalisation

3 langues : Polonais (défaut), Français, Anglais. Fichiers de traduction dans `src/i18n/`. Toujours utiliser `i18n.t('clé')` pour les textes UI — ne jamais hardcoder du texte en dur dans les composants. La langue est persistée via AsyncStorage et chargée au démarrage dans `App.tsx`.

## Branch strategy

```
main          ← code stable, production
develop       ← développement général
android-dev   ← build & config Android (déclenche GitHub Actions)
ios-dev       ← build & config iOS (à venir)
```

## Android Build (GitHub Actions)

Le workflow `.github/workflows/build-android.yml` se déclenche sur push vers `android-dev`.

Il génère 2 artifacts :
- `smakidnia-release-apk` — APK signé pour installation directe
- `smakidnia-release-aab` — AAB signé pour Google Play Store

**Secrets GitHub requis** (`Settings → Secrets → Actions`) :

| Secret | Description |
|---|---|
| `KEYSTORE_BASE64` | Keystore encodé en base64 |
| `KEYSTORE_PASSWORD` | Mot de passe du keystore |
| `KEY_ALIAS` | `smakidnia` |
| `KEY_PASSWORD` | Mot de passe de la clé |

Le keystore `smakidnia.keystore` est exclu du repo via `.gitignore` — ne jamais le commiter.
