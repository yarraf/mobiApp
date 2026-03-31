import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Recipe } from '../types';
import { colors, spacing, fontSizes, borderRadius } from '../constants/theme';
import { stripHtml } from '../utils/htmlParser';

interface Props {
  recipe: Recipe;
  onPress: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export default function RecipeCard({
  recipe,
  onPress,
  onToggleFavorite,
  isFavorite,
}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {recipe.featuredImage ? (
        <Image
          source={{ uri: recipe.featuredImage }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>🍽️</Text>
        </View>
      )}

      {onToggleFavorite && (
        <TouchableOpacity style={styles.favoriteBtn} onPress={onToggleFavorite}>
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {stripHtml(recipe.title)}
        </Text>
        {recipe.excerpt ? (
          <Text style={styles.excerpt} numberOfLines={2}>
            {stripHtml(recipe.excerpt)}
          </Text>
        ) : null}
        {recipe.categories.length > 0 && (
          <View style={styles.tags}>
            {recipe.categories.slice(0, 2).map((cat) => (
              <View key={cat.id} style={styles.tag}>
                <Text style={styles.tagText}>{cat.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  placeholder: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  favoriteBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: borderRadius.full,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 18,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  excerpt: {
    fontSize: fontSizes.sm,
    color: colors.textLight,
    marginBottom: spacing.sm,
    lineHeight: 19,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: fontSizes.xs,
    color: colors.primary,
    fontWeight: '600',
  },
});
