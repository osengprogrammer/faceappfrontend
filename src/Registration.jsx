// src/Registration.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';

export default function Registration() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const webcamRef = React.useRef(null);
  const handleRegister = async () => {
    if (!name) {
      setStatus('Please enter a name');
      return;
    }
  
    const screenshot = webcamRef.current.getScreenshot();
    console.log(screenshot);  // Log the screenshot to ensure it's being captured
  
    if (!screenshot) {
      setStatus('Error: Failed to capture face');
      return;
    }
  
    const blob = await fetch(screenshot).then(r => r.blob());
    const form = new FormData();
    form.append('name', name);
    form.append('file', blob, 'face.jpg');
  
    try {
      const res = await axios.post('http://192.168.1.9:8000//register/', form);
      console.log('Response:', res);  // Log the entire response object
      setStatus('Registered: ' + res.data.status);
    } catch (e) {
      console.log('Error:', e);  // Log the error response
      setStatus('Error: ' + (e.response?.data?.detail || e.message || 'Unknown error'));
    }
  };
  
  
  

  return (
    <div>
      <h2>Registration</h2>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div style={{ margin: '20px 0' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
        />
      </div>
      <button onClick={handleRegister}>Register Face</button>
      <p>{status}</p>
    </div>
  );
}
