// File: src/app/(protected)/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as BarTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as PieTooltip,
} from 'recharts';

type CountRow = { month: string; count: number };
type LastRow  = { name: string; department: string; timestamp: string };
type DeptRow  = { department: string; visits: number };
type Summary  = { thisMonthCount: number; yearToDateCount: number };

export default function DashboardPage() {
  const [monthlyData, setMonthlyData] = useState<CountRow[]>([]);
  const [deptData, setDeptData]       = useState<DeptRow[]>([]);
  const [lastRows, setLastRows]       = useState<LastRow[]>([]);
  const [summary, setSummary]         = useState<Summary>({ thisMonthCount: 0, yearToDateCount: 0 });

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setMonthlyData(data.counts.map((r: any) => ({ month: r.month, count: Number(r.count) })));
        setDeptData(data.perDept.map((r: any) => ({ department: r.department, visits: Number(r.visits) })));
        setLastRows(data.last || []);
        setSummary({ thisMonthCount: Number(data.summary.thisMonthCount), yearToDateCount: Number(data.summary.yearToDateCount) });
      })
      .catch(console.error);
  }, []);

  // Pie data
  const totalVisits = deptData.reduce((sum, d) => sum + d.visits, 0);
  const pieData = deptData.map(d => ({ name: d.department, value: totalVisits ? (d.visits / totalVisits) * 100 : 0 }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Pengunjung per Bulan</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <BarTooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Persentase per Departemen</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
<PieChart>
  <Pie
    data={pieData}
    dataKey="value"
    nameKey="name"
    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      // Hitung posisi label di tengah slice
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text
          x={x}
          y={y}
          fill="#333"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
        >
          {`${percent ? (percent * 100).toFixed(1) : 0}%`}
        </text>
      );
    }}
    labelLine={false}
  >
    {pieData.map((_, idx) => (
      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
    ))}
  </Pie>
  <Legend layout="horizontal" verticalAlign="bottom" />
  <PieTooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
</PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Ringkasan Bulanan</h2>
          <p>Bulan ini ({new Date().toISOString().slice(0,7)}): <strong>{summary.thisMonthCount}</strong> pengunjung</p>
          <p>Total tahun ini: <strong>{summary.yearToDateCount}</strong> pengunjung</p>
        </div>

        {/* Last Check-Ins */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Last Check-In</h2>
          {lastRows.length > 0 ? (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">No</th>
                  <th className="px-4 py-2 border">Nama</th>
                  <th className="px-4 py-2 border">Departemen</th>
                  <th className="px-4 py-2 border">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {lastRows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{i+1}</td>
                    <td className="px-4 py-2 border">{r.name}</td>
                    <td className="px-4 py-2 border">{r.department}</td>
                    <td className="px-4 py-2 border">{new Date(r.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>
    </div>
  );
}
