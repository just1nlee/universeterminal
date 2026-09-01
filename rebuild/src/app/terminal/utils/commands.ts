export const commandSchemas: Record<
  string,
  { args?: number | "any" | number[] }
> = {
  help: { args: 0 },
  clear: { args: 0 },
  exit: { args: 0 },
  ls: { args: [0, 1] },
  pwd: { args: 0 },
  tree: { args: 0 },
  info: { args: 0 },
  cd: { args: [0, 1] },
  cat: { args: [1] },
  bigbang: { args: 0 },
};

export function validateCommand(cmd: string, args: string[]): string | null {
  if (!commandSchemas[cmd]) {
    return `universeterminal: command not found: ${cmd}`;
  }

  const schema = commandSchemas[cmd];
  const argSchema = schema.args;

  if (argSchema !== undefined && argSchema !== "any") {
    if (Array.isArray(argSchema)) {
      if (!argSchema.includes(args.length)) {
        return `Syntax error: '${cmd}' expects argument count in [${argSchema.join(
          ", "
        )}], got ${args.length}.`;
      }
    } else if (typeof argSchema === "number") {
      if (args.length !== argSchema) {
        return `Syntax error: '${cmd}' expects ${argSchema} argument(s), got ${args.length}.`;
      }
    }
  }

  return null; // Valid command
}
