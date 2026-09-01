export type Node = {
    name: string;
    explored: boolean;
    children: Node[];
}

export type TerminalState = {
    universe: Node;
    setUniverse: (universe: Node) => void;
    currentPath: string[];
    setCurrentPath: (path: string[]) => void;
    history: string[];
    addHistory: (line: string) => void;
    clearHistory: () => void;
    onNext: () => void;
}

export function getNodeByPath(root: Node, path: string[]): Node | null {
    let node = root;
  
    for (let i = 1; i < path.length; i++) {
      const next = node.children.find(c => c.name === path[i]);
      if (!next) return null;
      node = next;
    }
  
    return node;
}