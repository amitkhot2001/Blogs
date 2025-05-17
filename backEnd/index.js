const express = require('express');
const cors = require('cors');
const signUpRoute = require('./Routes/Signup');
const loginRoute = require('./Routes/login'); // ✅ Added login route
const requestOtpRoute = require('./Routes/requestOtp');
const verifyOtpRoute = require('./Routes/verifyOtp');
const Profile = require('./Routes/getAuthorProfile');
const Blogs = require('./Routes/Blogs');


const pool = require('./DB/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allow requests from frontend (e.g., localhost:5173)
app.use(express.json()); // To parse JSON requests

// Routes
app.use('/api', signUpRoute);          // Signup Route
app.use('/api', loginRoute);           // ✅ Login Route Added
app.use('/api', requestOtpRoute);      // Route for sending OTP
app.use('/api', verifyOtpRoute);       // Route for verifying OTP
app.use('/api', Profile);
app.use('/api', Blogs);

// Database Connection and Server Start
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
