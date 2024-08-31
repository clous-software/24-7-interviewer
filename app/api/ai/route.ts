import { NextResponse } from 'next/server';
import { createRiverRequest } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!(audioFile instanceof File)) {
      throw new Error('Expected a file but received: ' + typeof audioFile);
    }

    const result = await createRiverRequest(formData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.error();
  }
}
