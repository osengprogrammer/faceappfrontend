import { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

export function useMediaPipeFace({ onResults }) {
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const [blinked, setBlinked] = useState(false);
  const lastBlinkAt = useRef(0);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      // call user callback
      onResults(results);

      // EAR calculation
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length) {
        const lm = results.multiFaceLandmarks[0];
        const leftEAR = computeEAR(lm, [33, 160, 158, 133, 153, 144]);
        const rightEAR = computeEAR(lm, [263, 385, 387, 362, 380, 373]);
        const avgEAR = (leftEAR + rightEAR) / 2;

        const now = Date.now();
        console.log('Blink detection:', avgEAR); // Debugging line

        if (avgEAR < 0.2 && now - lastBlinkAt.current > 2000) {
          lastBlinkAt.current = now;
          setBlinked(true);
          console.log('Blink detected!'); // Debugging line
        }
      }
    });

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => await faceMesh.send({ image: videoRef.current }),
      width: 640,
      height: 480,
    });
    cameraRef.current.start();

    return () => {
      cameraRef.current?.stop();
      faceMesh.close();
    };
  }, [onResults]);

  // expose blinked and ref
  return { videoRef, blinked, setBlinked };
}

// Helper to compute eye aspect ratio
function computeEAR(landmarks, idxs) {
  const [p1, p2, p3, p4, p5, p6] = idxs.map((i) => landmarks[i]);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const A = dist(p2, p6);
  const B = dist(p3, p5);
  const C = dist(p1, p4);
  return (A + B) / (2.0 * C);
}
