import { readUserStateUniverse, writeUserStateUniverse } from '@/lib/helper';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(readUserStateUniverse());
}

export async function POST(request: Request) {
    const updated = await request.json();
    writeUserStateUniverse(updated);
    return NextResponse.json({ ok: true });
}