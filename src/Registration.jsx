import React, { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';

export default function Registration() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const webcamRef = useRef(null);

  const handleRegister = async () => {
    if (!name) {
      setStatus('Please enter a name');
      return;
    }

    const screenshot = webcamRef.current.getScreenshot();
    console.log('Screenshot data URI:', screenshot);

    if (!screenshot) {
      setStatus('Error: Failed to capture face');
      return;
    }

    // Convert data URI to Blob
    const blob = await fetch(screenshot).then(r => r.blob());
    console.log('Blob size:', blob.size);

    // Build form data
    const form = new FormData();
    form.append('name', name);
    form.append('file', blob, 'face.jpg');

    try {
      const res = await axios.post(
        'https://901e-103-179-182-19.ngrok-free.app/register/',
        form
      );
      console.log('Response:', res);
      setStatus('Registered: ' + res.data.status);
    } catch (e) {
      console.error('Error response:', e.response?.data);
      const detail = e.response?.data?.detail || e.message || 'Unknown error';
      setStatus('Error: ' + detail);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Face Registration</h2>
      <input
        style={{ fontSize: '1rem', padding: '0.5rem', width: '100%' }}
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div style={{ margin: '1rem 0' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          videoConstraints={{
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }}
        />
      </div>
      <button
        onClick={handleRegister}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        Register Face
      </button>
      <p style={{ marginTop: '1rem', fontSize: '1rem' }}>{status}</p>
    </div>
  );
}
