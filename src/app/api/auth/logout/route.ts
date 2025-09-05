import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
  
  // Supprimer le cookie du token en le faisant expirer
  response.cookies.set('authToken', '', {
    expires: new Date(0),
    path: '/'
  });
  
  return response;
}
