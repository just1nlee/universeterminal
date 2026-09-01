import { TerminalState, getNodeByPath } from "../helper";

export function run(_: string[], state: TerminalState) {
    const node = getNodeByPath(state.universe, state.currentPath);
    if (!node) return;

    if (node.children.length === 0) {
        state.addHistory("");
    } else {
        state.addHistory(node.children.map(c => c.name).join("  "));
    }
}