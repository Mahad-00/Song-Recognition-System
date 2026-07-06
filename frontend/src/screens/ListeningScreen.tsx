import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/splashStyles';

const { width } = Dimensions.get('window');

interface Props {
  onCancel?: () => void;
}

export default function ListeningScreen({ onCancel }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        {/* Background blurs */}
        <View style={{ position: 'absolute', top: -96, left: -96, width: 384, height: 384, borderRadius: 192, backgroundColor: colors.primary + '0D', opacity: 0.3 }} />
        <View style={{ position: 'absolute', bottom: -96, right: -96, width: 384, height: 384, borderRadius: 192, backgroundColor: colors.secondary + '0D', opacity: 0.3 }} />

        {/* Mic card */}
        <View style={{ backgroundColor: colors.surfaceContainerLowest, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: colors.outlineVariant + '4D', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 4 }}>
          <Image
            source={require('../images/mic.png')}
            style={{ width: 256, height: 256, tintColor: colors.primary }}
            resizeMode="contain"
          />
        </View>

        {/* Text */}
        <View style={{ alignItems: 'center', marginTop: 24, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 24, lineHeight: 32, fontWeight: '700', color: colors.onSurface, textAlign: 'center' }}>Listening</Text>
          <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, maxWidth: 320 }}>
            Hold your phone near the music source for the best recognition results.
          </Text>
        </View>

        {/* Progress bar */}
        <View style={{ width: 192, height: 4, backgroundColor: colors.surfaceContainerHigh, borderRadius: 999, overflow: 'hidden', marginTop: 32 }}>
          <View style={{ width: '33%', height: '100%', backgroundColor: colors.primary, borderRadius: 999 }} />
        </View>
      </View>

      {/* Cancel button */}
      <View style={{ position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={onCancel}
          activeOpacity={0.7}
          style={{ width: '100%', maxWidth: 320, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant + '4D', borderRadius: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
        >
          <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.primary }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
