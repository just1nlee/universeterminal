import { LambdaResponse } from "@/types/api";

export async function executeCommand(
  universeId: string,
  command: string,
  temperature: number
): Promise<string> {
  try {
    const res = await fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        universe_id: universeId,
        command,
        temperature,
      }),
    });

    const data: LambdaResponse = await res.json();

    if (!res.ok) {
      return "error" in data ? data.error : `Error ${res.status}`;
    } else {
      return "message" in data ? data.message : "No output";
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return `Error: ${err.message}`;
    } else {
      return "Unknown error";
    }
  }
}
