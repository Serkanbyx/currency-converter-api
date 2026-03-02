const exchangeRateService = require("../services/exchangeRateService");
const { setCache } = require("../middlewares/cache");
const { sendSuccess, sendError } = require("../utils/responseHelper");

const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

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
    const amount = parseFloat(req.query.amount);

    if (isNaN(amount) || amount <= 0) {
      return sendError(res, "amount must be a positive number", 400);
    }

    const result = await exchangeRateService.fetchPairConversion(from, to, amount);

    const cacheKey = `convert:${from}:${to}:${amount}`;
    await setCache(cacheKey, result);

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

    const cacheKey = `rates:${base}`;
    await setCache(cacheKey, result);

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

    await setCache("currencies", currencies, 86400); // 24h cache

    return sendSuccess(res, { count: currencies.length, currencies });
  } catch (error) {
    next(error);
  }
};

module.exports = { convertCurrency, getExchangeRates, getSupportedCurrencies };
