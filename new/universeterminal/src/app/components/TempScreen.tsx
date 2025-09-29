'use client';

import { useEffect } from 'react';

export default function TempScreen({ onNext }: { onNext: () => void }) {
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
        <div>
            <h1>Temp Screen</h1>
        </div>
    )
}
