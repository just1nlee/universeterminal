"use client";

import React from "react";
import { useUniverseId } from "../hooks/useUniverseId";
import { useTerminalHistory } from "../hooks/useTerminalHistory";
import { useCursor } from "../hooks/useCursor";
import { useInputFocus } from "../hooks/useInputFocus";
import { useTerminalInput } from "../hooks/useTerminalInput";
import { validateCommand } from "../utils/commands";
import { createBuiltInCommands } from "../utils/builtInCommands";
import { executeCommand } from "../services/terminalApi";
import TerminalInput from "./TerminalInput";

export default function TerminalScreen({
  temperature,
  onNext,
}: {
  temperature: number;
  onNext: () => void;
}) {
  const { universeId, resetUniverseId } = useUniverseId();
  const { history, addToHistory, clearHistory, terminalContentRef } =
    useTerminalHistory();
  const { input, setInput, clearInput } = useTerminalInput();
  const {
    cursorBlink,
    cursorPosition,
    inputRef,
    handleKeyDown,
    handleInputClick,
  } = useCursor();

  useInputFocus(inputRef);

  const builtInCommands = createBuiltInCommands(
    universeId,
    temperature,
    addToHistory,
    clearHistory,
    resetUniverseId,
    onNext
  );

  // Command event handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    // Add the command to history
    addToHistory(`* ${input}`);

    const [cmd, ...args] = input.trim().split(" ");

    // Validate command syntax before sending
    const validationError = validateCommand(cmd, args);
    if (validationError) {
      addToHistory(validationError);
      clearInput();
      return;
    }

    // Check if it's a UI-only command
    if (builtInCommands[cmd]) {
      if (cmd === "clear") {
        // Reset history
        clearHistory();
      } else {
        const output = await builtInCommands[cmd](...args);
        if (output) {
          addToHistory(Array.isArray(output) ? output : [output]);
        }
      }
      clearInput();
      return;
    }

    // Otherwise, send to API Gateway
    if (universeId) {
      const output = await executeCommand(universeId, input, temperature);
      addToHistory(output);
    }
    clearInput();
  }

  return (
    <div
      className="flex flex-col h-full w-full bg-black text-bone"
      onClick={() => inputRef.current?.focus()}
    >
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
      <TerminalInput
        input={input}
        setInput={setInput}
        cursorPosition={cursorPosition}
        cursorBlink={cursorBlink}
        inputRef={inputRef}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        onClick={handleInputClick}
      />
    </div>
  );
}
