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
  Tooltip as PieTooltip
} from 'recharts';

interface DayCount { date: string; count: number }
interface Last { name: string; timestamp: string; department: string }
interface Dept { department: string; visits: number }

export default function DashboardPage() {
  const [dayCounts, setDayCounts] = useState<DayCount[]>([]);
  const [deptData, setDeptData] = useState<Dept[]>([]);
  const [last, setLast] = useState<Last | null>(null);

  // Fetch data
  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(({ counts, last }) => {
        setDayCounts(counts as DayCount[]);
        setLast(last as Last);
      });
    fetch('/api/summary')
      .then(r => r.json())
      .then(({ perDept }) => {
        setDeptData(perDept as Dept[]);
      });
  }, []);

  // Build monthly totals
  const monthMap: Record<string, number> = {};
  dayCounts.forEach(({ date, count }) => {
    const m = date.slice(0, 7); // "YYYY-MM"
    monthMap[m] = (monthMap[m] || 0) + count;
  });
  const monthlyData = Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Year-to-date and current/previous month comparisons
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = prev.toISOString().slice(0, 7);

  const currentCount = monthMap[currentMonth] || 0;
  const prevCount = monthMap[prevMonth] || 0;
  const yearTotal = Object.entries(monthMap)
    .filter(([m]) => m.slice(0, 4) === String(now.getFullYear()))
    .reduce((sum, [, c]) => sum + c, 0);
  const delta = prevCount
    ? Math.round(((currentCount - prevCount) / prevCount) * 100)
    : null;

  // Pie chart data (dept percentage)
  const totalVisits = deptData.reduce((sum, d) => sum + d.visits, 0);
  const pieData = deptData.map(d => ({
    name: d.department,
    value: totalVisits ? (d.visits / totalVisits) * 100 : 0
  }));
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Top row: charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar chart: monthly visitors */}
        <div className="bg-white p-4 rounded shadow h-96">
          <h2 className="text-lg mb-2">Pengunjung per Bulan</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <BarTooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart: dept percentage */}
        <div className="bg-white p-4 rounded shadow h-96">
          <h2 className="text-lg mb-2">Persentase per Departemen</h2>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <PieTooltip formatter={(val: number) => `${val.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: summary & last check-in */}
      <div className="grid grid-cols-2 gap-6">
        {/* Summary per bulan */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg mb-4">Ringkasan Bulanan</h2>
          <p><strong>Bulan ini ({currentMonth}):</strong> {currentCount} pengunjung</p>
          <p><strong>Total tahun ini:</strong> {yearTotal} pengunjung</p>
          {delta !== null && (
            <p>
              <strong>Perbandingan vs bulan lalu:</strong>{' '}
              {delta >= 0 ? '+' : ''}{delta}% ({prevMonth})
            </p>
          )}
        </div>

        {/* Last check-in */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg mb-4">Last Check-In</h2>
          {last ? (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Timestamp</th>
                  <th className="px-4 py-2 border">Department</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">{last.name}</td>
                  <td className="px-4 py-2 border">
                    {new Date(last.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">{last.department}</td>
                </tr>
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
