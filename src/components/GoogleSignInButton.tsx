import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ViewStyle } from 'react-native';

const googleLogoUrl =
  'https://user-images.githubusercontent.com/194400/70987158-4069c900-20b7-11ea-892e-8a2e1166b6b7.png';

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function GoogleSignInButton({ label, onPress, style }: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{ uri: googleLogoUrl }}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#c3c6d7',
    borderRadius: 8,
    alignSelf: 'stretch',
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#191c1e',
  },
});
