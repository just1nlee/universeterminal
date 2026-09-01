"use client";

import React from "react";
import { useUniverseId } from "../hooks/useUniverseId";
import { useTerminalHistory } from "../hooks/useTerminalHistory";
import { useCursor } from "../hooks/useCursor";
import { useInputFocus } from "../hooks/useInputFocus";
import { useTerminalInput } from "../hooks/useTerminalInput";
import { useInputLocked } from "../hooks/useInputLocked";
import { validateCommand } from "../utils/commands";
import { createBuiltInCommands } from "../utils/builtInCommands";
import { executeCommand } from "../services/terminalApi";
import TerminalInput from "./TerminalInput";
import LoadingSpinner from "./LoadingIndicator";

export default function TerminalScreen({
  temperature,
  onNext,
}: {
  temperature: number;
  onNext: () => void;
}) {
  const { universeId, resetUniverseId } = useUniverseId();
  const {
    history,
    addToHistory,
    clearHistory,
    terminalContentRef,
    isLoading,
    startLoading,
    stopLoading,
  } = useTerminalHistory();
  const { input, setInput, clearInput } = useTerminalInput();
  const {
    cursorBlink,
    cursorPosition,
    inputRef,
    handleKeyDown,
    handleInputClick,
  } = useCursor();
  const { isLocked, lockInput, unlockInput } = useInputLocked();

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
    if (!input.trim() || isLocked) return;

    // Add the command to history
    addToHistory(`* ${input}`);

    // Clear input and lock it immediately
    const currentInput = input;
    clearInput();
    lockInput();

    const [cmd, ...args] = currentInput.trim().split(" ");

    try {
      // Validate command syntax before sending
      const validationError = validateCommand(cmd, args);
      if (validationError) {
        addToHistory(validationError);
        return;
      }

      // Check if it's a UI-only command (these are instant)
      if (builtInCommands[cmd]) {
        if (cmd === "clear") {
          clearHistory();
        } else {
          const output = await builtInCommands[cmd](...args);
          if (output) {
            addToHistory(Array.isArray(output) ? output : [output]);
          }
        }
        return;
      }

      // For API commands, show loading and send to server
      if (universeId) {
        startLoading();
        const output = await executeCommand(
          universeId,
          currentInput,
          temperature
        );
        stopLoading();
        addToHistory(output);
      }
    } catch (error) {
      stopLoading();
      addToHistory(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      // Always unlock input when done
      unlockInput();
    }
  }

  return (
    <div
      className="flex flex-col h-full w-full bg-black text-bone"
      onClick={() => !isLocked && inputRef.current?.focus()}
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
        {/* Loading spinner */}
        {isLoading && (
          <div className="mb-0.5">
            <LoadingSpinner />
          </div>
        )}
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
        isLocked={isLocked}
      />
    </div>
  );
}
