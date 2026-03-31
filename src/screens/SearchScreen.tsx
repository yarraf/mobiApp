import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchRecipes } from '../api/wordpress';
import { Recipe, RootStackParamList } from '../types';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFavorites } from '../hooks/useFavorites';
import { colors, spacing, fontSizes } from '../constants/theme';
import { i18n } from '../i18n';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await fetchRecipes({ search: query.trim(), perPage: 20 });
      setResults(data.recipes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={handleSearch}
          placeholder={i18n.t('search.placeholder')}
        />
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : searched && results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>{i18n.t('search.noResults')} „{query}"</Text>
        </View>
      ) : !searched ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🍳</Text>
          <Text style={styles.emptyText}>{i18n.t('search.hint')}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() =>
                navigation.navigate('RecipeDetail', {
                  recipeId: item.id,
                  title: item.title,
                })
              }
              onToggleFavorite={() => toggleFavorite(item)}
              isFavorite={isFavorite(item.id)}
            />
          )}
          ListHeaderComponent={
            <Text style={styles.resultsText}>
              {results.length} {i18n.t('search.results')} „{query}"
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  list: { padding: spacing.md },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
  },
  resultsText: {
    fontSize: fontSizes.sm,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
});
