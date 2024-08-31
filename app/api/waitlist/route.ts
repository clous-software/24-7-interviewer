
// app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { joinWaitlist } from '@/lib/waitlist';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json(); // Assuming email is sent as JSON in the body

    // Validate email if necessary

    const result = await joinWaitlist(email);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in waitlist API route:', error);
    return NextResponse.error();
  }
}
