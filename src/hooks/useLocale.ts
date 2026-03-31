import { useState, useCallback } from 'react';
import { i18n, setLocale, Locale } from '../i18n';

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(i18n.locale as Locale);

  const changeLocale = useCallback(async (newLocale: Locale) => {
    await setLocale(newLocale);
    setLocaleState(newLocale);
  }, []);

  return { locale, changeLocale };
}
