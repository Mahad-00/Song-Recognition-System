import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/splashStyles';
import { API_BASE_URL } from '../config/api';

interface Props {
  userEmail?: string;
  onCancel?: () => void;
}

export default function ListeningScreen({ userEmail, onCancel }: Props) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'result'>('idle');
  const [result, setResult] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  useEffect(() => {
    if (status === 'recording') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(barAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(barAnim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [status]);

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        setError('Microphone permission required');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
      await recording.startAsync();
      setStatus('recording');
    } catch {
      setError('Failed to start recording');
      setStatus('idle');
    }
  };

  const stopRecording = async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {}
      recordingRef.current = null;
    }
  };

  const handleCancel = async () => {
    if (status === 'recording') {
      setStatus('processing');

      let uri = null;
      if (recordingRef.current) {
        try {
          uri = recordingRef.current.getURI();
          await recordingRef.current.stopAndUnloadAsync();
        } catch {}
        recordingRef.current = null;
      }

      if (uri) {
        try {
          const formData = new FormData();
          formData.append('audio', {
            uri,
            type: 'audio/wav',
            name: 'recording.wav',
          } as any);

          const res = await fetch(`${API_BASE_URL}/identify/`, {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) {
            setError(data.detail || data.message || 'Server error');
          } else if (data.match) {
            setResult(data.match);
            setStatus('result');
            return;
          } else {
            setError(data.message || 'No match found');
          }
        } catch {
          setError('Could not connect to server');
        }
      } else {
        setError('Recording failed');
      }
      setStatus('idle');
    } else {
      onCancel?.();
    }
  };

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['20%', '80%'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <View style={{ position: 'absolute', top: -96, left: -96, width: 384, height: 384, borderRadius: 192, backgroundColor: colors.primary + '0D', opacity: 0.3 }} />
        <View style={{ position: 'absolute', bottom: -96, right: -96, width: 384, height: 384, borderRadius: 192, backgroundColor: colors.secondary + '0D', opacity: 0.3 }} />

        {status === 'result' && result ? (
          <View style={{ backgroundColor: colors.surfaceContainerLowest, borderRadius: 20, padding: 24, width: '100%', maxWidth: 340, borderWidth: 1, borderColor: colors.outlineVariant + '4D', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 4 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <MaterialIcons name="music-note" size={32} color={colors.primary} />
            </View>
            <Text style={{ fontSize: 22, lineHeight: 28, fontWeight: '700', color: colors.onSurface, textAlign: 'center' }}>{result.title}</Text>
            <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 4 }}>{result.artist}</Text>
            {result.album ? <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.outline, textAlign: 'center', marginTop: 2 }}>{result.album}</Text> : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
              <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '700', color: colors.primary }}>{result.confidence}% match</Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                if (!userEmail) return;
                try {
                  const res = await fetch(`${API_BASE_URL}/favorites/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      user_email: userEmail,
                      title: result.title,
                      artist: result.artist,
                      album: result.album || '',
                      genre: result.genre || '',
                      confidence: result.confidence,
                    }),
                  });
                  if (res.ok) setIsFavorite(true);
                } catch {}
              }}
              activeOpacity={0.7}
              style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: isFavorite ? colors.error : colors.outlineVariant + '4D' }}
            >
              <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={20} color={isFavorite ? colors.error : colors.onSurfaceVariant} />
              <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '600', color: isFavorite ? colors.error : colors.onSurfaceVariant }}>{isFavorite ? 'Saved' : 'Add to Favorites'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={{ backgroundColor: colors.surfaceContainerLowest, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: colors.outlineVariant + '4D', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 4 }}>
              <Image
                source={require('../../assets/images/mic.png')}
                style={{ width: 256, height: 256, tintColor: status === 'recording' ? colors.error : colors.primary }}
                resizeMode="contain"
              />
            </View>

            <View style={{ alignItems: 'center', marginTop: 24, paddingHorizontal: 20 }}>
              <Text style={{ fontSize: 24, lineHeight: 32, fontWeight: '700', color: colors.onSurface, textAlign: 'center' }}>
                {status === 'recording' ? 'Listening' : status === 'processing' ? 'Processing...' : 'Ready'}
              </Text>
              {error ? (
                <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.error, textAlign: 'center', marginTop: 8 }}>{error}</Text>
              ) : (
                <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '500', color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, maxWidth: 320 }}>
                  Hold your phone near the music source for the best recognition results.
                </Text>
              )}
            </View>

            {status === 'recording' && (
              <View style={{ width: 192, height: 4, backgroundColor: colors.surfaceContainerHigh, borderRadius: 999, overflow: 'hidden', marginTop: 32 }}>
                <Animated.View style={{ width: barWidth, height: '100%', backgroundColor: colors.primary, borderRadius: 999 }} />
              </View>
            )}

            {status === 'processing' && (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
            )}
          </>
        )}
      </View>

      <View style={{ position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={status === 'result' ? onCancel : handleCancel}
          activeOpacity={0.7}
          style={{ width: '100%', maxWidth: 320, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant + '4D', borderRadius: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
        >
          <Text style={{ fontSize: 20, lineHeight: 28, fontWeight: '600', color: colors.primary }}>
            {status === 'result' ? 'Done' : 'Cancel'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
