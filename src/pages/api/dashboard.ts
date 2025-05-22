// // src/pages/api/dashboard.ts

// import type { NextApiRequest, NextApiResponse } from 'next';
// import { withSessionRoute } from '@/lib/session';
// import { getDB } from '@/lib/db';

// export default withSessionRoute(async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const db = getDB();

//   // 1) Counts per month
//   const [countRows] = await db.query<any[]>(
//     `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS month, COUNT(*) AS count
//      FROM Logbook
//      GROUP BY month
//      ORDER BY month`
//   );

//   // 2) Visits per department
//   const [deptRows] = await db.query<any[]>(
//     `SELECT department, COUNT(*) AS visits
//      FROM Logbook
//      GROUP BY department`
//   );

//   // 3) Summary values
//   const [[summaryRow]] = await db.query<any[]>(
//     `SELECT
//        SUM(CASE WHEN DATE_FORMAT(timestamp, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m') THEN 1 ELSE 0 END) AS thisMonthCount,
//        SUM(CASE WHEN DATE_FORMAT(timestamp, '%Y')   = DATE_FORMAT(NOW(), '%Y')   THEN 1 ELSE 0 END) AS yearToDateCount
//      FROM Logbook`
//   );

//   // 4) Last 5 check-ins
//   const [lastRows] = await db.query<any[]>(
//     `SELECT name, department,
//             DATE_FORMAT(timestamp, '%Y-%m-%dT%H:%i:%s') AS timestamp
//      FROM Logbook
//      ORDER BY timestamp DESC
//      LIMIT 5`
//   );

//   return res.status(200).json({
//     counts: countRows.map(r => ({ month: r.month, count: Number(r.count) })),
//     perDept: deptRows.map(r => ({ department: r.department, visits: Number(r.visits) })),
//     summary: {
//       thisMonthCount: Number(summaryRow.thisMonthCount),
//       yearToDateCount: Number(summaryRow.yearToDateCount),
//     },
//     last: lastRows.map(r => ({
//       name: r.name,
//       department: r.department,
//       timestamp: r.timestamp,
//     })),
//   });
// });
import type { NextApiRequest, NextApiResponse } from 'next';
import {getDB} from '@/lib/db'; // pastikan ini return pool/promise

type Data = {
  counts: { period: string; count: number }[];
  perDept: { department: string; visits: number }[];
  summary: { thisMonthCount: number; yearToDateCount: number };
  last: { name: string; department: string; timestamp: string }[];
};

function getStartOfMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}
function getStartOfYear() {
  const now = new Date();
  return `${now.getFullYear()}-01-01`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: string }>) {
  const group = req.query.group === 'day' ? 'day' : 'month'; // default: month

  try {
    const db = await getDB();

    // 1. Count per period (bar chart)
    let periodFormat = group === 'day' ? '%Y-%m-%d' : '%Y-%m';
    const [countsRows] = await db.execute(
      `SELECT DATE_FORMAT(timestamp, ?) AS period, COUNT(*) AS count
       FROM Logbook
       GROUP BY period
       ORDER BY period`,
      [periodFormat]
    );
    // rows in mysql2 are arrays, so cast to any[]
    const counts = (countsRows as any[]).map(r => ({
      period: r.period,
      count: Number(r.count)
    }));

    // 2. Count per department (pie chart)
    const [deptRows] = await db.execute(
      `SELECT department, COUNT(*) AS visits
       FROM Logbook
       GROUP BY department
       ORDER BY visits DESC`
    );
    const perDept = (deptRows as any[]).map(r => ({
      department: r.department,
      visits: Number(r.visits)
    }));

    // 3. Summary
    const [monthRow] = await db.execute(
      `SELECT COUNT(*) as cnt
         FROM Logbook
        WHERE timestamp >= ?`,
      [getStartOfMonth()]
    );
    const [yearRow] = await db.execute(
      `SELECT COUNT(*) as cnt
         FROM Logbook
        WHERE timestamp >= ?`,
      [getStartOfYear()]
    );
    const thisMonthCount = Number((monthRow as any[])[0]?.cnt ?? 0);
    const yearToDateCount = Number((yearRow as any[])[0]?.cnt ?? 0);

    // 4. Last check-in (5 terbaru)
    const [lastRows] = await db.execute(
      `SELECT name, department, timestamp
         FROM Logbook
        ORDER BY timestamp DESC
        LIMIT 5`
    );
    const last = (lastRows as any[]).map(r => ({
      name: r.name,
      department: r.department,
      timestamp: r.timestamp
    }));

    res.json({
      counts,
      perDept,
      summary: {
        thisMonthCount,
        yearToDateCount
      },
      last
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
}
