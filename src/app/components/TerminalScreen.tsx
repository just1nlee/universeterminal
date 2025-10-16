"use client";

import React, { useState, useRef, useEffect } from "react";
import { LambdaResponse } from "@/types/api";

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

  const commandSchemas: Record<string, { args?: number | "any" | number[] }> = {
    help: { args: 0 },
    clear: { args: 0 },
    exit: { args: 0 },
    ls: { args: [0, 1] },
    pwd: { args: 0 },
    tree: { args: 0 },
    info: { args: 0 },
    echo: { args: "any" }, // allow arbitrary strings
    cd: { args: [1] }, // requires one directory
    cat: { args: [1] }, // requires one filename
    bigbang: { args: 0 },
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

  // Command event handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    // Add the command to history
    setHistory((prev) => [...prev, `* ${input}`]);

    const [cmd, ...args] = input.trim().split(" ");

    // Validate command syntax before sending
    if (commandSchemas[cmd]) {
      const schema = commandSchemas[cmd];
      const argSchema = schema.args;
      if (argSchema !== undefined && argSchema !== "any") {
        if (Array.isArray(argSchema)) {
          if (!argSchema.includes(args.length)) {
            setHistory((prev) => [
              ...prev,
              `Syntax error: '${cmd}' expects argument count in [${argSchema.join(
                ", "
              )}], got ${args.length}.`,
            ]);
            setInput("");
            return;
          }
        } else if (typeof argSchema === "number") {
          if (args.length !== argSchema) {
            setHistory((prev) => [
              ...prev,
              `Syntax error: '${cmd}' expects ${argSchema} argument(s), got ${args.length}.`,
            ]);
            setInput("");
            return;
          }
        }
      }
    }

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

    // If command is not in schema at all
    if (!commandSchemas[cmd]) {
      setHistory((prev) => [
        ...prev,
        `universeterminal: command not found: ${cmd}`,
      ]);
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
          universe_id: universeId,
          command: input,
          temperature,
        }),
      });

      const data: LambdaResponse = await res.json();

      if (!res.ok) {
        output = "error" in data ? data.error : `Error ${res.status}`;
      } else {
        output = "message" in data ? data.message : "No output";
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        output = `Error: ${err.message}`;
      } else {
        output = "Unknown error";
      }
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
