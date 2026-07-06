import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/splashStyles';

const { width } = Dimensions.get('window');

interface Props {
  onNavigate?: (screen: 'home' | 'favorites' | 'history' | 'profile') => void;
}

export default function FavoritesScreen({ onNavigate }: Props) {
  const items = [
    { title: 'Ethereal Pulse', artist: 'Prism Echoes', genre: 'ELECTRONIC', duration: '2:45' },
    { title: 'Neon Horizon', artist: 'The Midnight Wave', genre: 'SYNTHWAVE', duration: '4:12' },
    { title: 'Velvet Silence', artist: 'Satin Voices', genre: 'JAZZ', duration: '3:58' },
    { title: 'Urban Jungle', artist: 'Concrete Dreams', genre: 'LO-FI', duration: '2:10' },
  ];

  const recentItems = [
    { title: 'Fractured Glass', artist: 'Crystal Theory', time: 'Added 2 hours ago' },
    { title: 'Silent Rain', artist: 'Misty Echo', time: 'Added 5 hours ago' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 64 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => onNavigate?.('home')} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={{ fontSize: 24, lineHeight: 32, fontWeight: '700', color: colors.primary }}>EchoID</Text>
          </View>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceContainerHighest, borderWidth: 1, borderColor: colors.outlineVariant, overflow: 'hidden' }} />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Section Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <View>
              <Text style={{ fontSize: 36, lineHeight: 44, fontWeight: '700', letterSpacing: -0.02, color: colors.onSurface }}>Favorites</Text>
              <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant, marginTop: 4 }}>32 songs identified and saved</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="grid-view" size={20} color={colors.onSurface} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="sort" size={20} color={colors.onSurface} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {items.map((item, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                style={{ width: (width - 56) / 2, backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.outlineVariant + '4D', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 }}
              >
                <View style={{ aspectRatio: 1, borderRadius: 8, backgroundColor: colors.primaryContainer + '33', marginBottom: 16, overflow: 'hidden' }}>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="music-note" size={40} color={colors.primary} />
                  </View>
                  <View style={{ position: 'absolute', top: 8, right: 8 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcons name="favorite" size={16} color="#fff" />
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface }} numberOfLines={1}>{item.title}</Text>
                    <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant }} numberOfLines={1}>{item.artist}</Text>
                  </View>
                  <MaterialIcons name="more-vert" size={20} color={colors.onSurfaceVariant} />
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.outlineVariant + '33' }}>
                  <View style={{ paddingHorizontal: 4, paddingVertical: 2, backgroundColor: colors.primary + '1A', borderRadius: 999 }}>
                    <Text style={{ fontSize: 10, lineHeight: 14, fontWeight: '700', letterSpacing: 0.05, color: colors.primary }}>{item.genre}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 4, paddingVertical: 2, backgroundColor: colors.onSurfaceVariant + '0D', borderRadius: 999 }}>
                    <Text style={{ fontSize: 10, lineHeight: 14, fontWeight: '700', letterSpacing: 0.05, color: colors.onSurfaceVariant }}>{item.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recently Added */}
          <View style={{ marginTop: 32 }}>
            <Text style={{ fontSize: 24, lineHeight: 32, fontWeight: '700', color: colors.onSurface, marginBottom: 16 }}>Recently Added</Text>
            <View style={{ gap: 8 }}>
              {recentItems.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.7}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant + '4D' }}
                >
                  <View style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: colors.primaryContainer + '33', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="music-note" size={28} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface }} numberOfLines={1}>{item.title}</Text>
                    <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant }} numberOfLines={1}>{item.artist}</Text>
                  </View>
                  <View style={{ marginRight: 16 }}>
                    <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.onSurfaceVariant }}>{item.time}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7}>
                    <MaterialIcons name="favorite" size={22} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.outlineVariant + '4D', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                    <MaterialIcons name="play-arrow" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
        <TouchableOpacity activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainer, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="favorite" size={22} color={colors.onPrimaryContainer} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onPrimaryContainer, marginTop: 2 }}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate?.('profile')} activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
          <MaterialIcons name="person" size={22} color={colors.onSurfaceVariant} />
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginTop: 2 }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
