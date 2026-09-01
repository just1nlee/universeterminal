import { useEffect, RefObject } from "react";

export function useInputFocus(inputRef: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const maintainFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Focus on mount
    maintainFocus();

    // Re-focus when clicking anywhere on the terminal
    const handleClick = () => {
      maintainFocus();
    };

    // Re-focus when the input loses focus
    const handleBlur = () => {
      setTimeout(maintainFocus, 0);
    };

    // Add event listeners
    document.addEventListener("click", handleClick);
    const currentInput = inputRef.current;
    if (currentInput) {
      currentInput.addEventListener("blur", handleBlur);
    }

    return () => {
      document.removeEventListener("click", handleClick);
      if (currentInput) {
        currentInput.removeEventListener("blur", handleBlur);
      }
    };
  }, [inputRef]);
}
