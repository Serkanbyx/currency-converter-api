require("dotenv").config();

const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY,
  EXCHANGE_RATE_BASE_URL: "https://v6.exchangerate-api.com/v6",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  CACHE_TTL: parseInt(process.env.CACHE_TTL, 10) || 3600, // 1 hour in seconds
};

if (!env.EXCHANGE_RATE_API_KEY) {
  console.error("EXCHANGE_RATE_API_KEY is required. Get one at https://www.exchangerate-api.com/");
  process.exit(1);
}

module.exports = env;
