const { Router } = require("express");
const { getRedisStatus } = require("../config/redis");

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                 redis:
 *                   type: string
 *                   enum: [connected, disconnected]
 *                   example: connected
 *                 timestamp:
 *                   type: string
 *                   example: "2026-03-02T12:00:00.000Z"
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    redis: getRedisStatus() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
