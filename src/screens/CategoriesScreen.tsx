import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { fetchCategories, fetchRecipes } from '../api/wordpress';
import { Category, Recipe, RootStackParamList } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import RecipeCard from '../components/RecipeCard';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, fontSizes, borderRadius } from '../constants/theme';
import { i18n } from '../i18n';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CategoriesScreen() {
  const navigation = useNavigation<Nav>();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const openCategory = async (cat: Category) => {
    setSelectedCategory(cat);
    setLoadingRecipes(true);
    const data = await fetchRecipes({ categories: [cat.id], perPage: 20 });
    setRecipes(data.recipes);
    setLoadingRecipes(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <Text style={styles.header}>{i18n.t('categories.title')}</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openCategory(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.catName}>{item.name}</Text>
            <Text style={styles.catCount}>{item.count} {i18n.t('categories.recipes')}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={!!selectedCategory}
        animationType="slide"
        onRequestClose={() => setSelectedCategory(null)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedCategory?.name}</Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {loadingRecipes ? (
            <LoadingSpinner />
          ) : (
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item}
                  onPress={() => {
                    setSelectedCategory(null);
                    navigation.navigate('RecipeDetail', {
                      recipeId: item.id,
                      title: item.title,
                    });
                  }}
                  onToggleFavorite={() => toggleFavorite(item)}
                  isFavorite={isFavorite(item.id)}
                />
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  header: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: { gap: spacing.sm },
  card: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 90,
    justifyContent: 'flex-end',
  },
  catName: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.white,
  },
  catCount: {
    fontSize: fontSizes.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.xl,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    color: colors.text,
  },
  closeBtn: {
    fontSize: fontSizes.lg,
    color: colors.textLight,
    padding: spacing.xs,
  },
});
