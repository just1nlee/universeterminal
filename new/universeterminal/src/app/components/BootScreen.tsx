import { useEffect } from 'react';

export default function BootScreen({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000); // length of your animation in ms

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black text-bone">
      {/* Boot animation visuals go here */}
      <p>Booting...</p>
    </div>
  );
}