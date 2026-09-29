const http = require('http');

const data = JSON.stringify({
  firstName: 'Akash',
  lastName: 'Kumar',
  email: 'akash@example.com',
  username: 'akashdemo123',
  password: 'demo123',
  confirmPassword: 'demo123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log(body);
  });
});

req.on('error', (e) => {
  console.error('error', e.message);
});

req.write(data);
req.end();
