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
import { onboardingStyles as s } from '../styles/onboardingStyles';

interface Props {
  onNext?: () => void;
}

export default function OnboardingStep1({ onNext }: Props) {
  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* Top Navigation Bar */}
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
        <Image
          source={require('../images/logo.png')}
          style={{ height: 32, width: 32, resizeMode: 'contain' }}
        />
        <View />
        {/* Icons removed */}
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={s.container}>
          {/* Header Text */}
          <View style={s.header}>
            <Text style={s.headerTitle}>How It Works</Text>
            <View style={s.stepBadge}>
              <Text style={s.stepBadgeText}>Step 1</Text>
            </View>
          </View>

          {/* Illustration Section */}
          <View style={s.illustrationContainer}>
            <View style={s.decorativeBlur1} />
            <View style={s.decorativeBlur2} />
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPXlz5OvwOxEyOiGQnv3xf6lVrGFHScckh4FFAiejJ391JS3dx2FcSHFHqxAyt-mQF2JMJsZ1SkZ7TKRnjAT_NBywTObwSOcNBXYyxP0-psvsA353TF5Iu06WYtyfhnxZWTE0DjXq_HdCfWtFUu84vMKb1oPhYWKuwAXzjHRKTMKO1HnfgKOn45wEE5iytEVOj6L4euTFXpM159YpeS1w9ABX-A3LLZUqE2gxZ7oYzOgiayLIw8JAtCg' }}
              style={s.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Content Section */}
          <View style={s.contentSection}>
            <Text style={s.contentTitle}>Listen to Music</Text>
            <Text style={s.contentBody}>
              When you hear a song you want to identify, simply open EchoID and tap the{' '}
              <Text style={s.highlight}>'Identify Music'</Text> button. The app will listen to a
              short sample of the surrounding audio.
            </Text>
          </View>

          {/* Step Indicators */}
          <View style={s.stepDots}>
            <View style={s.dotActive} />
            <View style={s.dotInactive} />
            <View style={s.dotInactive} />
          </View>

          {/* Action Section */}
          <View style={s.actions}>
            <TouchableOpacity style={s.nextButton} onPress={onNext} activeOpacity={0.9}>
              <Text style={s.nextButtonText}>Next</Text>
              <MaterialIcons name="chevron-right" size={24} color={colors.onPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={s.skipButton} activeOpacity={0.7}>
              <Text style={s.skipButtonText}>Skip Onboarding</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
