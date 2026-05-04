module.exports = {
  apps: [
    {
      name: "blog-backend",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
