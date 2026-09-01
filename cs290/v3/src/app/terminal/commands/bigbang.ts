import { TerminalState, getNodeByPath } from "../helper";

export async function run(args: string[], state: TerminalState) {
    await fetch("/api/universe/reset", { method: "POST" });
    const newUniverse = await fetch("/api/universe").then(r => r.json());

    state.setUniverse(newUniverse);
    state.setCurrentPath(["/"]);
    state.addHistory("universe cleared");
}