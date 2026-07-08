import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/splashStyles';
import { API_BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');

interface Props {
  userEmail?: string;
  onNavigate?: (screen: 'home' | 'favorites' | 'history' | 'profile') => void;
}

interface Favorite {
  title: string;
  artist: string;
  album: string;
  genre: string;
  confidence: number;
  created_at: string;
}

export default function FavoritesScreen({ userEmail, onNavigate }: Props) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`${API_BASE_URL}/favorites/?user_email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(); }, [userEmail]);

  const removeFavorite = async (item: Favorite) => {
    try {
      await fetch(`${API_BASE_URL}/favorites/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail, title: item.title, artist: item.artist }),
      });
      fetchFavorites();
    } catch {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 64, marginTop: 12 }}>
          <TouchableOpacity onPress={() => onNavigate?.('home')} activeOpacity={0.7} style={{ marginRight: 8 }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Image source={require('../../assets/images/logo.png')} style={{ width: 32, height: 32 }} resizeMode="contain" />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Section Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <View>
              <Text style={{ fontSize: 36, lineHeight: 44, fontWeight: '700', letterSpacing: -0.02, color: colors.onSurface }}>Favorites</Text>
              <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant, marginTop: 4 }}>{favorites.length} songs saved</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
          ) : favorites.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <MaterialIcons name="favorite-border" size={64} color={colors.outlineVariant} />
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.onSurfaceVariant, marginTop: 16 }}>No favorites yet</Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.outline, marginTop: 4, textAlign: 'center' }}>Identify a song and tap the heart to save it here</Text>
            </View>
          ) : (
            <>
              {/* Grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {favorites.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    style={{ width: (width - 56) / 2, backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.outlineVariant + '4D', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 }}
                  >
                    <View style={{ aspectRatio: 1, borderRadius: 8, backgroundColor: colors.primaryContainer + '33', marginBottom: 16, overflow: 'hidden' }}>
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name="music-note" size={40} color={colors.primary} />
                      </View>
                      <TouchableOpacity
                        style={{ position: 'absolute', top: 8, right: 8 }}
                        onPress={() => removeFavorite(item)}
                      >
                        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center' }}>
                          <MaterialIcons name="favorite" size={16} color="#fff" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface }} numberOfLines={1}>{item.title}</Text>
                        <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant }} numberOfLines={1}>{item.artist}</Text>
                      </View>
                    </View>
                    {item.genre ? (
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.outlineVariant + '33' }}>
                        <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: colors.primary + '1A', borderRadius: 999 }}>
                          <Text style={{ fontSize: 10, lineHeight: 14, fontWeight: '700', letterSpacing: 0.05, color: colors.primary }}>{item.genre}</Text>
                        </View>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Recently Added */}
              <View style={{ marginTop: 32 }}>
                <Text style={{ fontSize: 24, lineHeight: 32, fontWeight: '700', color: colors.onSurface, marginBottom: 16 }}>Recently Added</Text>
                <View style={{ gap: 8 }}>
                  {favorites.slice(0, 5).map((item, i) => (
                    <View
                      key={i}
                      style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant + '4D' }}
                    >
                      <View style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: colors.primaryContainer + '33', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name="music-note" size={28} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface }} numberOfLines={1}>{item.title}</Text>
                        <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant }} numberOfLines={1}>{item.artist}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeFavorite(item)} activeOpacity={0.7}>
                        <MaterialIcons name="favorite" size={22} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20, maxWidth: 440, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', height: 72, backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant + '4D', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 8 }}>
        <TouchableOpacity onPress={() => onNavigate?.('home')} activeOpacity={0.6} style={{ alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 4 }}>
          <View style={{ width: 44, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="home" size={22} color={colors.onSurfaceVariant} />
          </View>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '600', color: colors.onSurfaceVariant }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate?.('history')} activeOpacity={0.6} style={{ alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 4 }}>
          <View style={{ width: 44, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="history" size={22} color={colors.onSurfaceVariant} />
          </View>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '600', color: colors.onSurfaceVariant }}>History</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <View style={{ width: 44, height: 32, borderRadius: 10, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="favorite" size={22} color={colors.onPrimaryContainer} />
          </View>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '600', color: colors.primary }}>Favorites</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigate?.('profile')} activeOpacity={0.6} style={{ alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 4 }}>
          <View style={{ width: 44, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="person" size={22} color={colors.onSurfaceVariant} />
          </View>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '600', color: colors.onSurfaceVariant }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
