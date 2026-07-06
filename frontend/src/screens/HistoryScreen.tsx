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
  onNavigate?: (screen: 'home' | 'favorites' | 'history' | 'profile') => void;
}

export default function HistoryScreen({ onNavigate }: Props) {
  const today = [
    { title: 'Midnight City', artist: 'M83', time: '14:32', label: 'Just now' },
    { title: 'After Hours', artist: 'The Weeknd', time: '11:15', label: '3h ago' },
  ];
  const yesterday = [
    { title: 'Levitating', artist: 'Dua Lipa', time: 'Oct 24 • 22:45', label: '' },
    { title: 'Blinding Lights', artist: 'The Weeknd', time: 'Oct 24 • 19:20', label: '' },
    { title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', time: 'Oct 24 • 15:10', label: '' },
  ];

  const renderCard = (item: typeof today[0]) => (
    <TouchableOpacity
      key={item.title + item.time}
      activeOpacity={0.7}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.surfaceContainerLowest, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant + '33', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 }}
    >
      <View style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: colors.primaryContainer + '33', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <MaterialIcons name="music-note" size={36} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface }} numberOfLines={1}>{item.title}</Text>
        <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant }} numberOfLines={1}>{item.artist}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <MaterialIcons name="schedule" size={14} color={colors.outline} />
          <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.outline }}>{item.time} • {item.label}</Text>
        </View>
      </View>
      <MaterialIcons name="more-vert" size={20} color={colors.onSurfaceVariant} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 64, marginTop: 12 }}>
          <TouchableOpacity onPress={() => onNavigate?.('home')} activeOpacity={0.7} style={{ marginRight: 8 }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Image source={require('../images/logo.png')} style={{ width: 32, height: 32 }} resizeMode="contain" />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Header */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 36, lineHeight: 44, fontWeight: '700', letterSpacing: -0.02, color: colors.onSurface }}>History</Text>
            <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant, marginTop: 4 }}>Your recently identified soundtracks</Text>
          </View>

          {/* Today */}
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.outline, marginBottom: 16 }}>Today</Text>
          <View style={{ gap: 16 }}>{today.map(renderCard)}</View>

          {/* Yesterday */}
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.outline, marginTop: 24, marginBottom: 16 }}>Yesterday</Text>
          <View style={{ gap: 16 }}>{yesterday.map(renderCard)}</View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20, maxWidth: 440, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', height: 56, backgroundColor: colors.surface + 'CC', borderWidth: 1, borderColor: colors.outlineVariant + '4D', borderRadius: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 }}>
        <TouchableOpacity onPress={() => onNavigate?.('home')} activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="home" size={22} color={colors.onSurfaceVariant} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginTop: 2 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="history" size={22} color={colors.onPrimaryContainer} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onPrimaryContainer, marginTop: 2 }}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate?.('favorites')} activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="favorite" size={22} color={colors.onSurfaceVariant} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginTop: 2 }}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate?.('profile')} activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="person" size={22} color={colors.onSurfaceVariant} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginTop: 2 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
