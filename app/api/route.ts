import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    status: 'ok',
    message: 'Habit Tracker API is running',
    version: '1.0.0',
  });
}
