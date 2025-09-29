'use client';

import { useState } from 'react';
import HomeScreen from '@/app/components/HomeScreen';
import TempScreen from '@/app/components/TempScreen';
import LoadingScreen from '@/app/components/LoadingScreen';
import Terminal from '@/app/components/Terminal';

export default function Page() {
  const [screen, setScreen] = useState<'home' | 'temp' | 'loading' | 'terminal'>('home');

  switch (screen) {
    case 'home':
      return <HomeScreen onNext={() => setScreen('temp')} />;
    case 'temp':
      return <TempScreen onNext={() => setScreen('loading')} />;
    case 'loading':
      return <LoadingScreen onFinish={() => setScreen('terminal')} />;
    case 'terminal':
      return <Terminal />;
  }
}