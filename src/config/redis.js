const { createClient } = require("redis");
const env = require("./env");

let redisClient = null;
let isRedisConnected = false;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.warn("Redis max retries reached — running without cache");
            return false; // stop retrying
          }
          return Math.min(retries * 500, 3000);
        },
      },
    });

    redisClient.on("error", (err) => {
      if (isRedisConnected) {
        console.error("Redis error:", err.message);
      }
      isRedisConnected = false;
    });

    redisClient.on("ready", () => {
      console.log("Redis connected successfully");
      isRedisConnected = true;
    });

    redisClient.on("end", () => {
      console.warn("Redis disconnected");
      isRedisConnected = false;
    });

    await redisClient.connect();
  } catch (error) {
    console.warn("Redis unavailable — running without cache:", error.message);
    isRedisConnected = false;
  }
};

const getRedisClient = () => redisClient;
const getRedisStatus = () => isRedisConnected;

module.exports = { connectRedis, getRedisClient, getRedisStatus };
