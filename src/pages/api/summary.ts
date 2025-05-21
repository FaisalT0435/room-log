// File: src/pages/api/summary.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/session';
import { getDB } from '@/lib/db';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client for presigned URL generation
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET!;

interface Entry {
  id: number;
  name: string;
  nik: string;
  department: string;
  remarks: string | null;
  photoUrl: string;
  timestamp: string;
}

export default withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = getDB();
    const [rows] = await db.query<any[]>(
      `SELECT
         id,
         name,
         nik,
         department,
         remarks,
         photo_url AS photoKey,
         DATE_FORMAT(timestamp, '%Y-%m-%dT%H:%i:%s') AS timestamp
       FROM Logbook
       ORDER BY timestamp DESC`
    );

    const entries: Entry[] = await Promise.all(
      rows.map(async r => {
        let url = '';
        if (r.photoKey) {
          // If photoKey already is a full URL, use it; otherwise generate presigned URL
          if (/^https?:\/\//.test(r.photoKey)) {
            url = r.photoKey;
          } else {
            const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: r.photoKey });
            url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
          }
        }
        return {
          id: r.id,
          name: r.name,
          nik: r.nik,
          department: r.department,
          remarks: r.remarks,
          photoUrl: url,
          timestamp: r.timestamp,
        };
      })
    );

    return res.status(200).json({ entries });
  } catch (err: any) {
    console.error('/api/summary error:', err);
    return res.status(500).json({ error: 'Failed to load summary' });
  }
});
