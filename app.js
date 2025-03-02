// app.js - Backend server
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from public directory
app.use(express.static('public'));

// API endpoint to fetch market news and insights
app.get('/api/market-news', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_BASE_URL}/marketnewsinsights`, {
      headers: {
        'x-api-key': process.env.API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market news:', error);
    res.status(500).json({ error: 'Failed to fetch market news' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});