const app = require('./app');
const http = require('http');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 AarogyaSync API Server running on port ${PORT}`);
  console.log(`📡 Health endpoint: http://localhost:${PORT}/api/v1/health`);
  console.log(`🏥 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=================================================`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
