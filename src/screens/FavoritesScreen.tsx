import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavorites } from '../hooks/useFavorites';
import RecipeCard from '../components/RecipeCard';
import { RootStackParamList } from '../types';
import { colors, spacing, fontSizes } from '../constants/theme';
import { i18n } from '../i18n';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyTitle}>{i18n.t('favorites.empty')}</Text>
          <Text style={styles.emptyText}>{i18n.t('favorites.emptyHint')}</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
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
            <Text style={styles.header}>
              {i18n.t('favorites.title')} ({favorites.length})
            </Text>
          }
        />
      )}
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});
