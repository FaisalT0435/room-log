// // src/lib/session.ts
// import type { IronSessionOptions } from 'iron-session';
// import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

// const sessionOptions: IronSessionOptions = {
//   password: process.env.SESSION_PASSWORD!,
//   cookieName: 'logbook_session',
//   cookieOptions: { secure: process.env.NODE_ENV === 'production' },
// };

// type User = { username: string; role: 'admin' };

// declare module 'iron-session' {
//   interface IronSessionData {
//     user?: User;
//   }
// }

// export function withSessionRoute(handler: any) {
//   return withIronSessionApiRoute(handler, sessionOptions);
// }
// export function withSessionSsr(handler: any) {
//   return withIronSessionSsr(handler, sessionOptions);
// }

// src/lib/session.ts
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import type { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: 'logbook_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function withSessionRoute(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler: any) {
  return withIronSessionSsr(handler, sessionOptions);
}
