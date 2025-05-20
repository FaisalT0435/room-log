'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [counts, setCounts] = useState<{date:string;count:number}[]>([]);
  const [last, setLast] = useState<any>({});

  useEffect(() => { fetch('/api/dashboard').then(r=>r.json()).then(d=>{setCounts(d.counts);setLast(d.last);}); }, []);

  return (
    <section>
      <h1 className="text-xl font-semibold mb-4">Dashboard (30 hari terakhir)</h1>
      <ul className="list-disc ml-5 mb-6">{counts.map(c=><li key={c.date}>{c.date}: {c.count}</li>)}</ul>
      <h2 className="text-lg font-medium">Last Check-In</h2>
      <p className="mt-2">{last.name} at {new Date(last.timestamp).toLocaleString()} ({last.department})</p>
    </section>
  );
}