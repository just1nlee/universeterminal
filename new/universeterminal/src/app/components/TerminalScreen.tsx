"use client";

import React, { useState, useRef, useEffect } from "react";

export default function TerminalScreen({
  temperature,
}: {
  temperature: number;
}) {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const terminalContentRef = useRef<HTMLDivElement | null>(null);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);

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

    // Add user command to history
    setHistory((prev) => [...prev, `* ${input}`]);

    let output = "";

    try {
      // Instead of local if/else logic, send command to API Gateway
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

    // Add output to history
    setHistory((prev) => [...prev, output]);

    // Reset input
    setInput("");
  }

  return (
    <div className="flex flex-col h-full w-full bg-black text-bone">
      {/* History box */}
      <div
        ref={terminalContentRef}
        className="flex-1 overflow-y-auto px-8 py-4 whitespace-pre-wrap text-lg"
      >
        {history.map((line, i) => (
          <div key={i} className="mb-1">
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
