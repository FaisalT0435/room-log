// File: src/pages/api/forgot-password.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/session';

export default withSessionRoute(
  (req: NextApiRequest, res: NextApiResponse) => {
    const { username } = req.body;
    // TODO: logic pengiriman email/OTP/atau lainnya bisa di sini
    res.status(200).json({
      ok: true,
      message: 'Reset link sent if user exists.'
    });
  }
);
