"use client";

import React, { useState, useRef, useEffect } from "react";

export default function TerminalScreen({
  temperature,
  onNext,
}: {
  temperature: number;
  onNext: () => void;
}) {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const terminalContentRef = useRef<HTMLDivElement | null>(null);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [universeId, setUniverseId] = useState<string | null>(null);

  // On mount, generate or reuse a universeId
  useEffect(() => {
    let id = sessionStorage.getItem("universe_id");
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "u" + Date.now(); // fallback
      sessionStorage.setItem("universe_id", id);
    }
    setUniverseId(id);
  }, []);

  const builtInCommands: Record<
    string,
    (...args: string[]) => string | string[] | void
  > = {
    help: () => {
      return [
        "available commands:",
        "help        - list available commands",
        "clear       - clear the terminal",
        "ls          - list files and directories",
        "pwd         - print working directory",
        "tree        - display explored universe",
        "cd <dir>    - change directory",
        "cat <file>   - display file contents",
        "echo <str>  - echo text",
        "info        - info about current directory",
        "bigbang     - reset the universe",
        "exit        - exit terminal and return to homepage",
      ];
    },
    clear: () => {
      // special: handled directly in submit
      return "";
    },
    exit: () => {
      onNext();
    },
  };

  // Blinking cursor effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, []);

  // Keep cursorPosition synced with input
  useEffect(() => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  }, [input]);

  // Scroll to bottom whenever history changes
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop =
        terminalContentRef.current.scrollHeight;
    }
  }, [history]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    // Add the command to history
    setHistory((prev) => [...prev, `* ${input}`]);

    const [cmd, ...args] = input.trim().split(" ");

    // Check if it's a UI-only command
    if (builtInCommands[cmd]) {
      if (cmd === "clear") {
        // Reset history
        setHistory([]);
      } else {
        const output = builtInCommands[cmd](...args);
        if (output) {
          setHistory((prev) => [
            ...prev,
            ...(Array.isArray(output) ? output : [output]),
          ]);
        }
      }
      setInput("");
      return;
    }

    // Otherwise, send to API Gateway
    let output = "";
    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: input,
          temperature,
        }),
      });

      if (!res.ok) {
        output = `Error ${res.status}`;
      } else {
        const data = await res.json();
        output = data.message || JSON.stringify(data);
      }
    } catch (err: any) {
      output = `Error: ${err.message}`;
    }

    setHistory((prev) => [...prev, output]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-full w-full bg-black text-bone">
      {/* History box */}
      <div
        ref={terminalContentRef}
        className="flex-1 overflow-y-auto px-8 py-4 whitespace-pre-wrap text-lg leading-tight"
      >
        {history.map((line, i) => (
          <div key={i} className="mb-0.5">
            {line}
          </div>
        ))}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="w-full px-8 py-4 border-t border-gray-800"
      >
        <div className="flex items-center text-lg">
          <span className="mr-2 text-bone">*</span>
          <div className="flex-1 relative">
            <span className="whitespace-pre">
              {input.substring(0, cursorPosition)}
            </span>
            <span
              className={`h-5 w-2 bg-bone inline-block align-middle ${
                cursorBlink ? "opacity-100" : "opacity-0"
              }`}
            ></span>
            <span className="whitespace-pre">
              {input.substring(cursorPosition)}
            </span>
            <input
              ref={inputRef}
              type="text"
              className="opacity-0 absolute top-0 left-0 w-full h-full bg-transparent border-none outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </form>
    </div>
  );
}
