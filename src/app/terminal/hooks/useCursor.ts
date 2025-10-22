import { useState, useEffect, useRef } from "react";

export function useCursor() {
  const [cursorBlink, setCursorBlink] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, []);

  // Update cursor position when input changes
  const updateCursorPosition = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setTimeout(() => {
      setCursorPosition(target.selectionStart || 0);
    }, 0);
  };

  const handleInputClick = () => {
    updateCursorPosition();
  };

  return {
    cursorBlink,
    cursorPosition,
    setCursorPosition,
    inputRef,
    handleKeyDown,
    handleInputClick,
    updateCursorPosition,
  };
}
