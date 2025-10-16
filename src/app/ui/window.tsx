'use client';

export default function Window({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="w-full max-w-[912px] aspect-[912/610] border-[3px] border-bone flex items-center justify-center relative overflow-hidden">
                {children}
            </div>
        </div>
    );
}