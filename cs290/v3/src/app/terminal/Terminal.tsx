"use client";

import { useState, useEffect } from "react";
import { TerminalState, Node } from "./helper";
import * as help from "./commands/help";
import * as ls from "./commands/ls";
import * as cd from "./commands/cd";
import * as pwd from "./commands/pwd";
import * as clear from "./commands/clear";
import * as bigbang from "./commands/bigbang";
import * as exit from "./commands/exit";

type Command = {
    run: (args: string[], state: TerminalState) => void;
}

const commands: Record<string, Command> = {
    help,
    ls,
    cd,
    pwd,
    clear,
    bigbang,
    exit,
}

async function runCommand(input: string, state: TerminalState) {
    if (!input.trim()) return;
    const [cmd, ...args] = input.trim().split(" ");
    state.addHistory(`${input}`);

    const command = commands[cmd];
    if (!command) {
        state.addHistory(`command ${cmd} not found`);
        return;
    }

    await command.run(args, state);
}

export default function Terminal({ onNext }: { onNext: () => void }) {
    const [universe, setUniverse] = useState<Node>({
        name: "/",
        explored: true,
        children: [],
      });
    useEffect(() => {
        (async () => {
            try {
                await fetch("/api/universe/reset", { method: "POST" });

                const res = await fetch("/api/universe");
                const data = await res.json();
                setUniverse(data);
            }
            catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const [currentPath, setCurrentPath] = useState<string[]>(["/"]);
    const [history, setHistory] = useState<string[]>([]);
    const [input, setInput] = useState("");

    const terminalState: TerminalState = {
        universe,
        setUniverse,
        currentPath,
        setCurrentPath,
        history,
        addHistory: (line: string) =>
          setHistory((h) => [...h, line]),
        clearHistory: () => setHistory([]),
        onNext,
    };
    
    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim()) return;
        runCommand(input, terminalState);
        setInput("");
    }

    return (
       <div className="flex flex-col h-full w-full bg-black text-bone">
            <div className="flex-1 overflow-y-auto px-8 py-4 whitespace-pre-wrap text-lg leading-tight">
                {history.map((line, i) => (
                    <div key={i} className="mb-0.5">{line}</div>
                ))}
            </div>

            <form onSubmit={onSubmit} className="px-8 py-4 border-t border-gray-800">
                <div className="flex items-center text-lg">
                    <span className="mr-2 text-bone">*</span>
                    <input 
                        autoFocus 
                        className="flex-1 bg-transparent outline-none text-bone" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                    />
                </div>
            </form>
       </div>
    )
}