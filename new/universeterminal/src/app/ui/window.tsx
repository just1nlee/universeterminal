'use client';

import { Rnd } from 'react-rnd';

export default function Window({ children }: { children: React.ReactNode }) {
    return (
        <Rnd
        default={{
            x: 100,
            y: 100,
            width: 900,
            height: 600,
        }}
        minWidth={500}
        minHeight={300}
        bounds="window"
        dragHandleClassName="drag-handle"
        className="shadow-xl border border-gray-700 bg-black rounded-lg overflow-hidden"
        >
        {children}
        </Rnd>
    );
}