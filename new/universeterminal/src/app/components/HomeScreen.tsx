'use client';

import { useEffect, useState } from 'react';
import UniverseTerminalLogo from '../ui/logo';

export default function HomeScreen({ onNext }: { onNext: () => void }) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 100);
        // const audio = new Audio('/startup.mp3');
        // audio.play().catch((err) => console.log("Autoplay blocked:", err));

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            onNext(); 
        }
    };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext]);


    return(
        <div
        className={`flex flex-col items-center justify-center h-full text-bone 
          transition-opacity duration-1000 
          ${loaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <UniverseTerminalLogo />
        <p className="mt-6 text-[1.83rem] leading-snug">
          A terminal to the observable universe
        </p>
        <p className="text-[1.83rem] leading-snug">press [ ENTER ] to continue</p>
      </div>
    )
}