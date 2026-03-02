const { Router } = require("express");
const { convertCurrency, getExchangeRates, getSupportedCurrencies } = require("../controllers/currencyController");
const { cacheMiddleware } = require("../middlewares/cache");

const router = Router();

// ─── Swagger Schemas ────────────────────────────────────────────────

/**
 * @swagger
 * components:
 *   schemas:
 *     ConversionResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             from:
 *               type: string
 *               example: USD
 *             to:
 *               type: string
 *               example: EUR
 *             rate:
 *               type: number
 *               example: 0.9215
 *             amount:
 *               type: number
 *               example: 100
 *             result:
 *               type: number
 *               example: 92.15
 *     RatesResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             base:
 *               type: string
 *               example: USD
 *             rates:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *               example:
 *                 EUR: 0.9215
 *                 GBP: 0.7890
 *                 TRY: 36.12
 *             lastUpdate:
 *               type: string
 *               example: "Mon, 02 Mar 2026 00:00:01 +0000"
 *     CurrenciesList:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             count:
 *               type: integer
 *               example: 161
 *             currencies:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: USD
 *                   name:
 *                     type: string
 *                     example: United States Dollar
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "from is required"
 */

// ─── Routes ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/convert:
 *   get:
 *     summary: Convert an amount between two currencies
 *     tags: [Currency]
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *         description: Source currency code (e.g. USD)
 *         example: USD
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *         description: Target currency code (e.g. EUR)
 *         example: EUR
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *         description: Amount to convert
 *         example: 100
 *     responses:
 *       200:
 *         description: Successful conversion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversionResult'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       502:
 *         description: External API error
 */
router.get(
  "/convert",
  cacheMiddleware((req) => `convert:${(req.query.from || "").toUpperCase()}:${(req.query.to || "").toUpperCase()}:${req.query.amount}`),
  convertCurrency
);

/**
 * @swagger
 * /api/v1/rates/{base}:
 *   get:
 *     summary: Get all exchange rates for a base currency
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: base
 *         required: true
 *         schema:
 *           type: string
 *         description: Base currency code (e.g. USD)
 *         example: USD
 *     responses:
 *       200:
 *         description: Exchange rates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RatesResult'
 *       400:
 *         description: Validation error
 *       502:
 *         description: External API error
 */
router.get(
  "/rates/:base",
  cacheMiddleware((req) => `rates:${(req.params.base || "").toUpperCase()}`),
  getExchangeRates
);

/**
 * @swagger
 * /api/v1/currencies:
 *   get:
 *     summary: Get all supported currency codes
 *     tags: [Currency]
 *     responses:
 *       200:
 *         description: List of supported currencies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrenciesList'
 *       502:
 *         description: External API error
 */
router.get(
  "/currencies",
  cacheMiddleware(() => "currencies"),
  getSupportedCurrencies
);

module.exports = router;
