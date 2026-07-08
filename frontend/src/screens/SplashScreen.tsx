import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { colors, styles } from '../styles/splashStyles';

const avatarIcons = [
  { icon: 'lightning-bolt', bg: colors.primaryContainer + '33', color: colors.primary },
  { icon: 'music-box-multiple', bg: colors.secondaryContainer + '33', color: colors.secondary },
  { icon: 'magnify', bg: colors.tertiaryContainer + '33', color: colors.tertiary },
];

interface Props {
  onGetStarted?: () => void;
}

export default function SplashScreen({ onGetStarted }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const shadowElevation = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 8],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        {/* Top Section: Branding */}
        <View style={styles.topSection}>
          <Image
            source={require('../../assets/images/screen.png')}
            style={styles.logo}
            resizeMode="contain"
          />
         
          <Text style={styles.tagline}>Discover Music Around You</Text>
        </View>

        {/* Middle Section: Premium Content Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="music-note" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Application Profile</Text>
          </View>
          <Text style={styles.cardBody}>
            EchoID is a modern music recognition application that identifies
            songs playing around you within seconds. Simply tap the recognition
            button, let the app listen briefly, and receive accurate song
            information including title, artist, album, lyrics, and streaming
            options. Save your discoveries, build your music library, and
            explore artists—all in one place.
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.avatarGroup}>
              {avatarIcons.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.avatar,
                    { backgroundColor: item.bg },
                    index === 0 && styles.avatarFirst,
                  ]}
                >
                  <MaterialCommunityIcons name={item.icon as any} size={12} color={item.color} />
                </View>
              ))}
            </View>
            <Text style={styles.badgeText}>Fast, Accurate, Localized</Text>
          </View>
        </View>

        {/* Bottom Section: Actions */}
        <View style={styles.bottomSection}>
          <Animated.View
            style={[
              styles.buttonShadow,
              {
                transform: [{ scale: scaleAnim }],
                elevation: shadowElevation,
                shadowOpacity: shadowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.04, 0.15],
                }),
                shadowRadius: shadowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 24],
                }),
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onGetStarted}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <MaterialIcons name="arrow-forward" size={20} color={colors.onPrimary} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}