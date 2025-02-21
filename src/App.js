import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

// Options for the multi-select dropdown
const filterOptions = [
  { value: 'Numbers', label: 'Numbers' },
  { value: 'Alphabets', label: 'Alphabets' },
  { value: 'Highest Alphabet', label: 'Highest Alphabet' }
];

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Set page title when component mounts
  useEffect(() => {
    document.title = "22BCS12225"; // Set default title
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let payload;
    try {
      payload = JSON.parse(jsonInput);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      return;
    }

    try {
      const response = await axios.post('https://backend-3md0.onrender.com/bfhl', payload);
      setApiResponse(response.data);
      if (response.data.roll_number) {
        document.title = response.data.roll_number;
      }
    } catch (err) {
      setError('Error calling API. Please verify your endpoint and payload.');
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  const renderFilteredResponse = () => {
    if (!apiResponse) return null;

    let displayLines = [];

    if (selectedOptions.some(opt => opt.value === 'Numbers')) {
      displayLines.push(`Numbers: ${apiResponse.numbers.join(', ')}`);
    }
    if (selectedOptions.some(opt => opt.value === 'Alphabets')) {
      displayLines.push(`Alphabets: ${apiResponse.alphabets.join(', ')}`);
    }
    if (selectedOptions.some(opt => opt.value === 'Highest Alphabet')) {
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>22BCS12225</h1>

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
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {apiResponse && (
        <div>
          <div style={{ marginTop: '1rem' }}>
            <label><strong>Multi Filter:</strong></label>
            <Select
              isMulti
              options={filterOptions}
              onChange={handleSelectChange}
              value={selectedOptions}
              placeholder="Select filters..."
              closeMenuOnSelect={false}
            />
          </div>

          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
};

export default App;
