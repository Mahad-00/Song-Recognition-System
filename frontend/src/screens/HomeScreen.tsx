import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/splashStyles';
import { API_BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');

interface Props {
  fullName: string;
  userEmail?: string;
  onListen?: () => void;
  onNavigate?: (screen: 'favorites' | 'history' | 'profile') => void;
}

interface SongResult {
  track_id?: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;
}

export default function HomeScreen({ fullName, userEmail, onListen, onNavigate }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SongResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<SongResult[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const loadCounts = useCallback(async () => {
    if (!userEmail) return;
    try {
      const [favRes, histRes] = await Promise.all([
        fetch(`${API_BASE_URL}/favorites/?user_email=${encodeURIComponent(userEmail)}`),
        fetch(`${API_BASE_URL}/history/?user_email=${encodeURIComponent(userEmail)}`),
      ]);
      const favData = await favRes.json();
      const histData = await histRes.json();
      setFavoritesCount(favData.favorites?.length || 0);
      const searches = (histData.history || []).map((h: any) => h.query);
      setRecentSearches(searches.slice(0, 10));
      setHistoryCount(searches.length);
    } catch {}
  }, [userEmail]);

  const loadTrending = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/search/?q=a`);
      const data = await res.json();
      setTrendingSongs((data.results || []).slice(0, 5));
    } catch {}
  }, []);

  useEffect(() => { loadCounts(); loadTrending(); }, [loadCounts, loadTrending]);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); setShowResults(false); return; }
    setSearching(true);
    setShowResults(true);
    try {
      const res = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {} finally { setSearching(false); }
  }, []);

  const saveSearchHistory = useCallback(async (q: string) => {
    if (!userEmail || !q.trim()) return;
    try {
      await fetch(`${API_BASE_URL}/history/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail, query: q.trim() }),
      });
      loadCounts();
    } catch {}
  }, [userEmail, loadCounts]);

  const onChangeText = useCallback((text: string) => {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(text), 400);
  }, [handleSearch]);

  const onSearchSubmit = useCallback(() => {
    if (searchText.trim()) saveSearchHistory(searchText.trim());
  }, [searchText, saveSearchHistory]);

  const onResultPress = useCallback((song: SongResult) => {
    saveSearchHistory(`${song.title} ${song.artist}`);
    setSearchText(`${song.title} - ${song.artist}`);
    setShowResults(false);
  }, [saveSearchHistory]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 64, marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '700', color: colors.primary }}>EchoID</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onNavigate?.('profile')}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceContainerHighest, overflow: 'hidden', borderWidth: 1, borderColor: colors.outlineVariant + '4D' }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="person" size={22} color={colors.onSurfaceVariant} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          {/* Greeting */}
          <Text style={{ fontSize: 36, lineHeight: 44, fontWeight: '700', letterSpacing: -0.02, color: colors.onSurface }}>
            Hello, {fullName}
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant, marginTop: 4 }}>
            What's that sound?
          </Text>

          {/* Search Bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant + '4D', borderRadius: 12, paddingHorizontal: 16, height: 56, marginTop: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
            <MaterialIcons name="search" size={22} color={colors.onSurfaceVariant} style={{ marginRight: 12 }} />
            <TextInput
              style={{ flex: 1, fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurface }}
              placeholder="Search for songs, artists..."
              placeholderTextColor={colors.outline}
              value={searchText}
              onChangeText={onChangeText}
              onSubmitEditing={onSearchSubmit}
              returnKeyType="search"
            />
            {searching ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : searchText ? (
              <TouchableOpacity onPress={() => { setSearchText(''); setSearchResults([]); setShowResults(false); }}>
                <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Search Results Dropdown */}
          {showResults && searchText.trim() ? (
            <View style={{ marginTop: 8, backgroundColor: colors.surfaceContainerLowest, borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant + '4D', maxHeight: 300, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 }}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {searchResults.length === 0 && !searching ? (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: colors.onSurfaceVariant }}>No songs found</Text>
                  </View>
                ) : (
                  searchResults.map((song, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => onResultPress(song)}
                      style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: i < searchResults.length - 1 ? 1 : 0, borderBottomColor: colors.outlineVariant + '33' }}
                    >
                      <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.primaryContainer + '33', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <MaterialIcons name="music-note" size={20} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.onSurface }} numberOfLines={1}>{song.title}</Text>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: colors.onSurfaceVariant }} numberOfLines={1}>{song.artist}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          ) : null}

          {/* Recognition Center */}
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View
                style={{
                  position: 'absolute',
                  width: 192,
                  height: 192,
                  borderRadius: 96,
                  backgroundColor: colors.primary + '1A',
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.3],
                    outputRange: [0.5, 0],
                  }),
                }}
              />
              <Animated.View
                style={{
                  position: 'absolute',
                  width: 256,
                  height: 256,
                  borderRadius: 128,
                  backgroundColor: colors.primary + '0D',
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.3],
                    outputRange: [0.3, 0],
                  }),
                }}
              />
              <TouchableOpacity
                onPress={onListen}
                activeOpacity={0.7}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  backgroundColor: colors.primaryContainer,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: colors.primaryContainer,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 24,
                  elevation: 8,
                }}
              >
                <Image
                  source={require('../../assets/images/mic.png')}
                  style={{ width: 80, height: 80, tintColor: '#fff' }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.primary, marginTop: 32 }}>
              Identify Music
            </Text>
          </View>

          {/* Quick Access Bento */}
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate?.('history')}
              style={{ flex: 1, backgroundColor: colors.surfaceContainerLowest, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant + '4D', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.secondary + '1A', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <MaterialIcons name="history" size={22} color={colors.secondary} />
              </View>
              <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface }}>History</Text>
              <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.onSurfaceVariant }}>{historyCount} searches</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate?.('favorites')}
              style={{ flex: 1, backgroundColor: colors.surfaceContainerLowest, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant + '4D', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.errorContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <MaterialIcons name="favorite" size={22} color={colors.error} />
              </View>
              <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface }}>Favorites</Text>
              <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.onSurfaceVariant }}>{favoritesCount} saved items</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 ? (
            <View style={{ marginTop: 24 }}>
              <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface, marginBottom: 16 }}>Recent Searches</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {recentSearches.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => { setSearchText(item); handleSearch(item); }}
                      style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.surfaceContainerLow, borderRadius: 999, borderWidth: 1, borderColor: colors.outlineVariant + '33' }}
                    >
                      <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.onSurfaceVariant }}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : null}

          {/* Trending Songs */}
          {trendingSongs.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.onSurface}}>Trending Songs</Text>
                <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.primary }}>TRENDING</Text>
              </View>
              <View style={{ gap: 16 }}>
                {trendingSongs.map((song, i) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => onResultPress(song)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.surfaceContainerLowest, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.outlineVariant + '4D', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
                  >
                    <View style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: colors.primaryContainer + '33', alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcons name="music-note" size={28} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurface }} numberOfLines={1}>{song.title}</Text>
                      <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.onSurfaceVariant }} numberOfLines={1}>{song.artist}</Text>
                    </View>
                    <MaterialIcons name="play-circle" size={28} color={colors.onSurfaceVariant} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ position: 'absolute', bottom: 24, left: 20, right: 20, maxWidth: 440, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', height: 72, backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant + '4D', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 24, elevation: 8 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <View style={{ width: 44, height: 32, borderRadius: 10, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="home" size={22} color={colors.onPrimaryContainer} />
          </View>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '600', color: colors.primary }}>Home</Text>
        </View>
        {[
          { label: 'History', icon: 'history' as const, key: 'history' as const },
          { label: 'Favorites', icon: 'favorite' as const, key: 'favorites' as const },
          { label: 'Profile', icon: 'person' as const, key: 'profile' as const },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.6}
            onPress={() => onNavigate?.(tab.key)}
            style={{ alignItems: 'center', justifyContent: 'center', gap: 2, paddingVertical: 4 }}
          >
            <View style={{ width: 44, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name={tab.icon} size={22} color={colors.onSurfaceVariant} />
            </View>
            <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '600', color: colors.onSurfaceVariant }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
