const express = require('express');
const cors = require('cors');
const signUpRoute = require('./Routes/Signup');
const requestOtpRoute = require('./Routes/requestOtp');
const verifyOtpRoute = require('./Routes/verifyOtp'); // ✅

const pool = require('./DB/db');
require('dotenv').config();

const app = express();
app.use(cors()); // Allow requests from frontend (e.g., localhost:5173)
app.use(express.json()); // To parse JSON requests

// Routes
app.use('/api', signUpRoute);
app.use('/api', requestOtpRoute); // Route for sending OTP
app.use('/api', verifyOtpRoute); // Route for verifying OTP

pool.getConnection()
  .then(() => {
    console.log('Connected to MySQL');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('Failed to connect to MySQL:', err);
  });
