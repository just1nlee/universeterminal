'use client';

import { useEffect, useState } from 'react';

export default function TempScreen({ onNext, setTemperature }: { onNext: () => void; setTemperature: (value: number) => void; }) {
    const options = [
        { label: 'PRECISE', value: '0.1', description: ' -- FACTUAL, GROUNDED, REALISTIC' },
        { label: 'BALANCED', value: '0.5', description: ' -- LOGICAL, CURIOUS, EXPLORATORY' },
        { label: 'CHAOTIC', value: '0.9', description: ' -- PARADOXES, MULTIVERSES, IMPOSSIBILITIES'}
    ];

    // Index of the current selected temperature option
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev === 0 ? options.length - 1 : prev - 1));
        }
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev === options.length - 1 ? 0 : prev + 1));
        }
        if (e.key === 'Enter') {
            const chosenValue = parseFloat(options[selectedIndex].value);
            setTemperature(chosenValue);  
            onNext();
        }
    };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [options, selectedIndex, onNext]);

    return(
        <div className="h-full w-full flex flex-col justify-start">
            <h1 className="mt-10 text-[1.83rem] text-center w-full px-8">SELECT YOUR CREATIVITY TEMPERATURE</h1>
    
            {/* Temperature options list */}  
            <div className="text-[1.83rem] flex flex-col gap-2 mt-12 mb-4 pl-16">

            {/* Loop through temperature options */}  
            {options.map((opt, i) => (
                <div key={i} className="text-bone flex items-center min-h-[2rem] leading-none">

                {/* Displays selection arrow */}  
                <span className="w-4 inline-block text-right">
                    {i === selectedIndex ? '>' : ' '}
                </span>
    
                <span className={`w-32 ml-10 ${i === selectedIndex ? 'animate' : ''}`}>
                    {opt.label}
                </span>
    
                {/* Displays description when hovering over option */}
                <span 
                    className="text-left"
                    style={{ opacity: i === selectedIndex ? 1 : 0 }}
                >
                    {opt.description}
                </span>
                </div>
            ))}
            </div>
            
            <div className="absolute bottom-20 left-0 w-full text-center text-bone">
                <p className="text-[1.83rem] text-bone">
                    USE ↑ ↓ TO NAVIGATE
                </p>
                <p className="text-[1.83rem] text-bone leading-snug">
                    <span className="blink">
                        PRESS [ ENTER ] TO SELECT
                    </span>
                </p>
            </div>
        </div>
    )
}
