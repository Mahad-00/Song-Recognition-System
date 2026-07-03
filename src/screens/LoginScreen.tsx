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
import { loginStyles as s } from '../styles/loginStyles';
import GoogleSignInButton from '../components/GoogleSignInButton';

interface Props {
  onSignUp?: () => void;
}

export default function LoginScreen({ onSignUp }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.container}>
          {/* Logo Section */}
          <View style={s.logoSection}>
            <Image
              source={require('../images/screen.png')}
              style={s.logo}
              resizeMode="contain"
            />
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.subtitle}>Identify your sound. Secure your identity.</Text>
          </View>

          {/* Login Card */}
          <View style={s.card}>
            {/* Email Input */}
            <View style={s.inputGroup}>
              <View style={s.labelRow}>
                <Text style={s.label}>Email Address</Text>
              </View>
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
                  placeholder="name@company.com"
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

            {/* Password Input */}
            <View style={s.inputGroup}>
              <View style={s.labelRow}>
                <Text style={s.label}>Password</Text>
                <TouchableOpacity>
                  <Text style={s.forgotLink}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
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
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  style={s.visibilityBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color={colors.outlineVariant}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me */}
            <TouchableOpacity
              style={s.checkboxRow}
              onPress={() => setRemember(!remember)}
              activeOpacity={0.7}
            >
              <View style={[s.checkbox, remember && s.checkboxChecked]}>
                {remember && (
                  <MaterialIcons name="check" size={14} color={colors.surfaceContainerLowest} />
                )}
              </View>
              <Text style={s.checkboxLabel}>Remember me for 30 days</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={s.loginButton} activeOpacity={0.9}>
              <Text style={s.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>Or continue with</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Social Logins */}
            <GoogleSignInButton label="Login with Google" />
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <Text style={s.footerText}>
              Don't have an account?
              <Text style={s.signUpLink} onPress={onSignUp}> Sign Up</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
