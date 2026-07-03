import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/splashStyles';
import { signupStyles as s } from '../styles/signupStyles';
import GoogleSignInButton from '../components/GoogleSignInButton';

interface Props {
  onSignIn?: () => void;
}

export default function SignUpScreen({ onSignIn }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.container}>
          {/* Logo Branding */}
          <View style={s.logoSection}>
            <Image
              source={require('../images/screen.png')}
              style={s.logo}
              resizeMode="contain"
            />
           
            <Text style={s.tagline}>Your digital identity, perfectly harmonized.</Text>
          </View>

          {/* Registration Card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Create Account</Text>

            {/* Full Name */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Full Name</Text>
              <View
                style={[
                  s.inputWrapper,
                  focusedField === 'fullName' && s.inputFocused,
                ]}
              >
                <MaterialIcons
                  name="person"
                  size={20}
                  color={focusedField === 'fullName' ? colors.primary : colors.outline}
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="John Doe"
                  placeholderTextColor={colors.outline}
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Email Address</Text>
              <View
                style={[
                  s.inputWrapper,
                  focusedField === 'email' && s.inputFocused,
                ]}
              >
                <MaterialIcons
                  name="mail"
                  size={20}
                  color={focusedField === 'email' ? colors.primary : colors.outline}
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.outline}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Password & Confirm */}
            <View style={s.passwordRow}>
              <View style={[s.inputGroup, s.passwordField]}>
                <Text style={s.label}>Password</Text>
                <View
                  style={[
                    s.inputWrapper,
                    focusedField === 'password' && s.inputFocused,
                  ]}
                >
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color={focusedField === 'password' ? colors.primary : colors.outline}
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="••••••••"
                    placeholderTextColor={colors.outline}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
              <View style={[s.inputGroup, s.passwordField]}>
                <Text style={s.label}>Confirm</Text>
                <View
                  style={[
                    s.inputWrapper,
                    focusedField === 'confirmPassword' && s.inputFocused,
                  ]}
                >
                  <MaterialIcons
                    name="key"
                    size={20}
                    color={
                      focusedField === 'confirmPassword' ? colors.primary : colors.outline
                    }
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="••••••••"
                    placeholderTextColor={colors.outline}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={s.checkboxRow}
              onPress={() => setAgreeTerms(!agreeTerms)}
              activeOpacity={0.7}
            >
              <View style={[s.checkbox, agreeTerms && s.checkboxChecked]}>
                {agreeTerms && (
                  <MaterialIcons
                    name="check"
                    size={14}
                    color={colors.surfaceContainerLowest}
                  />
                )}
              </View>
              <Text style={s.checkboxLabel}>
                I agree to the <Text style={s.checkboxLink}>Terms of Service</Text>
              </Text>
            </TouchableOpacity>

            {/* Create Account Button */}
            <TouchableOpacity style={s.createButton} activeOpacity={0.9}>
              <Text style={s.createButtonText}>Create Account</Text>
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color={colors.onPrimaryContainer}
              />
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.divider}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.outlineVariant + '4D' }} />
              <Text style={{ paddingHorizontal: 16, fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.05, textTransform: 'uppercase', color: colors.outlineVariant }}>Or sign up with</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.outlineVariant + '4D' }} />
            </View>

            {/* Social Signup */}
            <GoogleSignInButton label="Sign up with Google" />

            {/* Footer */}
            <View style={s.divider}>
              <Text style={s.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={onSignIn} activeOpacity={0.7}>
                <Text style={s.signInLink}>Sign In Instead</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
