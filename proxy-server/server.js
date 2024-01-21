const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for all routes

app.get('/payments', async (req, res) => {
  try {
    const response = await axios.get('https://api.razorpay.com/v1/payments?count=100', {
      auth: {
        username: 'rzp_test_vOfRsf2WAk1TsH',
        password: 'cDJC6LFYKzOzsNJORx5dSksK'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
