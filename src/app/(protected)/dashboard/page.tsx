'use client';

import React, { useEffect, useState } from 'react';
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

type ChartRow = { period: string; count: number };
type LastRow = { name: string; department: string; timestamp: string };
type DeptRow = { department: string; visits: number };
type Summary = { thisMonthCount: number; yearToDateCount: number };

export default function DashboardPage() {
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [deptData, setDeptData] = useState<DeptRow[]>([]);
  const [lastRows, setLastRows] = useState<LastRow[]>([]);
  const [summary, setSummary] = useState<Summary>({
    thisMonthCount: 0,
    yearToDateCount: 0,
  });
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');

  useEffect(() => {
    fetch(`/api/dashboard?group=${viewMode}`)
      .then((res) => res.json())
      .then((data) => {
        setChartData(
          data.counts.map((r: any) => ({
            period: r.period,
            count: Number(r.count),
          }))
        );
        setDeptData(
          data.perDept.map((r: any) => ({
            department: r.department,
            visits: Number(r.visits),
          }))
        );
        setLastRows(data.last || []);
        setSummary({
          thisMonthCount: Number(data.summary.thisMonthCount),
          yearToDateCount: Number(data.summary.yearToDateCount),
        });
      })
      .catch(console.error);
  }, [viewMode]);

  // Pie data
  const totalVisits = deptData.reduce((sum, d) => sum + d.visits, 0);
  const pieData = deptData.map((d) => ({
    name: d.department,
    value: totalVisits ? (d.visits / totalVisits) * 100 : 0,
  }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* View mode selector */}
      <div className="mb-4">
        <label className="mr-2">Tampilkan per:</label>
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as 'month' | 'day')}
          className="border p-1 rounded"
        >
          <option value="month">Bulan</option>
          <option value="day">Hari</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            Pengunjung per {viewMode === 'month' ? 'Bulan' : 'Hari'}
          </h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, bottom: 20 }}>
                <XAxis dataKey="period" />
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
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
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
          <h2 className="text-lg font-semibold mb-2">Ringkasan</h2>
          <p>
            Bulan ini: <strong>{summary.thisMonthCount}</strong> pengunjung
          </p>
          <p>
            Total tahun ini: <strong>{summary.yearToDateCount}</strong> pengunjung
          </p>
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
                {lastRows.slice(0, 5).map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{i + 1}</td>
                    <td className="px-4 py-2 border">{r.name}</td>
                    <td className="px-4 py-2 border">{r.department}</td>
                    <td className="px-4 py-2 border">
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
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
