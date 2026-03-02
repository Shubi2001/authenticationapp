import React from 'react';

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-50 p-8 font-sans text-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Mobile Number Authentication</h1>
          <p className="text-zinc-500">
            I have created the requested Node.js application files. You can find them in the <code>/mobile-auth</code> directory of this project, or copy them from below.
          </p>
        </header>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. app.js</h2>
            <p className="text-sm text-zinc-600">The main Express server file that handles OTP generation and verification.</p>
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-sm">
              <pre className="p-4 text-sm text-zinc-50 overflow-x-auto font-mono">
{`const express = require('express');
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
  console.log(\`[MOCK SMS] Sent OTP \${otp} to \${phoneNumber}\`);

  res.status(200).json({ 
    success: true, 
    message: 'OTP sent successfully',
    mockOtp: otp // For testing purposes only. Remove in production!
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
    const token = \`mock-jwt-token-for-\${phoneNumber}\`;
    
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
  console.log(\`Mobile Auth Server running on port \${PORT}\`);
});`}
              </pre>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. package.json</h2>
            <p className="text-sm text-zinc-600">Defines the project dependencies and start scripts.</p>
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-sm">
              <pre className="p-4 text-sm text-zinc-50 overflow-x-auto font-mono">
{`{
  "name": "mobile-auth-app",
  "version": "1.0.0",
  "description": "Mobile number authentication Node.js application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.21.0",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5"
  }
}`}
              </pre>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Dockerfile</h2>
            <p className="text-sm text-zinc-600">Instructions to build a Docker image for the application.</p>
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-sm">
              <pre className="p-4 text-sm text-zinc-50 overflow-x-auto font-mono">
{`# Use official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]`}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
