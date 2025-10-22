import React from "react";

interface TerminalInputProps {
  input: string;
  setInput: (value: string) => void;
  cursorPosition: number;
  cursorBlink: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

export default function TerminalInput({
  input,
  setInput,
  cursorPosition,
  cursorBlink,
  inputRef,
  onSubmit,
  onKeyDown,
  onClick,
}: TerminalInputProps) {
  return (
    <form
      onSubmit={onSubmit}
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
            onKeyDown={onKeyDown}
            onClick={onClick}
            autoFocus
          />
        </div>
      </div>
    </form>
  );
}
