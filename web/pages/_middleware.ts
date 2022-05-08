import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("You're a bot.", { status: 403 });
  }

  const LOGIN_URL = '/';

  if (!req.url.includes('/api') && !req.url.endsWith('.svg')) {
    if (!req.url.includes(LOGIN_URL) && !req.cookies.sessionId) {
      return NextResponse.redirect(`${req.nextUrl.origin}${LOGIN_URL}`);
    }
  }
}
