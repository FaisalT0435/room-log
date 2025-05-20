// src/pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/session';

export default withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('▶ Login attempt:', req.method, req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    req.session.user = { username, role: 'admin' };
    await req.session.save();
    console.log('✅ Login success for', username);
    return res.status(200).json({ ok: true });
  }

  console.log('❌ Login failed for', username);
  return res.status(401).json({ ok: false, message: 'Invalid credentials' });
});
