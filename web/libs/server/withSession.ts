import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      userId: string;
      role: string;
    };
  }
}

const cookieOptions = {
  cookieName: 'visionsession',
  password: process.env.COOKIE_PASSWORD!,
  cookieOptions: {
    secure: false,
    // secure: process.env.NODE_ENV === 'production',
  },
  ttl: 60 * 60 * 8,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieOptions);
}
