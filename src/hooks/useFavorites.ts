import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types';

const STORAGE_KEY = '@smakidnia_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  const saveFavorites = useCallback(async (updated: Recipe[]) => {
    setFavorites(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const toggleFavorite = useCallback(
    (recipe: Recipe) => {
      const exists = favorites.some((f) => f.id === recipe.id);
      const updated = exists
        ? favorites.filter((f) => f.id !== recipe.id)
        : [...favorites, recipe];
      saveFavorites(updated);
    },
    [favorites, saveFavorites]
  );

  const isFavorite = useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
