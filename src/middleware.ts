import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isPublicRoute = request.nextUrl.pathname.startsWith('/_next') || 
                       request.nextUrl.pathname.startsWith('/favicon.ico');
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // API routes protection (except auth endpoints)
  if (isApiRoute) {
    if (!request.nextUrl.pathname.startsWith('/api/auth')) {
      if (!token) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
      }

      // Add token to Authorization header for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${token.value}`);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    return NextResponse.next();
  }

  // Auth pages redirect to home if already authenticated
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protected routes redirect to /login if not authenticated
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
