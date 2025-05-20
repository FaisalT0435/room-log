// File: src/app/(protected)/absen/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function AbsenPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<Blob | null>(null);

  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [remarks, setRemarks] = useState('');
  const [timestamp] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
           `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  });

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(console.error);
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [stream]);

  function capture() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(blob => blob && setCapturedPhoto(blob), 'image/jpeg');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!capturedPhoto) {
      alert('Silakan ambil foto dulu');
      return;
    }
    const form = new FormData();
    form.append('name', name);
    form.append('nik', nik);
    form.append('remarks', remarks);
    form.append('photo', capturedPhoto, 'capture.jpg');
    form.append('timestamp', timestamp);

    const res = await fetch('/api/absen', {
      method: 'POST',
      body: form,
      credentials: 'include'
    });
    if (res.ok) alert('Absen sukses');
    else alert('Absen gagal');
  }

  return (
    <>
      <h1 className="text-xl font-semibold mb-6">Absen Masuk Ruangan</h1>
      <div className="flex gap-8">
        {/* Kamera & Preview */}
        <div className="w-1/2">
          <video ref={videoRef} autoPlay className="w-full rounded-lg border" />
          <button
            onClick={capture}
            className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Ambil Foto
          </button>
          {capturedPhoto && (
            <div className="mt-4">
              <p className="mb-2 font-medium">Preview Foto:</p>
              <canvas ref={canvasRef} className="w-full border rounded" />
            </div>
          )}
        </div>

        {/* Form Data */}
        <form onSubmit={submit} className="w-1/2 space-y-4">
          <div>
            <label className="block text-gray-700">Nama</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border p-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-gray-700">NIK</label>
            <input
              type="text"
              value={nik}
              onChange={e => setNik(e.target.value)}
              required
              className="w-full border p-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-gray-700">Keterangan</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full border p-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-gray-700">Timestamp</label>
            <input
              type="text"
              value={timestamp}
              readOnly
              className="w-full border p-2 rounded bg-gray-100 text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Submit Absen
          </button>
        </form>
      </div>
    </>
  );
}
