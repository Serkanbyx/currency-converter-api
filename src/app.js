const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const { version } = require("../package.json");
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

// ─── Root Welcome Page ──────────────────────────────────────────────
app.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Currency Converter API</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      background: #0a1628;
      color: #e4e8f1;
      overflow: hidden;
      position: relative;
    }

    body::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 600px 400px at 20% 30%, rgba(0, 200, 150, 0.08), transparent),
        radial-gradient(ellipse 500px 350px at 80% 70%, rgba(0, 120, 255, 0.06), transparent),
        radial-gradient(ellipse 300px 300px at 50% 50%, rgba(218, 165, 32, 0.04), transparent);
      pointer-events: none;
    }

    body::after {
      content: "$ € £ ¥ ₺ ₹ ₿ ₩ ₽ ₫ ﷼ ₴ ₸ ₦";
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6rem;
      letter-spacing: 1.5rem;
      word-spacing: 2rem;
      color: rgba(0, 200, 150, 0.018);
      font-weight: 700;
      pointer-events: none;
      white-space: nowrap;
      overflow: hidden;
    }

    .chart-line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 200px;
      pointer-events: none;
      opacity: 0.06;
    }

    .chart-line svg {
      width: 100%;
      height: 100%;
    }

    .container {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 3rem 2rem;
      max-width: 520px;
      width: 100%;
    }

    .currency-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: linear-gradient(135deg, #00c896 0%, #0078ff 100%);
      margin-bottom: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 200, 150, 0.2);
      font-size: 2rem;
      color: #fff;
      font-weight: 700;
      letter-spacing: -2px;
    }

    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #00c896 0%, #4db8ff 50%, #daa520 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.4rem;
    }

    .version {
      font-size: 0.85rem;
      color: #5a6a85;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 2rem;
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }

    .links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem 1.6rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      letter-spacing: 0.2px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #00c896 0%, #00a67d 100%);
      color: #fff;
      box-shadow: 0 4px 16px rgba(0, 200, 150, 0.25);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(0, 200, 150, 0.35);
    }

    .btn-secondary {
      background: rgba(0, 200, 150, 0.08);
      color: #00c896;
      border: 1px solid rgba(0, 200, 150, 0.15);
    }

    .btn-secondary:hover {
      background: rgba(0, 200, 150, 0.14);
      border-color: rgba(0, 200, 150, 0.3);
      transform: translateY(-2px);
    }

    .sign {
      font-size: 0.8rem;
      color: #3d4f6a;
      letter-spacing: 0.3px;
    }

    .sign a {
      color: #5a8a7a;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .sign a:hover {
      color: #00c896;
    }

    @media (max-width: 480px) {
      h1 { font-size: 1.6rem; }
      .container { padding: 2rem 1.2rem; }
    }
  </style>
</head>
<body>
  <div class="chart-line">
    <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#00c896"
        stroke-width="2"
        points="0,160 80,140 160,150 240,110 320,120 400,80 480,95 560,60 640,75 720,50 800,65 880,40 960,55 1040,30 1120,45 1200,25 1280,35 1360,15 1440,20"
      />
      <polyline
        fill="none"
        stroke="#0078ff"
        stroke-width="1.5"
        points="0,180 80,170 160,175 240,155 320,160 400,135 480,145 560,120 640,130 720,110 800,118 880,100 960,108 1040,90 1120,98 1200,85 1280,88 1360,75 1440,78"
      />
    </svg>
  </div>

  <div class="container">
    <div class="currency-icon">₿$</div>
    <h1>Currency Converter API</h1>
    <p class="version">v${version}</p>

    <div class="links">
      <a href="/api-docs" class="btn-primary">API Documentation</a>
      <a href="/health" class="btn-secondary">Health Check</a>
    </div>

    <footer class="sign">
      Created by
      <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
      |
      <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  </div>
</body>
</html>`;

  res.send(html);
});

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
