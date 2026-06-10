// Ensures required env vars exist before any module that validates them is loaded.
process.env.EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || "test-api-key";
process.env.NODE_ENV = "test";
