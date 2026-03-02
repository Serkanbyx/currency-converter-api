const axios = require("axios");
const env = require("../config/env");

const apiClient = axios.create({
  baseURL: `${env.EXCHANGE_RATE_BASE_URL}/${env.EXCHANGE_RATE_API_KEY}`,
  timeout: 10000,
});

/**
 * Fetches latest exchange rates for a given base currency from ExchangeRate-API.
 * @param {string} baseCurrency - ISO 4217 currency code (e.g. "USD")
 * @returns {Promise<object>} - { base, rates, lastUpdate }
 */
const fetchLatestRates = async (baseCurrency) => {
  const { data } = await apiClient.get(`/latest/${baseCurrency}`);

  if (data.result !== "success") {
    throw new Error(data["error-type"] || "Failed to fetch exchange rates");
  }

  return {
    base: data.base_code,
    rates: data.conversion_rates,
    lastUpdate: data.time_last_update_utc,
  };
};

/**
 * Fetches pair conversion directly from the API.
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @param {number} amount - Amount to convert
 * @returns {Promise<object>} - { from, to, rate, amount, result }
 */
const fetchPairConversion = async (from, to, amount) => {
  const { data } = await apiClient.get(`/pair/${from}/${to}/${amount}`);

  if (data.result !== "success") {
    throw new Error(data["error-type"] || "Failed to convert currency");
  }

  return {
    from: data.base_code,
    to: data.target_code,
    rate: data.conversion_rate,
    amount,
    result: data.conversion_result,
  };
};

/**
 * Fetches all supported currency codes.
 * @returns {Promise<object[]>} - Array of { code, name }
 */
const fetchSupportedCurrencies = async () => {
  const { data } = await apiClient.get("/codes");

  if (data.result !== "success") {
    throw new Error(data["error-type"] || "Failed to fetch currencies");
  }

  return data.supported_codes.map(([code, name]) => ({ code, name }));
};

module.exports = { fetchLatestRates, fetchPairConversion, fetchSupportedCurrencies };
