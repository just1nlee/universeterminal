import { TerminalState, getNodeByPath } from "../helper";

export async function run(args: string[], state: TerminalState) {
    const target = args[0];
    if (!target) return state.addHistory("usage: cd <dir>");

    if (target ===".") {
        return;
    }

    if (target === "..") {
        if (state.currentPath.length > 1) {
        state.setCurrentPath(state.currentPath.slice(0, -1));
        }
        return;
    }

    const node = getNodeByPath(state.universe, state.currentPath);
    const next = node?.children.find(c => c.name === target);
    if (!next) return state.addHistory("directory not found");

    next.explored = true;
    state.setUniverse({ ...state.universe });
    state.setCurrentPath([...state.currentPath, target]);

    await fetch("/api/universe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.universe)
    });
}