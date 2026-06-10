jest.mock("../src/services/exchangeRateService");

const request = require("supertest");
const app = require("../src/app");
const exchangeRateService = require("../src/services/exchangeRateService");

describe("Currency API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/v1/convert", () => {
    it("converts a valid currency pair", async () => {
      exchangeRateService.fetchPairConversion.mockResolvedValue({
        from: "USD",
        to: "EUR",
        rate: 0.92,
        amount: 100,
        result: 92,
      });

      const res = await request(app).get("/api/v1/convert?from=USD&to=EUR&amount=100");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: { from: "USD", to: "EUR", rate: 0.92, amount: 100, result: 92 },
      });
      expect(exchangeRateService.fetchPairConversion).toHaveBeenCalledWith("USD", "EUR", 100);
    });

    it("rejects an invalid currency code", async () => {
      const res = await request(app).get("/api/v1/convert?from=US&to=EUR&amount=100");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(exchangeRateService.fetchPairConversion).not.toHaveBeenCalled();
    });

    it("rejects a non-positive amount", async () => {
      const res = await request(app).get("/api/v1/convert?from=USD&to=EUR&amount=-5");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("rejects an amount above the maximum", async () => {
      const res = await request(app).get("/api/v1/convert?from=USD&to=EUR&amount=2000000000000");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("requires the amount parameter", async () => {
      const res = await request(app).get("/api/v1/convert?from=USD&to=EUR");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/rates/:base", () => {
    it("returns rates for a valid base currency", async () => {
      exchangeRateService.fetchLatestRates.mockResolvedValue({
        base: "USD",
        rates: { EUR: 0.92, GBP: 0.79 },
        lastUpdate: "Mon, 02 Mar 2026 00:00:01 +0000",
      });

      const res = await request(app).get("/api/v1/rates/usd");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.base).toBe("USD");
      expect(exchangeRateService.fetchLatestRates).toHaveBeenCalledWith("USD");
    });

    it("rejects an invalid base currency", async () => {
      const res = await request(app).get("/api/v1/rates/dollars");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/currencies", () => {
    it("returns the supported currency list", async () => {
      exchangeRateService.fetchSupportedCurrencies.mockResolvedValue([
        { code: "USD", name: "United States Dollar" },
        { code: "EUR", name: "Euro" },
      ]);

      const res = await request(app).get("/api/v1/currencies");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBe(2);
      expect(res.body.data.currencies).toHaveLength(2);
    });
  });

  describe("GET /health", () => {
    it("reports service status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.redis).toBe("disconnected");
    });
  });

  describe("Unknown routes", () => {
    it("returns 404 for an undefined route", async () => {
      const res = await request(app).get("/api/v1/does-not-exist");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
