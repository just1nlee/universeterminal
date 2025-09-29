'use client';

import { useState } from 'react';
import HomeScreen from '@/app/components/HomeScreen';
import TempScreen from '@/app/components/TempScreen';
import BootScreen from '@/app/components/BootScreen';
import Terminal from '@/app/components/Terminal';

export default function Page() {
  const [screen, setScreen] = useState<'home' | 'temp' | 'boot' | 'terminal'>('home');
  const [temperature, setTemperature] = useState(0.7);

  switch (screen) {
    case 'home':
      return <HomeScreen onNext={() => setScreen('temp')} />;
    case 'temp':
      return <TempScreen onNext={() => setScreen('boot')} setTemperature={setTemperature} />;
    case 'boot':
      return <BootScreen onNext={() => setScreen('terminal')} />;
    case 'terminal':
      return <Terminal temperature={temperature} onFinish={() => setScreen('home')} />;
  }
}