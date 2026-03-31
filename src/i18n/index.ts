import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en';
import fr from './fr';
import pl from './pl';

export type Locale = 'en' | 'fr' | 'pl';

const STORAGE_KEY = '@smakidnia_locale';

export const i18n = new I18n({ en, fr, pl });

i18n.enableFallback = true;
i18n.defaultLocale = 'pl';

// Set locale from device on first load
const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'pl';
i18n.locale = ['en', 'fr', 'pl'].includes(deviceLocale) ? deviceLocale : 'pl';

export async function loadSavedLocale(): Promise<void> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved && ['en', 'fr', 'pl'].includes(saved)) {
    i18n.locale = saved as Locale;
  }
}

export async function setLocale(locale: Locale): Promise<void> {
  i18n.locale = locale;
  await AsyncStorage.setItem(STORAGE_KEY, locale);
}

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];
