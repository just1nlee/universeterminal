import { useState, useEffect } from "react";

export function useUniverseId() {
  const [universeId, setUniverseId] = useState<string | null>(null);

  useEffect(() => {
    let id = sessionStorage.getItem("universe_id");
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "u" + Date.now();
      sessionStorage.setItem("universe_id", id);
    }
    setUniverseId(id);
  }, []);

  const resetUniverseId = () => {
    const newId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : "u" + Date.now();
    sessionStorage.setItem("universe_id", newId);
    setUniverseId(newId);
  };

  return { universeId, setUniverseId, resetUniverseId };
}
