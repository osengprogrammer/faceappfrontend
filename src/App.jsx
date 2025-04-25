import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Registration from './Registration';
import CheckIn from './CheckIn';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
        <h1>Face Recognition Attendance</h1>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/register" style={{ marginRight: 10 }}>Registration</Link>
          <Link to="/checkin">Check-In</Link>
        </nav>

        <Routes>
          <Route path="/" element={<p>Please choose “Registration” or “Check-In” above.</p>} />
          <Route path="/register" element={<Registration />} />
          <Route path="/checkin" element={<CheckIn />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
