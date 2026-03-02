const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory store for OTPs (In production, use Redis or a database)
const otpStore = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Route to request OTP
app.post('/api/auth/request-otp', (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  // Generate OTP
  const otp = generateOTP();
  
  // Store OTP with expiration (e.g., 5 minutes)
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(phoneNumber, { otp, expiresAt });

  // In a real application, you would send the OTP via SMS using Twilio, AWS SNS, etc.
  console.log(`[MOCK SMS] Sent OTP ${otp} to ${phoneNumber}`);

  res.status(200).json({ 
    success: true, 
    message: 'OTP sent successfully',
    // Including OTP in response for testing purposes only. Remove in production!
    mockOtp: otp 
  });
});

// Route to verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
  }

  const storedData = otpStore.get(phoneNumber);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'No OTP requested for this number' });
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(phoneNumber);
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  if (storedData.otp === otp) {
    // OTP is valid
    otpStore.delete(phoneNumber); // Clear OTP after successful verification
    
    // Here you would typically generate a JWT token for the user
    const token = `mock-jwt-token-for-${phoneNumber}`;
    
    return res.status(200).json({ 
      success: true, 
      message: 'Authentication successful',
      token 
    });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

app.listen(PORT, () => {
  console.log(`Mobile Auth Server running on port ${PORT}`);
});
