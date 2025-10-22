import { useEffect, useRef, useState } from "react";

export function useTerminalHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const terminalContentRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop =
        terminalContentRef.current.scrollHeight;
    }
  }, [history]);

  const addToHistory = (line: string | string[]) => {
    setHistory((prev) => [...prev, ...(Array.isArray(line) ? line : [line])]);
  };

  const clearHistory = () => setHistory([]);

  return {
    history,
    setHistory,
    addToHistory,
    clearHistory,
    terminalContentRef,
  };
}
