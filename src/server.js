const app = require('./app');
const config = require('./config/env');
const { testConnection } = require('./config/database');

// Capture and log system-wide uncaught exceptions before crashing
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception detected! Server shutting down...');
  console.error(err);
  process.exit(1);
});

const startServer = async () => {
  try {
    // 1. Verify MySQL database connectivity
    await testConnection();

    // 2. Start HTTP server listening
    const server = app.listen(config.port, () => {
      console.log(`==================================================`);
      console.log(`  Task Manager Service started successfully!      `);
      console.log(`  Port: ${config.port}                            `);
      console.log(`  Environment: ${config.nodeEnv}                  `);
      console.log(`  Time: ${new Date().toISOString()}               `);
      console.log(`==================================================`);
    });

    // Capture and log unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('CRITICAL: Unhandled Promise Rejection detected!');
      console.error(reason);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('FATAL: Database connection verification failed. Server aborting start.');
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
