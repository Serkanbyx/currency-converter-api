const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const currencyRoutes = require("./routes/currencyRoutes");
const healthRoute = require("./routes/healthRoute");
const errorHandler = require("./middlewares/errorHandler");
const apiLimiter = require("./middlewares/rateLimiter");

const app = express();

// ─── Global Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());

// ─── Rate Limiter ───────────────────────────────────────────────────
app.use("/api/", apiLimiter);

// ─── Swagger Docs ───────────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Currency Converter API Docs",
}));

// ─── Routes ─────────────────────────────────────────────────────────
app.use(healthRoute);
app.use("/api/v1", currencyRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ───────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
