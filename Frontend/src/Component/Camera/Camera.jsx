import React, { useRef, useState, useEffect } from 'react';

const CaptureImage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageDataUrl, setImageDataUrl] = useState('');

  useEffect(() => {
    // Request access to the camera when the component mounts
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(error => console.log('Error accessing the camera:', error));
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip the context horizontally before drawing the image
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();

    // Get the image data URL and store it in state
    const dataUrl = canvas.toDataURL('image/png');
    setImageDataUrl(dataUrl);  // Store image data URL in state to use/display later
    console.log(dataUrl);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Capture Image from Camera</h2>
      <video
        ref={videoRef}
        autoPlay
        style={{ transform: 'scaleX(-1)', maxWidth: '50%', width: '50%' }}
      />
      <button onClick={captureImage}>Capture</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Display captured image if available */}
      {imageDataUrl && (
        <div>
          <h3>Captured Image:</h3>
          <img src={imageDataUrl} alt="Captured" style={{ maxWidth: '50%', width: '50%' }} />
        </div>
      )}
    </div>
  );
};

export default CaptureImage;
