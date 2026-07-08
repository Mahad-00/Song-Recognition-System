import { useState } from 'react';
import SplashScreen from '../screens/SplashScreen';
import OnboardingStep1 from '../screens/OnboardingStep1';
import OnboardingStep2 from '../screens/OnboardingStep2';
import OnboardingStep3 from '../screens/OnboardingStep3';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ListeningScreen from '../screens/ListeningScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type Screen =
  | 'splash'
  | 'onboarding1'
  | 'onboarding2'
  | 'onboarding3'
  | 'login'
  | 'signup'
  | 'home'
  | 'listening'
  | 'favorites'
  | 'history'
  | 'profile';

const tabScreens = ['home', 'favorites', 'history', 'profile'] as const;
export type TabScreen = (typeof tabScreens)[number];

export default function AppNavigator() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const navigate = (s: Screen) => setScreen(s);
  const onTab = (tab: TabScreen) => setScreen(tab);

  switch (screen) {
    case 'onboarding1':
      return <OnboardingStep1 onNext={() => navigate('onboarding2')} />;
    case 'onboarding2':
      return (
        <OnboardingStep2
          onNext={() => navigate('onboarding3')}
          onBack={() => navigate('onboarding1')}
        />
      );
    case 'onboarding3':
      return <OnboardingStep3 onContinue={() => navigate('login')} />;
    case 'login':
      return (
        <LoginScreen
          onSignUp={() => navigate('signup')}
          onLogin={(name, email) => {
            setUserName(name);
            setUserEmail(email);
            navigate('home');
          }}
        />
      );
    case 'signup':
      return <SignUpScreen onSignIn={() => navigate('login')} />;
    case 'home':
      return (
        <HomeScreen
          fullName={userName}
          userEmail={userEmail}
          onListen={() => navigate('listening')}
          onNavigate={onTab}
        />
      );
    case 'listening':
      return <ListeningScreen userEmail={userEmail} onCancel={() => navigate('home')} />;
    case 'favorites':
      return <FavoritesScreen userEmail={userEmail} onNavigate={onTab} />;
    case 'history':
      return <HistoryScreen onNavigate={onTab} />;
    case 'profile':
      return (
        <ProfileScreen
          userName={userName}
          userEmail={userEmail}
          onNavigate={onTab}
          onLogout={() => navigate('login')}
        />
      );
    default:
      return <SplashScreen onGetStarted={() => navigate('onboarding1')} />;
  }
}
