module.exports = {
  apps: [
    {
      name: "hirebot-ai-app",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max", // Use max for utilizing all available CPUs
      exec_mode: "cluster", // Run in cluster mode for load balancing
      watch: false, // Don't watch for file changes in production
      max_memory_restart: "1G", // Restart if memory usage exceeds 1GB
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "http://localhost:8000",
        NEXT_PUBLIC_API_BASE_URL: "http://localhost:8000",
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
    },
  ],
};
