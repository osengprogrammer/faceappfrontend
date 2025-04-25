import React, { useEffect } from 'react';
import Webcam from 'react-webcam';
import { useMediaPipeFace } from './hooks/useMediaPipeFace';

export default function FaceDetector({ onCapture }) {
  const { videoRef, blinked, setBlinked } = useMediaPipeFace({
    onResults: () => {} // could later be used for landmark drawing
  });

  useEffect(() => {
    if (!blinked) return;
    const image = videoRef.current.getScreenshot();
    onCapture(image);
    const timer = setTimeout(() => setBlinked(false), 2000);
    return () => clearTimeout(timer);
  }, [blinked, onCapture, setBlinked, videoRef]);

  return (
    <Webcam
      ref={videoRef}
      audio={false}
      width={640}
      height={480}
      screenshotFormat="image/jpeg"
      videoConstraints={{
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user',
      }}
      style={{ borderRadius: 8 }}
    />
  );
}
