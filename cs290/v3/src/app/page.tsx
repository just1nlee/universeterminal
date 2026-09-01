"use client";

import { useState } from "react";
import HomeScreen from "@/app/screens/HomeScreen";
import TerminalScreen from "@/app/screens/TerminalScreen";

export default function Home() {
    const [screen, setScreen] = useState<"home" | "terminal">("home");

    switch (screen) {
        case "home": 
            return <HomeScreen onNext={() => setScreen("terminal")} />;
        case "terminal":
            return <TerminalScreen onNext={() => {
                setScreen("home");
                sessionStorage.clear();
            }} />;
    }
}