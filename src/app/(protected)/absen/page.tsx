// File: src/app/(protected)/absen/page.tsx

'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function AbsenPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [streamReady, setStreamReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<Blob | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [department, setDepartment] = useState('');
  const [remarks, setRemarks] = useState('');
  const [timestamp] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    );
  });

  // Initialize camera once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = navigator.mediaDevices;
    if (!media?.getUserMedia) {
      console.error('Camera API not available');
      return;
    }

    let localStream: MediaStream;
    media.getUserMedia({ video: true })
      .then((s) => {
        localStream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current!.play();
            setStreamReady(true);
          };
        }
      })
      .catch((err) => console.error('Error accessing camera:', err));

    return () => localStream?.getTracks().forEach((t) => t.stop());
  }, []);

  // Capture frame into Blob + preview URL
  function capture() {
    if (!streamReady || !videoRef.current || !canvasRef.current) {
      alert('Camera belum siap, tunggu beberapa detik.');
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setCapturedPhoto(blob);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.8);
  }

  // Reset preview to retake
  function retake() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCapturedPhoto(null);
    setSubmitMessage(null);
  }

  // Submit form + photo to API
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!capturedPhoto) {
      setSubmitMessage('Silakan ambil foto dulu.');
      return;
    }
    const form = new FormData();
    form.append('name', name);
    form.append('nik', nik);
    form.append('department', department);
    form.append('remarks', remarks);
    form.append('timestamp', timestamp);
    form.append('photo', capturedPhoto, 'capture.jpg');

    try {
      const res = await fetch('/api/absen', {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
      if (res.ok) {
        setSubmitMessage('Submit berhasil!');
        retake();
        setName('');
        setNik('');
        setDepartment('');
        setRemarks('');
      } else {
        const { message } = await res.json();
        setSubmitMessage(message || 'Submit gagal.');
      }
    } catch {
      setSubmitMessage('Submit gagal. Periksa koneksi.');
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Absen Masuk Ruangan</h1>
      {submitMessage && (
        <div className="mb-4 p-2 rounded bg-gray-100 text-center">
          {submitMessage}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Camera / Preview */}
        <div className="md:w-1/2">
          <div className="relative">
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
          </div>
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
            {previewUrl
              ? 'Ambil Ulang'
              : streamReady
              ? 'Ambil Foto'
              : 'Menyiapkan Kamera...'}
          </button>
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
            <label className="block text-gray-700">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
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
              capturedPhoto
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Absen
          </button>
        </form>
      </div>
    </>
  );
}
