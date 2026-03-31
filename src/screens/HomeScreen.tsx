import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { i18n } from '../i18n';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchRecipes } from '../api/wordpress';
import { Recipe, RootStackParamList } from '../types';
import RecipeCard from '../components/RecipeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFavorites } from '../hooks/useFavorites';
import { colors, spacing, fontSizes } from '../constants/theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadRecipes = useCallback(async (pageNum: number, reset = false) => {
    try {
      const data = await fetchRecipes({ page: pageNum, perPage: 12 });
      setTotalPages(data.totalPages);
      setRecipes((prev) => (reset ? data.recipes : [...prev, ...data.recipes]));
      setPage(pageNum);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadRecipes(1, true).finally(() => setLoading(false));
  }, [loadRecipes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes(1, true);
    setRefreshing(false);
  };

  const onLoadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    await loadRecipes(page + 1);
    setLoadingMore(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <Text style={styles.header}>{i18n.t('home.latestRecipes')}</Text>
        }
        ListFooterComponent={
          loadingMore ? <LoadingSpinner /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  header: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
});
