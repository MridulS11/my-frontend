import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle form submission: validate JSON then call the backend API.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let payload;
    try {
      // Validate that the input is valid JSON
      payload = JSON.parse(jsonInput);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      return;
    }

    try {
      // Change this to your actual backend URL, e.g. "http://localhost:5001/bfhl"
      const response = await axios.post('https://backend-3md0.onrender.com/bfhl', payload);
      setApiResponse(response.data);
      // Optionally, set your page title to roll_number
      if (response.data.roll_number) {
        document.title = response.data.roll_number;
      }
    } catch (err) {
      setError('Error calling API. Please verify your endpoint and payload.');
    }
  };

  // Handle changes in the multi-select dropdown
  const handleOptionChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(options);
  };

  // Renders only the selected parts of the response
  const renderFilteredResponse = () => {
    if (!apiResponse) return null;

    let displayLines = [];

    if (selectedOptions.includes('Numbers')) {
      displayLines.push(`Numbers: ${apiResponse.numbers.join(', ')}`);
    }
    if (selectedOptions.includes('Alphabets')) {
      displayLines.push(`Alphabets: ${apiResponse.alphabets.join(', ')}`);
    }
    if (selectedOptions.includes('Highest Alphabet')) {
      displayLines.push(`Highest Alphabet: ${apiResponse.highest_alphabet.join(', ')}`);
    }

    if (displayLines.length === 0) return null;

    return (
      <div style={{ marginTop: '1rem' }}>
        <h3>Filtered Response</h3>
        {displayLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Placement Assessment</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          API Input (JSON):
        </label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='e.g., { "data": ["M", "1", "334", "4", "B"] }'
          rows="5"
          cols="50"
          style={{ display: 'block', marginBottom: '1rem' }}
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {apiResponse && (
        <div>
          <h2>API Response</h2>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>

          <div style={{ marginTop: '1rem' }}>
            <label>Select fields to display:</label>
            <br />
            <select multiple onChange={handleOptionChange} style={{ width: '200px', height: '6rem' }}>
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest Alphabet">Highest Alphabet</option>
            </select>
          </div>

          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
};

export default App;
