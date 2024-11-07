import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRoutes, protectedRoutes } from './routes/config';
import { IS_USER_AUTH } from './constants/cookies';
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(IS_USER_AUTH)?.value;
  // const guestToken = request.cookies.get(GUEST_TOKEN)?.value;
  if (
    protectedRoutes.includes(request.nextUrl.pathname) &&
    (!accessToken || Date.now() > JSON.parse(accessToken).expiredAt)
  ) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    return response;
  }
  if (authRoutes.includes(request.nextUrl.pathname) && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
