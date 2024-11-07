import React, { useState, useRef, useEffect } from 'react';

const Camera = () => {
    const [imageDataUrl, setImageDataUrl] = useState('');
    const [comparisonResult, setComparisonResult] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Start the camera when the component mounts
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
            }
        };

        startCamera();

        // Cleanup the camera stream when the component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Function to capture the image from the video feed
    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');

        // Mirror the image by scaling horizontally
        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();

        // Convert the canvas image to a data URL
        const dataUrl = canvas.toDataURL('image/png');
        setImageDataUrl(dataUrl);
        console.log('Captured Image Data URL:', dataUrl);
    };

    // Function to send the captured image to the backend for comparison
    const handleCompareFaces = async () => {
        if (!imageDataUrl) {
            setComparisonResult('No image captured.');
            return;
        }
    
        try {
            // Remove the data URI prefix to get the base64 string
            const base64Image = imageDataUrl.split(',')[1];
            console.log('Captured Image Base64 Length:', base64Image.length); // Add this line for debugging
    
            const response = await fetch('http://localhost:8081/compareFaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({ capturedImage: base64Image }),
            });
    
            const result = await response.json();
            setComparisonResult(result.message);
            console.log('Comparison result:', result);
        } catch (error) {
            console.error('Error comparing faces:', error);
            setComparisonResult('Error comparing faces.');
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Capture Image from Camera</h2>
            <video
                ref={videoRef}
                autoPlay
                style={{ transform: 'scaleX(-1)', maxWidth: '50%', width: '50%' }}
            />
            <br />
            <button onClick={captureImage} style={{ marginTop: '10px' }}>Capture</button>
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Display captured image if available */}
            {imageDataUrl && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Captured Image:</h3>
                    <img src={imageDataUrl} alt="Captured" style={{ maxWidth: '50%', width: '50%' }} />
                    <br />
                    <button onClick={handleCompareFaces} style={{ marginTop: '10px' }}>Compare Faces</button>
                </div>
            )}

            {/* Display comparison result */}
            {comparisonResult && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Comparison Result:</h3>
                    <p>{comparisonResult}</p>
                </div>
            )}
        </div>
    );
};

export default Camera;