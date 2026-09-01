"use client";

import Terminal from "../terminal/Terminal";
import Background from "../ui/Background";

export default function TerminalScreen({ onNext }: { onNext: () => void }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="border-[3px] border-bone aspect-[912/610] max-w-[912px] w-full overflow-hidden">
                <Terminal onNext={onNext} />
            </div>
        </div>
    );
}