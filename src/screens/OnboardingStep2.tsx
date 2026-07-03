import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/splashStyles';
import { onboardingStyles as s } from '../styles/onboardingStyles2';

interface Props {
  onNext?: () => void;
  onBack?: () => void;
}

export default function OnboardingStep2({ onNext, onBack }: Props) {
  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* Top AppBar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 32,
          backgroundColor: colors.surface + 'CC',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Image
            source={require('../images/logo.png')}
            style={{ height: 32, width: 32, resizeMode: 'contain' }}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={s.container}>
          {/* Header & Step Indicator */}
          <View style={s.header}>
            <View style={s.stepBadge}>
              <Text style={s.stepBadgeText}>STEP 2</Text>
            </View>
            <Text style={s.headerTitleLarge}>How It Works</Text>
          </View>

          {/* Illustration Section */}
          <View style={s.illustrationContainer}>
            <View style={s.decorativeBlur1} />
            <View style={s.decorativeBlur2} />
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2OJ5MsNf83i9Go4My_j2Orz0b1pJUcAYBAm49XhZo5qNlX7Le6HUg-Y-OQ7QqMxbI3R4KVQgQoKHBE9ex8pFHNnLcP1gYFL_f0BnPmp_ZiWSUcRz6vWmZonZ6_B59eeMfeiUVDfwm3oax9EDFo2R3jjoj_bwK6by7C6JgMbiKG3h13T0hTJlxKrjJV3uRJ2VzHBxlt4LKBKQaO6vieIE-UaL3wVdyAZ7Wzple5REFRJVbzIvbZYjoHw' }}
              style={s.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Information Section */}
          <View style={s.contentSection}>
            <Text style={s.contentTitle}>Audio Recognition</Text>
            <Text style={s.contentBody}>
              EchoID securely analyzes the captured audio and compares it with its music database to
              find the closest matching song.
            </Text>
          </View>

          {/* Step Progression */}
          <View style={s.stepDots}>
            <View style={s.dotInactiveSmall} />
            <View style={s.dotActiveWide} />
            <View style={s.dotInactiveSmall} />
          </View>

          {/* Primary Action */}
          <View style={s.actions}>
            <TouchableOpacity style={s.nextButtonSolid} onPress={onNext} activeOpacity={0.9}>
              <Text style={s.nextButtonTextSolid}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
