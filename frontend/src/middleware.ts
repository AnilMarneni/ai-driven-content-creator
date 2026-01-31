import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value;

    // Define public paths that don't require auth
    const publicPaths = ['/login', '/signup'];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    // If trying to access a protected route without a token
    if (!isPublicPath && !token) {
        // Redirect to login
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If trying to access login/signup WITH a token, redirect to home
    if (isPublicPath && token) {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};
