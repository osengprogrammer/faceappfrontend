// src/Attendance.jsx
import React, { useState } from 'react';
import axios from 'axios';
import FaceDetector from './FaceDetector';

export default function Attendance() {
  const [status, setStatus] = useState('');

  const handleCapture = async (imgData) => {
    const blob = await fetch(imgData).then((r) => r.blob());
    const form = new FormData();
    form.append('file', blob, 'snap.jpg');
    try {
      const res = await axios.post('http://localhost:8000/attendance/', form);
      setStatus(`${res.data.status} at ${res.data.time}`);
    } catch (e) {
      setStatus(e.response?.data.detail || 'Error');
    }
  };

  return (
    <>
      <FaceDetector onCapture={handleCapture} />
      <p>{status}</p>
    </>
  );
}
