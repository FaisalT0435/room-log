// File: src/pages/api/absen.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { withSessionRoute } from '@/lib/session';
import { runMiddleware } from '@/lib/run-middleware';
import { getDB } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';

const upload = multer();  // in‐memory storage

export default withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  // 1) Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }
  // 2) Auth
  if (!req.session.user) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }

  // 3) Parse multipart form
  try {
    await runMiddleware(req, res, upload.single('photo'));
  } catch (err: any) {
    console.error('⚠️ Multer parsing error:', err);
    return res.status(400).json({ ok: false, message: 'Error parsing file' });
  }

  // 4) Validate inputs
  const { name, nik, department, remarks, timestamp } = req.body;
  if (!name || !nik || !department || !timestamp) {
    return res.status(400).json({ ok: false, message: 'Missing form fields' });
  }
  if (!req.file) {
    return res.status(400).json({ ok: false, message: 'Photo is required' });
  }

  try {
    // 5) Upload to S3
    const key = `faces/${Date.now()}_${req.file.originalname}`;
    const photoUrl = await uploadToS3(req.file.buffer, key, req.file.mimetype);

    // 6) Insert into MySQL
    const db = getDB();
    await db.execute(
      `INSERT INTO Logbook
         (name, nik, department, remarks, photo_url, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        nik,
        department,
        remarks || null,
        photoUrl,
        new Date(timestamp),
      ]
    );

    return res.status(200).json({ ok: true, photoUrl });
  } catch (err: any) {
    console.error('🔥 Absen handler error:', err);
    return res
      .status(500)
      .json({ ok: false, message: err.message || 'Internal server error' });
  }
});

// Disable Next.js built‐in body parser so Multer can run
export const config = {
  api: {
    bodyParser: false,
  },
};
