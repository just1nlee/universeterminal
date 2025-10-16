"use client";

import { useEffect, useState } from "react";
import UniverseTerminalLogo from "../ui/logo";

export default function HomeScreen({ onNext }: { onNext: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1200);
    // Play startup sound
    // const audio = new Audio('/startup.mp3');
    // audio.play().catch((err) => console.log("Autoplay blocked:", err));

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext]);

  return (
    <div
      className={`flex flex-col h-full text-bone ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Top section: Logo + tagline */}
      <div className="flex flex-col items-center mt-36">
        <UniverseTerminalLogo />
        <p className="text-[2rem] leading-snug text-center">
          A COMMAND LINE INTERFACE TO THE OBSERVABLE UNIVERSE
        </p>
      </div>

      <div className="flex-1"></div>

      {/* Bottom prompt */}
      <p className="mb-20 text-[1.83rem] leading-snug text-center">
        <span className={loaded ? "blink" : ""}>
          PRESS [ ENTER ] TO EXPLORE
        </span>
      </p>
    </div>
  );
}
