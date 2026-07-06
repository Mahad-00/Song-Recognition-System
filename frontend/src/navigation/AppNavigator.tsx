import { useState } from 'react';
import SplashScreen from '../screens/SplashScreen';
import OnboardingStep1 from '../screens/OnboardingStep1';
import OnboardingStep2 from '../screens/OnboardingStep2';
import OnboardingStep3 from '../screens/OnboardingStep3';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';

export type Screen =
  | 'splash'
  | 'onboarding1'
  | 'onboarding2'
  | 'onboarding3'
  | 'login'
  | 'signup'
  | 'home';

export default function AppNavigator() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [userName, setUserName] = useState('');

  const navigate = (s: Screen) => setScreen(s);

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
          onLogin={(name) => {
            setUserName(name);
            navigate('home');
          }}
        />
      );
    case 'signup':
      return <SignUpScreen onSignIn={() => navigate('login')} />;
    case 'signup':
      return (
        <SignUpScreen
          onSignIn={(name) => {
            setUserName(name);
            navigate('login');
          }}
        />
      );
    case 'home':
      return <HomeScreen fullName={userName} />;
    default:
      return <SplashScreen onGetStarted={() => navigate('onboarding1')} />;
  }
}
