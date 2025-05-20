import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/session';

export default withSessionRoute((req: NextApiRequest, res: NextApiResponse) => {
  const isLoggedIn = !!req.session.user;
  res.status(200).json({ isLoggedIn, role: req.session.user?.role });
});