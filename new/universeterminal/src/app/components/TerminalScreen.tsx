"use client";

import { useState } from "react";

export default function TerminalScreen() {
  const welcomeMessage = `░▒▓█ welcome to the universe terminal █▓▒░ 

        Type 'help' to see available commands.
        Type 'exit' to return to the homepage.`;

  const [input, setInput] = useState("");

  return (
    <div className="h-full w-full flex flex-col justify-start text-bone">
        <div></div>

        <div className="w-full px-8 py-4 mt-auto border-t border-gray-800">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-black text-bone border-none outline-none"
                placeholder="Enter command here..."
                autoFocus
            />
        </div>
    </div>
  );
}
