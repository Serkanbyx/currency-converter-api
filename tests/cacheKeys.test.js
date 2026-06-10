const { buildConvertKey, buildRatesKey, CURRENCIES_KEY } = require("../src/utils/cacheKeys");

describe("cacheKeys", () => {
  describe("buildConvertKey", () => {
    it("uppercases currency codes", () => {
      expect(buildConvertKey("usd", "eur", 100)).toBe("convert:USD:EUR:100");
    });

    it("normalizes equivalent amount representations to the same key", () => {
      const fromNumber = buildConvertKey("USD", "EUR", 100);
      const fromString = buildConvertKey("USD", "EUR", "100.00");
      const fromExponent = buildConvertKey("USD", "EUR", "1e2");

      expect(fromString).toBe(fromNumber);
      expect(fromExponent).toBe(fromNumber);
    });

    it("handles missing values without throwing", () => {
      expect(buildConvertKey(undefined, null, undefined)).toBe("convert:::undefined");
    });
  });

  describe("buildRatesKey", () => {
    it("uppercases the base currency", () => {
      expect(buildRatesKey("gbp")).toBe("rates:GBP");
    });
  });

  it("exposes a stable currencies key", () => {
    expect(CURRENCIES_KEY).toBe("currencies");
  });
});
