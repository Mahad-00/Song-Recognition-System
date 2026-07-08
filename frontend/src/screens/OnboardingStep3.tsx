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
import { colors } from '../styles/splashStyles';
import { onboardingStyles as s } from '../styles/onboardingStyles3';

interface Props {
  onContinue?: () => void;
}

export default function OnboardingStep3({ onContinue }: Props) {
  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* Top Navigation Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 32,
          backgroundColor: colors.surface + 'CC',
        }}
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={{ height: 32, width: 32, resizeMode: 'contain' }}
        />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={s.container}>
          {/* Header Text */}
          <View style={s.header}>
            <Text style={s.headerLabel}>How It Works</Text>
            <View style={s.stepBadge}>
              <Text style={s.stepBadgeText}>Step 3</Text>
            </View>
            <View style={s.stepIndicatorLine} />
          </View>

          {/* Illustration Section */}
          <View style={s.illustrationContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbp43_sNsOgBrMDjaHXwNZlFKlPm7TbAW5VO1Y1Q8heqQOjuCEELV7TWWSiQkHgFu9hX1_Yi2pE5XnfAAGvJRtSVpZ-HualN384XHojrf6IkiOpln0URDo587tmXRoWPnroVhOB-ca04lZFwiLVFZQLHXQzafAlJThMmvN_xoyrqEiuw4nN8QLfFYHi0G8Ypro21syF3_V8b9fZqelwiBPfVFZQ21c0EtDBkQM_rXErIbEShM3_xqMWw' }}
              style={s.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Content Section */}
          <View style={s.contentSection}>
            <Text style={s.contentTitle}>View Complete Song Information</Text>
            <Text style={s.contentBody}>
              Instantly receive the song title, artist, album, release date, lyrics, and streaming
              links. Save the song to your favorites or share it with friends.
            </Text>
          </View>

          {/* Action Section */}
          <View style={s.actions}>
            <TouchableOpacity style={s.continueButton} onPress={onContinue} activeOpacity={0.9}>
              <Text style={s.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
