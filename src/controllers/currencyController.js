const exchangeRateService = require("../services/exchangeRateService");
const { setCache } = require("../middlewares/cache");
const { sendSuccess, sendError } = require("../utils/responseHelper");
const { buildConvertKey, buildRatesKey, CURRENCIES_KEY } = require("../utils/cacheKeys");

const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;
const MAX_AMOUNT = 1_000_000_000_000; // 1 trillion — guards against overflow/abuse

const validateCurrencyCode = (code, fieldName) => {
  if (!code) throw Object.assign(new Error(`${fieldName} is required`), { name: "ValidationError" });
  const upper = code.toUpperCase();
  if (!CURRENCY_CODE_REGEX.test(upper)) {
    throw Object.assign(
      new Error(`${fieldName} must be a valid 3-letter ISO 4217 currency code`),
      { name: "ValidationError" }
    );
  }
  return upper;
};

/**
 * GET /api/v1/convert?from=USD&to=EUR&amount=100
 */
const convertCurrency = async (req, res, next) => {
  try {
    const from = validateCurrencyCode(req.query.from, "from");
    const to = validateCurrencyCode(req.query.to, "to");
    const amount = Number.parseFloat(req.query.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return sendError(res, "amount must be a positive number", 400);
    }

    if (amount > MAX_AMOUNT) {
      return sendError(res, `amount must not exceed ${MAX_AMOUNT}`, 400);
    }

    const result = await exchangeRateService.fetchPairConversion(from, to, amount);

    await setCache(buildConvertKey(from, to, amount), result);

    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/rates/:base
 */
const getExchangeRates = async (req, res, next) => {
  try {
    const base = validateCurrencyCode(req.params.base, "base");
    const result = await exchangeRateService.fetchLatestRates(base);

    await setCache(buildRatesKey(base), result);

    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/currencies
 */
const getSupportedCurrencies = async (req, res, next) => {
  try {
    const currencies = await exchangeRateService.fetchSupportedCurrencies();

    await setCache(CURRENCIES_KEY, currencies, 86400); // 24h cache

    return sendSuccess(res, { count: currencies.length, currencies });
  } catch (error) {
    next(error);
  }
};

module.exports = { convertCurrency, getExchangeRates, getSupportedCurrencies };
