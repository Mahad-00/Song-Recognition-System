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

interface Props {
  userName: string;
  onNavigate?: (screen: 'home' | 'favorites' | 'history' | 'profile') => void;
  onLogout?: () => void;
}

export default function ProfileScreen({ userName, onNavigate, onLogout }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 64, marginTop: 24 }}>
          <TouchableOpacity onPress={() => onNavigate?.('home')} activeOpacity={0.7} style={{ marginRight: 8 }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Image source={require('../images/logo.png')} style={{ width: 32, height: 32 }} resizeMode="contain" />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Profile Header */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View style={{ position: 'relative' }}>
              <View style={{ width: 128, height: 128, borderRadius: 64, borderWidth: 4, borderColor: colors.surfaceContainerLowest, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 8 }}>
                <MaterialIcons name="person" size={56} color={colors.onSurfaceVariant} />
              </View>
              <TouchableOpacity style={{ position: 'absolute', bottom: 4, right: 4, backgroundColor: colors.primary, borderRadius: 999, padding: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
                <MaterialIcons name="edit" size={16} color={colors.onPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 36, lineHeight: 44, fontWeight: '700', letterSpacing: -0.02, color: colors.onSurface, marginTop: 24, textAlign: 'center' }}>
              {userName}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
              <View style={{ backgroundColor: colors.primaryFixed, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 999 }}>
                <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onPrimaryFixedVariant }}>Pro Account</Text>
              </View>
              <View style={{ backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 999 }}>
                <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onSurfaceVariant }}>256 IDs</Text>
              </View>
            </View>
          </View>

          {/* Preferences */}
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.outline, marginBottom: 8, marginLeft: 4 }}>Preferences</Text>
          <View style={{ backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant + '33', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
            {[
              { icon: 'person' as const, label: 'Account Settings' },
              { icon: 'notifications' as const, label: 'Notification Preferences' },
              { icon: 'palette' as const, label: 'App Theme' },
            ].map((item, i, arr) => (
              <TouchableOpacity key={item.label} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.primaryFixed + '4D', alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcons name={item.icon} size={22} color={colors.primary} />
                    </View>
                    <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface }}>{item.label}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
                </View>
                {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: colors.outlineVariant + '4D', marginHorizontal: 16 }} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Account Action */}
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.outline, marginBottom: 8, marginLeft: 4, marginTop: 24 }}>Account Action</Text>
          <View style={{ backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant + '33', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
            <TouchableOpacity onPress={onLogout} activeOpacity={0.7}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.errorContainer + '80', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name="logout" size={22} color={colors.error} />
                </View>
                <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.error }}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.outline, textAlign: 'center', marginTop: 32 }}>
            EchoID v2.4.0 (Stable)
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20, maxWidth: 440, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', height: 56, backgroundColor: colors.surface + 'CC', borderWidth: 1, borderColor: colors.outlineVariant + '4D', borderRadius: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 }}>
        <TouchableOpacity onPress={() => onNavigate?.('home')} activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="home" size={22} color={colors.onSurfaceVariant} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginTop: 2 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate?.('history')} activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="history" size={22} color={colors.onSurfaceVariant} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginTop: 2 }}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate?.('favorites')} activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="favorite" size={22} color={colors.onSurfaceVariant} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginTop: 2 }}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="person" size={22} color={colors.onPrimaryContainer} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onPrimaryContainer, marginTop: 2 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
