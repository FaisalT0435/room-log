// src/pages/api/dashboard.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/session';
import { getDB } from '@/lib/db';

export default withSessionRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const db = getDB();

  // 1) Counts per month
  const [countRows] = await db.query<any[]>(
    `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS month, COUNT(*) AS count
     FROM Logbook
     GROUP BY month
     ORDER BY month`
  );

  // 2) Visits per department
  const [deptRows] = await db.query<any[]>(
    `SELECT department, COUNT(*) AS visits
     FROM Logbook
     GROUP BY department`
  );

  // 3) Summary values
  const [[summaryRow]] = await db.query<any[]>(
    `SELECT
       SUM(CASE WHEN DATE_FORMAT(timestamp, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m') THEN 1 ELSE 0 END) AS thisMonthCount,
       SUM(CASE WHEN DATE_FORMAT(timestamp, '%Y')   = DATE_FORMAT(NOW(), '%Y')   THEN 1 ELSE 0 END) AS yearToDateCount
     FROM Logbook`
  );

  // 4) Last 5 check-ins
  const [lastRows] = await db.query<any[]>(
    `SELECT name, department,
            DATE_FORMAT(timestamp, '%Y-%m-%dT%H:%i:%s') AS timestamp
     FROM Logbook
     ORDER BY timestamp DESC
     LIMIT 5`
  );

  return res.status(200).json({
    counts: countRows.map(r => ({ month: r.month, count: Number(r.count) })),
    perDept: deptRows.map(r => ({ department: r.department, visits: Number(r.visits) })),
    summary: {
      thisMonthCount: Number(summaryRow.thisMonthCount),
      yearToDateCount: Number(summaryRow.yearToDateCount),
    },
    last: lastRows.map(r => ({
      name: r.name,
      department: r.department,
      timestamp: r.timestamp,
    })),
  });
});
