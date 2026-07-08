import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/splashStyles';
import { signupStyles as s } from '../styles/signupStyles';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { API_BASE_URL } from '../config/api';

interface Props {
  onSignIn?: () => void;
}

export default function SignUpScreen({ onSignIn }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const errorOpacity = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (errorMsg) {
      Animated.timing(errorOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(errorOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => setErrorMsg(''));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) {
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [successMsg]);

  const getPasswordStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 4);
  };

  const getStrengthColor = (pwd: string): string => {
    const s = getPasswordStrength(pwd);
    if (s <= 1) return '#e74c3c';
    if (s === 2) return '#e67e22';
    if (s === 3) return '#f1c40f';
    return '#2ecc71';
  };

  const getStrengthLabel = (pwd: string): string => {
    const s = getPasswordStrength(pwd);
    if (s <= 1) return 'Weak';
    if (s === 2) return 'Fair';
    if (s === 3) return 'Good';
    return 'Strong';
  };

  const handleSignup = async () => {
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg('Account created successfully!');
        setTimeout(() => onSignIn?.(), 1500);
      } else {
        setErrorMsg(data.detail || 'Something went wrong');
      }
    } catch {
      setErrorMsg('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {successMsg !== '' ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Animated.View style={{ opacity: successOpacity, backgroundColor: colors.surfaceContainerLowest, borderRadius: 16, padding: 32, width: '100%', maxWidth: 280, alignItems: 'center', borderWidth: 1, borderColor: colors.primary + '33', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 30, elevation: 6 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <MaterialIcons name="check" size={34} color="#fff" />
            </View>
            <Text style={{ color: colors.onSurface, fontWeight: '700', fontSize: 20, textAlign: 'center' }}>{successMsg}</Text>
            <Text style={{ color: colors.onSurfaceVariant, fontWeight: '500', fontSize: 14, textAlign: 'center', marginTop: 8 }}>Redirecting to sign in...</Text>
          </Animated.View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.container}>
            {/* Logo Branding */}
            <View style={s.logoSection}>
              <Image
                source={require('../../assets/images/screen.png')}
                style={s.logo}
                resizeMode="contain"
              />
             
              <Text style={s.tagline}>Your digital identity, perfectly harmonized.</Text>
              <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: '500', color: colors.onSurfaceVariant, marginTop: 4 }}>Enter your details to get started</Text>
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

              {/* Password */}
              <View style={s.inputGroup}>
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
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    style={{ padding: 4 }}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={colors.outlineVariant}
                    />
                  </TouchableOpacity>
                </View>
                {password.length > 0 && (
                  <View style={{ marginTop: 8, gap: 4 }}>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      {[1, 2, 3, 4].map((level) => {
                        const strength = getPasswordStrength(password);
                        const colorsMap = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
                        return (
                          <View
                            key={level}
                            style={{
                              flex: 1,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: level <= strength ? colorsMap[strength - 1] : colors.outlineVariant + '66',
                            }}
                          />
                        );
                      })}
                    </View>
                    <Text style={{ fontSize: 12, color: getStrengthColor(password), fontWeight: '600' }}>
                      {getStrengthLabel(password)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={s.inputGroup}>
                <Text style={s.label}>Confirm Password</Text>
                <View
                  style={[
                    s.inputWrapper,
                    focusedField === 'confirmPassword' && s.inputFocused,
                  ]}
                >
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color={focusedField === 'confirmPassword' ? colors.primary : colors.outline}
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="••••••••"
                    placeholderTextColor={colors.outline}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity
                    style={{ padding: 4 }}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <MaterialIcons
                      name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={colors.outlineVariant}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Error Message */}
              {errorMsg !== '' && (
                <Animated.View style={{ opacity: errorOpacity, backgroundColor: '#e74c3c', borderRadius: 8, padding: 10, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialIcons name="error-outline" size={18} color="#fff" />
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13, flex: 1 }}>{errorMsg}</Text>
                </Animated.View>
              )}

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
              <TouchableOpacity
                style={[s.createButton, loading && { opacity: 0.7 }]}
                activeOpacity={0.9}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.onPrimaryContainer} size="small" />
                ) : (
                  <>
                    <Text style={s.createButtonText}>Create Account</Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={20}
                      color={colors.onPrimaryContainer}
                    />
                  </>
                )}
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
      )}
    </SafeAreaView>
  );
}
