import React from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { colors } from '../styles/splashStyles';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, lineHeight: 32, fontWeight: '700', color: colors.onSurface }}>Profile</Text>
      </View>
    </SafeAreaView>
  );
}
