"use client";

import { useState } from "react";
import HomeScreen from "@/app/components/HomeScreen";
import TempScreen from "@/app/components/TempScreen";
import BootScreen from "@/app/components/BootScreen";
import TerminalScreen from "@/app/components/TerminalScreen";

export default function Page() {
  const [screen, setScreen] = useState<"home" | "temp" | "boot" | "terminal">(
    "home"
  );
  const [temperature, setTemperature] = useState(0.7);

  switch (screen) {
    case "home":
      return <HomeScreen onNext={() => setScreen("temp")} />;
    case "temp":
      return (
        <TempScreen
          onNext={() => setScreen("boot")}
          setTemperature={setTemperature}
        />
      );
    case "boot":
      return <BootScreen onNext={() => setScreen("terminal")} />;
    case "terminal":
      return (
        <TerminalScreen
          temperature={temperature}
          onNext={() => {
            sessionStorage.clear(); // clears universe_id
            setScreen("home");
          }}
        />
      );
  }
}
