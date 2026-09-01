import { TerminalState } from "../helper";

export function run(_:string[], state: TerminalState) {
    state.clearHistory();
}
