import { TerminalState } from "../helper";

export function run(_:string[], state: TerminalState) {
    state.addHistory(
`
available commands:
help        - list available commands
clear       - clear the terminal
ls          - list contents of current directory
pwd         - print working directory
tree        - display explored universe
cd <dir>    - change directory
info        - info about current directory
bigbang     - reset the universe
exit        - exit terminal session
`
    );
}
