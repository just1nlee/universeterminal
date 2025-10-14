"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeScreen from "@/app/components/HomeScreen";
import TempScreen from "@/app/components/TempScreen";
import BootScreen from "@/app/components/BootScreen";

export default function Page() {
  const [screen, setScreen] = useState<"home" | "temp" | "boot">("home");
  const [temperature, setTemperature] = useState(0.7);
  const router = useRouter();

  switch (screen) {
    case "home":
      return <HomeScreen onNext={() => setScreen("temp")} />;

    case "temp":
      return (
        <TempScreen
          setTemperature={setTemperature}
          onNext={() => setScreen("boot")}
        />
      );

    case "boot":
      return (
        <BootScreen
          onNext={() => {
            // save temperature in sessionStorage (so terminal can read it)
            sessionStorage.setItem("temperature", String(temperature));
            router.push("/terminal");
          }}
        />
      );

    default:
      return null;
  }
}
