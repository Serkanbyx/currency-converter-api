const env = require("./src/config/env");
const { connectRedis, getRedisClient, getRedisStatus } = require("./src/config/redis");
const app = require("./src/app");

let server;

const startServer = async () => {
  await connectRedis();

  server = app.listen(env.PORT, () => {
    console.log(`\n  Currency Converter API`);
    console.log(`  ─────────────────────────────────`);
    console.log(`  Environment : ${env.NODE_ENV}`);
    console.log(`  Server      : http://localhost:${env.PORT}`);
    console.log(`  Swagger     : http://localhost:${env.PORT}/api-docs`);
    console.log(`  Health      : http://localhost:${env.PORT}/health`);
    console.log(`  ─────────────────────────────────\n`);
  });
};

// ─── Graceful Shutdown ──────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
  console.log(`\n  [${signal}] Shutting down gracefully...`);

  if (server) {
    server.close(() => console.log("  HTTP server closed"));
  }

  if (getRedisStatus()) {
    try {
      await getRedisClient().quit();
      console.log("  Redis connection closed");
    } catch {
      // Redis already disconnected — safe to ignore
    }
  }

  console.log("  Goodbye!\n");
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
