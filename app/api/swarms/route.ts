import { NextResponse } from 'next/server';
import { SwarmInfo } from '@/components/swarms/swarm.types';

export async function GET() {
  try {
    // TODO: Replace with actual DB query once Prisma is set up
    const swarms: SwarmInfo[] = [];
    return NextResponse.json(swarms);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch swarms' },
      { status: 500 }
    );
  }
}
