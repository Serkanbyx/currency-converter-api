const { Router } = require("express");
const { getRedisStatus } = require("../config/redis");
const { version } = require("../../package.json");

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
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                 redis:
 *                   type: string
 *                   enum: [connected, disconnected]
 *                   example: connected
 *                 memoryUsage:
 *                   type: string
 *                   example: "24.5 MB"
 *                 timestamp:
 *                   type: string
 *                   example: "2026-03-02T12:00:00.000Z"
 */
router.get("/health", (req, res) => {
  const memoryMB = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

  res.json({
    status: "ok",
    version,
    uptime: process.uptime(),
    redis: getRedisStatus() ? "connected" : "disconnected",
    memoryUsage: `${memoryMB} MB`,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
