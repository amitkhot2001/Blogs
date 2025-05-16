// routes/requestOtp.js
const express = require('express');
const sendOTPEmail = require('../utils/sendOTPEmail');
const tempUsers = require('../tempUsers');

const router = express.Router();

router.post('/request-otp', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000;

  tempUsers.set(email, { fullName, email, password, otp, expiry });

  try {
    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Could not send OTP. Try again later.' });
  }
});

module.exports = router;
