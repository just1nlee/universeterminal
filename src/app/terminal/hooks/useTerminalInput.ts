import { useState } from "react";

export function useTerminalInput() {
  const [input, setInput] = useState("");

  const clearInput = () => setInput("");

  return {
    input,
    setInput,
    clearInput,
  };
}
