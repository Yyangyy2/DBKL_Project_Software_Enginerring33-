// UserLocationForm.js
import React, { useState } from 'react';
import axios from 'axios'; 
import './validateUserLocationForm.css';

function ValidateUserLocationForm() {
  const [ic, setIC] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [icError, setIcError] = useState('');
  const [message, setMessage] = useState('');

  // Function to validate the IC format (example: Malaysian format)
  const validateIC = (value) => {
    const icPattern = /^\d{6}-\d{2}-\d{4}$/;
    return icPattern.test(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate IC format
    if (!validateIC(ic)) {
      setIcError('Invalid IC format. Use format: 123456-78-9100');
      return;
    } else {
      setIcError('');
    }

    // Prepare data for backend
    const data = {
      ic,
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    };

    try {
      // Send data to the backend using Axios
      const response = await axios.post('http://localhost:8081/validateUserLocationForm', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle the response
      if (response.status === 200) {
        setMessage('Data saved successfully');
      }
    } catch (error) {
      // Handle error response
      if (error.response) {
        setMessage(`Error saving data: ${error.response.data.message}`);
      } else {
        setMessage('Error connecting to the server');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>User Location Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ic">IC:</label>
          <input
            type="text"
            id="ic"
            value={ic}
            onChange={(e) => setIC(e.target.value)}
            placeholder="123456-78-9100"
          />
          {icError && <p className="error">{icError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="text"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Enter longitude"
          />
        </div>
        <div className="form-group">
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="text"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Enter latitude"
          />
        </div>
        <button type="submit">Submit</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default ValidateUserLocationForm;
