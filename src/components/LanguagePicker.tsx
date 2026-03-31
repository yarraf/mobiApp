import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { LOCALES, Locale } from '../i18n';
import { colors, spacing, fontSizes, borderRadius } from '../constants/theme';

interface Props {
  currentLocale: Locale;
  onSelect: (locale: Locale) => void;
  visible: boolean;
  onClose: () => void;
}

export default function LanguagePicker({ currentLocale, onSelect, visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          {LOCALES.map((loc) => (
            <TouchableOpacity
              key={loc.code}
              style={[styles.row, currentLocale === loc.code && styles.rowActive]}
              onPress={() => { onSelect(loc.code); onClose(); }}
            >
              <Text style={styles.flag}>{loc.flag}</Text>
              <Text style={[styles.label, currentLocale === loc.code && styles.labelActive]}>
                {loc.label}
              </Text>
              {currentLocale === loc.code && (
                <Text style={styles.check}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    width: 240,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  rowActive: {
    backgroundColor: colors.background,
  },
  flag: { fontSize: 24 },
  label: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  check: {
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: '700',
  },
});
