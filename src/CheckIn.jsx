import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import FaceDetector from './FaceDetector';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CheckIn() {
  const [status, setStatus] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleCapture = useCallback(async (dataUri) => {
    if (processing) return;
    setProcessing(true);
    setStatus('Processing…');

    try {
      const blob = await fetch(dataUri).then((r) => r.blob());
      const form = new FormData();
      form.append('file', blob, 'snap.jpg');

      const res = await axios.post(
        'https://your-backend-url.ngrok-free.app/attendance/', // Change to your backend URL
        form
      );
      const time = new Date(res.data.time).toLocaleTimeString();
      const message = `${res.data.status} at ${time}`;
      setStatus(message);
      toast.success(message); // ✅ Toast notification on success
    } catch (e) {
      const detail = e.response?.data?.detail || e.message || 'Unknown error';
      setStatus('Error: ' + detail);
      toast.error('❌ ' + detail); // ❌ Toast error
    } finally {
      setProcessing(false);
    }
  }, [processing]);

  // Check if the blinked state is true and trigger the notification
  useEffect(() => {
    if (status) {
      toast.success(status); // Show success message when check-in happens
    }
  }, [status]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Auto Check-In on Blink</h2>
      <p>{processing ? 'Waiting for blink…' : 'Blink to check in/out'}</p>
      <FaceDetector onCapture={handleCapture} />
      <p style={{ marginTop: '1rem' }}>{status}</p>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
