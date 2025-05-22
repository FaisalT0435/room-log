import 'iron-session';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      username: string;
      role: string;
      // tambahkan field lain sesuai kebutuhanmu
    };
  }
}
