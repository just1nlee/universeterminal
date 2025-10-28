import { executeCommand } from "../services/terminalApi";

export function createBuiltInCommands(
  universeId: string | null,
  temperature: number,
  addToHistory: (line: string | string[]) => void,
  clearHistory: () => void,
  resetUniverseId: () => void,
  onNext: () => void
) {
  const builtInCommands: Record<
    string,
    (
      ...args: string[]
    ) => string | string[] | void | Promise<string | string[] | void>
  > = {
    help: () => {
      return [
        "available commands:",
        "help        - list available commands",
        "clear       - clear the terminal",
        "ls          - list files and directories",
        "pwd         - print working directory",
        "tree        - display explored universe",
        "cd <dir>    - change directory",
        "cat <file>   - display file contents",
        "info        - info about current directory",
        "bigbang     - reset the universe",
        "exit        - reset the universe and exit terminal",
      ];
    },
    clear: () => {
      // special: handled directly in submit
      return "";
    },
    exit: async () => {
      // Reset the universe in Lambda first
      if (universeId) {
        try {
          await executeCommand(universeId, "bigbang", temperature);
        } catch (err) {
          console.error("Error resetting universe:", err);
        }
      }

      // Generate new universe ID
      resetUniverseId();

      // Clear terminal history
      clearHistory();

      // Exit to next screen
      onNext();
    },
  };

  return builtInCommands;
}
