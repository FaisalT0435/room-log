// File: src/pages/api/absen.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { withSessionRoute } from '@/lib/session';
import { getDB } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';

// set up multer to parse multipart/form-data
const upload = multer();
const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(upload.single('photo'));  // expecting `photo` field

export default withSessionRoute(
  handler.post(async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    try {
      const { name, nik, remarks } = req.body;
      const timestamp = new Date();

      // ensure we got a file
      if (!req.file) {
        return res.status(400).json({ ok: false, message: 'Photo is required' });
      }

      // 1) Upload the photo buffer to S3
      const key = `faces/${Date.now()}_${req.file.originalname}`;
      const photoUrl = await uploadToS3(
        req.file.buffer,
        key,
        req.file.mimetype
      );

      // 2) Insert a new logbook record pointing to that S3 URL
      const db = getDB();
      await db.execute(
        `INSERT INTO logbook
         (name, nik, department, remarks, photo_url, timestamp)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          name,
          nik,
          req.session.user.username, // store user as "department"
          remarks,
          photoUrl,
          timestamp
        ]
      );

      return res.status(200).json({ ok: true, photoUrl });
    } catch (error) {
      console.error('🔥 Absen API error:', error);
      return res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  })
);
