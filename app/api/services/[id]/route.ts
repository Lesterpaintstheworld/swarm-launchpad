import { NextResponse } from 'next/server';
import { getService } from '@/data/services/services';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const service = getService(params.id);
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error in /api/services/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}
