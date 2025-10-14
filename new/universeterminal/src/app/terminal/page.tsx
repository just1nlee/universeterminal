"use client";

import { useEffect, useState } from "react";
import TerminalScreen from "@/app/components/TerminalScreen";

export default function TerminalPage() {
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    // retrieve temperature from sessionStorage
    const stored = sessionStorage.getItem("temperature");
    if (stored) setTemperature(parseFloat(stored));
  }, []);

  if (temperature === null) {
    return <div className="text-bone">Loading terminal...</div>;
  }

  return <TerminalScreen temperature={temperature} />;
}
