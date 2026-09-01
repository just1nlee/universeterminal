import { useState, useRef, useEffect } from "react";

export function useTerminalHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const terminalContentRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop =
        terminalContentRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const addToHistory = (line: string | string[]) => {
    setHistory((prev) => [...prev, ...(Array.isArray(line) ? line : [line])]);
  };

  const clearHistory = () => setHistory([]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    history,
    setHistory,
    addToHistory,
    clearHistory,
    terminalContentRef,
    isLoading,
    startLoading,
    stopLoading,
  };
}
