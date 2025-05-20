// File: src/app/(protected)/absen/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function AbsenPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [streamReady, setStreamReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<Blob | null>(null);

  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [remarks, setRemarks] = useState('');
  const [timestamp] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    );
  });

  useEffect(() => {
    let localStream: MediaStream;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        localStream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setStreamReady(true);
          };
        }
      })
      .catch((err) => {
        console.error('Error opening camera:', err);
        alert('Gagal mengakses kamera');
      });
    return () => localStream?.getTracks().forEach((t) => t.stop());
  }, []);

  function capture() {
    if (!streamReady || !videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(v, 0, 0);

    c.toBlob((blob) => {
      if (!blob) return;
      setCapturedPhoto(blob);
      previewUrl && URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
    }, 'image/jpeg', 0.8);
  }

  // Clear preview to retake
  function retake() {
    setPreviewUrl(null);
    setCapturedPhoto(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!capturedPhoto) return alert('Silakan ambil foto dulu.');

    const form = new FormData();
    form.append('name', name);
    form.append('nik', nik);
    form.append('remarks', remarks);
    form.append('timestamp', timestamp);
    form.append('photo', capturedPhoto, 'capture.jpg');

    const res = await fetch('/api/absen', {
      method: 'POST',
      body: form,
      credentials: 'include',
    });

    if (res.ok) {
      alert('Absen sukses');
      retake();
      setName(''); setNik(''); setRemarks('');
    } else {
      const data = await res.json();
      alert(data.message || 'Absen gagal');
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Absen Masuk Ruangan</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Camera + Preview */}
        <div className="md:w-1/2 relative">
          {!previewUrl ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full rounded-lg border bg-black"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full rounded-lg border object-cover"
            />
          )}

          {/* Bila sudah capture, tombol jadi Retake */}
          <button
            onClick={previewUrl ? retake : capture}
            disabled={!streamReady}
            className={`mt-2 w-full py-2 rounded text-white ${
              streamReady
                ? previewUrl
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {previewUrl ? 'Ambil Ulang' : streamReady ? 'Ambil Foto' : 'Menyiapkan Kamera...'}
          </button>

          {/* hidden canvas for blob conversion */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Form Data */}
        <form onSubmit={submit} className="md:w-1/2 space-y-4">
          <div>
            <label className="block text-gray-700">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border p-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-gray-700">NIK</label>
            <input
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              required
              className="w-full border p-2 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-gray-700">Keterangan</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
            disabled={!capturedPhoto}
            className={`w-full py-2 rounded text-white ${
              capturedPhoto ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
            }`}
          >
            Submit Absen
          </button>
        </form>
      </div>
    </>
  );
}
