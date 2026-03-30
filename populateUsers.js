const https = require('https');
const fs = require('fs');

// Replace with your ADMIN JWT token from /auth/login (admin user)
const ADMIN_TOKEN = 'PASTE_YOUR_ADMIN_TOKEN_HERE';

const users = [];
for (let i = 1; i <= 99; i++) {
  const num = i.toString().padStart(2, '0');
  users.push({
    username: `user${num}`,
    email: `user${num}@haha.com`
  });
}

const data = JSON.stringify({ users });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/users/import',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let response = '';
  res.on('data', (d) => response += d);
  res.on('end', () => {
    console.log('Response:', JSON.parse(response));
    console.log('\\nCheck Mailtrap for 99 password emails!');
  });
});

req.on('error', (error) => console.error('Error:', error));
req.write(data);
req.end();

