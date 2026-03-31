import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { fetchRecipeById } from '../api/wordpress';
import { Recipe, RootStackParamList } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFavorites } from '../hooks/useFavorites';
import { stripHtml, formatDate } from '../utils/htmlParser';
import { i18n } from '../i18n';
import { colors, spacing, fontSizes, borderRadius } from '../constants/theme';

type Route = RouteProp<RootStackParamList, 'RecipeDetail'>;

const htmlTagStyles = {
  h1: { fontSize: fontSizes.xxl, fontWeight: '800' as const, color: colors.text, marginBottom: spacing.sm },
  h2: { fontSize: fontSizes.xl, fontWeight: '700' as const, color: colors.text, marginBottom: spacing.sm },
  h3: { fontSize: fontSizes.lg, fontWeight: '700' as const, color: colors.text },
  p:  { fontSize: fontSizes.md, color: colors.text, lineHeight: 26, marginBottom: spacing.sm },
  li: { fontSize: fontSizes.md, color: colors.text, lineHeight: 24 },
  strong: { fontWeight: '700' as const, color: colors.text },
  a:  { color: colors.primary },
};

export default function RecipeDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { recipeId } = route.params;
  const { toggleFavorite, isFavorite } = useFavorites();
  const { width } = useWindowDimensions();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipeById(recipeId)
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [recipeId]);

  useEffect(() => {
    if (recipe) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => toggleFavorite(recipe)}
            style={{ marginRight: spacing.sm }}
          >
            <Text style={{ fontSize: 22 }}>
              {isFavorite(recipe.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [recipe, isFavorite, navigation, toggleFavorite]);

  if (loading) return <LoadingSpinner />;
  if (!recipe) return (
    <View style={styles.error}>
      <Text style={styles.errorText}>{i18n.t('recipe.cannotLoad')}</Text>
    </View>
  );

  const contentWidth = width - spacing.md * 2;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {recipe.featuredImage && (
        <Image
          source={{ uri: recipe.featuredImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{stripHtml(recipe.title)}</Text>

        <View style={styles.meta}>
          <Text style={styles.date}>{formatDate(recipe.date)}</Text>
          {recipe.categories.map((cat) => (
            <View key={cat.id} style={styles.tag}>
              <Text style={styles.tagText}>{cat.name}</Text>
            </View>
          ))}
        </View>

        {recipe.excerpt ? (
          <Text style={styles.excerpt}>{stripHtml(recipe.excerpt)}</Text>
        ) : null}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>{i18n.t('recipe.recipe')}</Text>

        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: recipe.content }}
          tagsStyles={htmlTagStyles}
          enableExperimentalMarginCollapsing
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xl * 2 },
  image: { width: '100%', height: 260 },
  body: { padding: spacing.md },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 34,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  date: { fontSize: fontSizes.sm, color: colors.textLight },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  tagText: { fontSize: fontSizes.xs, color: colors.white, fontWeight: '600' },
  excerpt: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: fontSizes.md, color: colors.textLight },
});
