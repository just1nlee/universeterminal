import { useState } from "react";

export function useInputLocked() {
  const [isLocked, setIsLocked] = useState(false);

  const lockInput = () => setIsLocked(true);
  const unlockInput = () => setIsLocked(false);

  return {
    isLocked,
    lockInput,
    unlockInput,
    setIsLocked,
  };
}
