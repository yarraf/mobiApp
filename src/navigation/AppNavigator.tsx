import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList, TabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import LanguagePicker from '../components/LanguagePicker';
import { colors } from '../constants/theme';
import { i18n, Locale } from '../i18n';
import { useLocale } from '../hooks/useLocale';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const color = focused ? colors.primary : colors.textLight;

  if (name === 'Home') {
    return <MaterialCommunityIcons name="pot-steam" size={26} color={color} />;
  }

  const emojis: Record<string, string> = {
    Categories: '📂',
    Search: '🔍',
    Favorites: '❤️',
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {emojis[name] ?? '●'}
    </Text>
  );
}

function MainTabs({ locale, onOpenLangPicker }: { locale: Locale; onOpenLangPicker: () => void }) {
  return (
    <Tab.Navigator
      key={locale}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { borderTopColor: colors.border, backgroundColor: colors.card },
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerRight: () => (
          <TouchableOpacity onPress={onOpenLangPicker} style={{ marginRight: 16 }}>
            <Text style={{ fontSize: 22 }}>🌐</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerStyle: { backgroundColor: colors.card },
          headerTitle: () => (
            <Image
              source={require('../../assets/logo.webp')}
              style={{ width: 110, height: 34 }}
              resizeMode="contain"
            />
          ),
          headerTitleContainerStyle: { justifyContent: 'center', alignItems: 'center' },
        }}
      />
      <Tab.Screen name="Categories" component={CategoriesScreen} options={{ title: i18n.t('tabs.categories') }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: i18n.t('tabs.search') }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: i18n.t('tabs.favorites') }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { locale, changeLocale } = useLocale();
  const [langPickerVisible, setLangPickerVisible] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          options={{ headerShown: false }}
        >
          {() => (
            <MainTabs
              locale={locale}
              onOpenLangPicker={() => setLangPickerVisible(true)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{
            title: '',
            headerBackTitle: '←',
            headerStyle: { backgroundColor: colors.card },
            headerTitleStyle: { color: colors.text },
            headerTintColor: colors.primary,
          }}
        />
      </Stack.Navigator>

      <LanguagePicker
        currentLocale={locale}
        visible={langPickerVisible}
        onClose={() => setLangPickerVisible(false)}
        onSelect={changeLocale}
      />
    </NavigationContainer>
  );
}
