module.exports = {
    apps: [{
      name: "jecris-api",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production"
      },
      max_memory_restart: "300M"
    }]
  }