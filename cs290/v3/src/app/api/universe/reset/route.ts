import { resetUserStateUniverse } from '@/lib/helper';
import { NextResponse } from 'next/server';

export async function POST() {
    resetUserStateUniverse();
    return NextResponse.json({ ok: true });
}