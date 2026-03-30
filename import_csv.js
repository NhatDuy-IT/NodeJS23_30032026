const fs = require('fs');
const https = require('https');

const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN'; // Từ /auth/login

const csv = fs.readFileSync('users_import.csv', 'utf8');
const lines = csv.trim().split('\n').slice(1); // Skip header
const users = lines.map(line => {
  const [username, email] = line.split(',');
  return { username, email };
});

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
    console.log('✅ Import success:', JSON.parse(response));
    console.log('📧 Check Mailtrap 4 emails password!');
  });
});

req.on('error', (error) => console.error('❌ Error:', error));
req.write(data);
req.end();
