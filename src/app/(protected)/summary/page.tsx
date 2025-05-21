// File: src/app/(protected)/summary/page.tsx

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Entry {
  id: number;
  name: string;
  nik: string;
  department: string;
  remarks: string;
  photoUrl: string;
  timestamp: string;
}

export default function SummaryPage() {
  // State hooks
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<Entry | null>(null);

  // Polling fetch every 5s
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const res = await fetch('/api/summary');
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        if (!mounted) return;
        setEntries(json.entries);
        setError(null);
        setLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    }
    fetchData();
    const iv = setInterval(fetchData, 5000);
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  // Derived lists using useMemo
  const departments = useMemo(
    () => Array.from(new Set(entries.map(e => e.department))),
    [entries]
  );

  const filtered = useMemo(() => {
    let temp = entries;
    if (filterName) temp = temp.filter(e =>
      e.name.toLowerCase().includes(filterName.toLowerCase())
    );
    if (filterDept) temp = temp.filter(e => e.department === filterDept);
    if (filterDate) temp = temp.filter(e =>
      e.timestamp.startsWith(filterDate)
    );
    return temp;
  }, [entries, filterName, filterDept, filterDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Export functions
  function exportCSV() {
    const rows = filtered.map((e, i) => [
      String(i + 1), e.name, e.nik, e.department, e.remarks, e.timestamp
    ]);
    const header = ['No','Name','NIK','Department','Remarks','Timestamp'];
    const csv = [header, ...rows]
      .map(r => r.map(v => `"${v}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'summary.csv');
  }

  function exportExcel() {
    const wsData = filtered.map((e, i) => ({
      No: i+1,
      Name: e.name,
      NIK: e.nik,
      Department: e.department,
      Remarks: e.remarks,
      Timestamp: e.timestamp,
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    XLSX.writeFile(wb, 'summary.xlsx');
  }

  return (
    <div className="p-4">
      {/* Loading & Error UI */}
      {loading ? (
        <div>Loading summary...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <>  {/* Main content */}
          <h1 className="text-2xl font-bold mb-4">Summary </h1>
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Filter by name"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              className="border rounded p-2"
            />
            <select
              className="border rounded p-2"
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input
              type="month"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="border rounded p-2"
            />
            <select
              className="border rounded p-2"
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
            >
              {[25,50,100].map(n => <option key={n} value={n}>{n} per halaman</option>)}
            </select>
            <button onClick={exportCSV} className="bg-blue-600 text-white px-4 py-2 rounded">CSV</button>
            <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">Excel</button>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Nama</th>
                  <th className="border px-4 py-2">NIK</th>
                  <th className="border px-4 py-2">Departemen</th>
                  <th className="border px-4 py-2">Detail</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((e, idx) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{(page-1)*pageSize + idx + 1}</td>
                    <td className="border px-4 py-2">{e.name}</td>
                    <td className="border px-4 py-2">{e.nik}</td>
                    <td className="border px-4 py-2">{e.department}</td>
                    <td className="border px-4 py-2">
                      <button onClick={() => setModal(e)} className="text-blue-600 hover:underline">Klik</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center gap-2 mt-4">
            <button disabled={page===1} onClick={() => setPage(page-1)} className="px-3 py-1 border rounded">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-1 border rounded ${page===n?'bg-gray-300':''}`}
              >{n}</button>
            ))}
            <button disabled={page===totalPages} onClick={() => setPage(page+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
          {modal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded max-w-sm w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Detail</h2>
                  <button onClick={() => setModal(null)}>Close</button>
                </div>
                <img src={modal.photoUrl} alt="Face" className="w-full h-48 object-cover rounded mb-4" />
                <p><strong>Nama:</strong> {modal.name}</p>
                <p><strong>NIK:</strong> {modal.nik}</p>
                <p><strong>Departemen:</strong> {modal.department}</p>
                <p><strong>Keterangan:</strong> {modal.remarks}</p>
                <p><strong>Timestamp:</strong> {new Date(modal.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
