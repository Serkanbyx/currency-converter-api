/**
 * Centralized cache key builders.
 *
 * Keys must be generated identically on both the read path (cache middleware)
 * and the write path (controller). Normalizing inputs here guarantees that
 * variations like "100.00", "1e2" or lowercase codes resolve to the same key.
 */

const normalizeCode = (code) => String(code || "").toUpperCase();

const normalizeAmount = (amount) => {
  const parsed = Number.parseFloat(amount);
  return Number.isFinite(parsed) ? parsed : amount;
};

const buildConvertKey = (from, to, amount) =>
  `convert:${normalizeCode(from)}:${normalizeCode(to)}:${normalizeAmount(amount)}`;

const buildRatesKey = (base) => `rates:${normalizeCode(base)}`;

const CURRENCIES_KEY = "currencies";

module.exports = { buildConvertKey, buildRatesKey, CURRENCIES_KEY };
