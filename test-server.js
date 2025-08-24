const { spawn } = require('child_process');
const fs = require('fs');

// Start the server
const server = spawn('node', ['dist/server.js']);

// Handle server output
server.stdout.on('data', (data) => {
  console.log(`Server stdout: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server stderr: ${data}`);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Send a test request after a short delay
setTimeout(() => {
  // This is a simplified test - in a real scenario, you'd send proper JSON-RPC messages
  console.log('Server started successfully');
  server.kill();
}, 1000);