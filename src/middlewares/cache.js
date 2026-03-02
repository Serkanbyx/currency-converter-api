const { getRedisClient, getRedisStatus } = require("../config/redis");
const env = require("../config/env");

/**
 * Redis cache middleware factory.
 * Generates a cache key from the request path + query and returns cached data if available.
 * @param {function} keyGenerator - (req) => string — custom cache key builder
 */
const cacheMiddleware = (keyGenerator) => {
  return async (req, res, next) => {
    if (!getRedisStatus()) return next();

    const client = getRedisClient();
    const cacheKey = keyGenerator(req);

    try {
      const cached = await client.get(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        return res.status(200).json({
          success: true,
          source: "cache",
          data: parsed,
        });
      }
    } catch (error) {
      console.warn("Cache read error:", error.message);
    }

    next();
  };
};

/**
 * Stores data in Redis cache.
 * @param {string} key - Cache key
 * @param {object} data - Data to cache
 * @param {number} [ttl] - Time to live in seconds (defaults to env.CACHE_TTL)
 */
const setCache = async (key, data, ttl = env.CACHE_TTL) => {
  if (!getRedisStatus()) return;

  const client = getRedisClient();
  try {
    await client.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.warn("Cache write error:", error.message);
  }
};

module.exports = { cacheMiddleware, setCache };
