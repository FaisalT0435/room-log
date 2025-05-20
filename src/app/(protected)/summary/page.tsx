'use client';
import { useEffect,useState } from 'react';

export default function SummaryPage() {
  const [perUser,setPerUser]=useState<any[]>([]);
  const [perDept,setPerDept]=useState<any[]>([]);

  useEffect(() => { fetch('/api/summary').then(r=>r.json()).then(d=>{setPerUser(d.perUser);setPerDept(d.perDept);}); }, []);

  return (
    <section>
      <h1 className="text-xl font-semibold mb-4">Summary per User</h1>
      <ul className="list-disc ml-5 mb-6">{perUser.map(u=><li key={u.nik}>{u.name} ({u.nik}): {u.visits} kali</li>)}</ul>
      <h1 className="text-xl font-semibold mb-4">Summary per Departemen</h1>
      <ul className="list-disc ml-5">{perDept.map(d=><li key={d.department}>{d.department}: {d.visits} kali</li>)}</ul>
    </section>
  );
}