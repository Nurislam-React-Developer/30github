import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const { pathname } = request.nextUrl;

	// Auth routes - redirect to home if already logged in
	if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
		if (token) {
			return NextResponse.redirect(new URL('/', request.url));
		}
		return NextResponse.next();
	}

	// Protected routes - redirect to login if not authenticated
	if (!token && !pathname.startsWith('/_next') && !pathname.includes('.')) {
		return NextResponse.redirect(new URL('/signin', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public (public files)
		 */
		'/((?!_next/static|_next/image|favicon.ico|public).*)',
	],
};
