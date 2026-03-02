# 💱 Currency Converter API

A production-ready RESTful API for real-time currency conversion with Redis caching, Swagger documentation, and robust security. Convert between 160+ currencies instantly powered by [ExchangeRate-API](https://www.exchangerate-api.com/).

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **Currency Conversion** — Convert any amount between 160+ currencies with real-time exchange rates
- **Exchange Rates** — Retrieve all available rates for any base currency in a single request
- **Supported Currencies** — List all available currency codes with their full names
- **Redis Caching** — Lightning-fast cached responses with configurable TTL (default: 1 hour)
- **Swagger UI** — Interactive API documentation and testing at `/api-docs`
- **Rate Limiting** — Protects the API with 100 requests per 15 minutes per IP
- **Health Check** — Monitor service and Redis connection status at `/health`
- **Graceful Degradation** — Fully operational even without Redis (cache disabled automatically)
- **Security First** — Helmet headers, CORS protection, and input validation built-in

## Live Demo

[🌐 View Live API](https://currency-converter-api-9rfm.onrender.com/)

[📖 Swagger Documentation](https://currency-converter-api-9rfm.onrender.com/api-docs)

> **Note:** The service is hosted on Render's free tier and may take ~30 seconds to wake up on first request.

## Technologies

- **Node.js + Express 5** — Modern, fast, and minimalist web framework
- **ExchangeRate-API v6** — Reliable external API for real-time exchange rates
- **Redis** — In-memory data store for high-performance caching
- **Swagger (OpenAPI 3.0)** — Auto-generated interactive API documentation
- **Helmet** — HTTP security headers middleware
- **CORS** — Cross-Origin Resource Sharing support
- **Express Rate Limit** — Request throttling for API protection
- **Axios** — Promise-based HTTP client for external API calls
- **Dotenv** — Environment variable management
- **Render** — Cloud deployment platform

## Installation

### Prerequisites

- Node.js 18+
- Redis (optional — API works without it)
- ExchangeRate-API key ([get a free key](https://www.exchangerate-api.com/))

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Serkanbyx/currency-converter-api.git
cd currency-converter-api
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Open `.env` and add your API key:

```env
EXCHANGE_RATE_API_KEY=your_api_key_here
REDIS_URL=redis://localhost:6379
PORT=3000
NODE_ENV=development
CACHE_TTL=3600
```

5. Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000` by default.

## Usage

1. Start the server using the installation steps above
2. Open `http://localhost:3000/api-docs` in your browser for interactive Swagger UI
3. Use the Swagger interface to test endpoints directly, or make HTTP requests via `curl`, Postman, or any HTTP client
4. Convert currencies by sending a GET request to `/api/v1/convert` with `from`, `to`, and `amount` parameters
5. Check the `/health` endpoint to verify the API and Redis status

## How It Works?

### Request Flow

Every API request goes through a layered pipeline:

```
Client Request → Rate Limiter → Cache Check → Controller → External API → Cache Store → Response
```

### Currency Conversion

The conversion endpoint validates inputs, checks the Redis cache, and calls the ExchangeRate-API if needed:

```bash
GET /api/v1/convert?from=USD&to=EUR&amount=100
```

```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "EUR",
    "rate": 0.9215,
    "amount": 100,
    "result": 92.15
  }
}
```

### Caching Strategy

- First request fetches data from ExchangeRate-API and stores it in Redis
- Subsequent identical requests are served directly from cache
- Cache TTL is configurable via `CACHE_TTL` environment variable (default: 3600 seconds)
- Cached responses include `source: "cache"` indicator
- If Redis is unavailable, the API skips caching and serves directly from the external API

### Error Handling

| Status Code | Description |
|-------------|-------------|
| `400` | Validation error (invalid currency code, negative amount) |
| `404` | Currency pair not found |
| `429` | Rate limit exceeded or external API quota reached |
| `502` | External API error |
| `500` | Internal server error |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/convert?from=USD&to=EUR&amount=100` | Convert currency |
| `GET` | `/api/v1/rates/USD` | Get all rates for a base currency |
| `GET` | `/api/v1/currencies` | List all supported currencies |
| `GET` | `/health` | Health check (API + Redis status) |
| `GET` | `/api-docs` | Swagger UI documentation |

### Example Requests

```bash
# Convert 100 USD to EUR
curl "http://localhost:3000/api/v1/convert?from=USD&to=EUR&amount=100"

# Get all exchange rates for GBP
curl "http://localhost:3000/api/v1/rates/GBP"

# List all supported currencies
curl "http://localhost:3000/api/v1/currencies"

# Health check
curl "http://localhost:3000/health"
```

## Customization

### Change Cache Duration

Adjust the `CACHE_TTL` environment variable (in seconds):

```env
CACHE_TTL=7200  # 2 hours
```

### Change Rate Limit

Edit `src/middlewares/rateLimiter.js` to customize the rate limiting rules:

```javascript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window (15 minutes)
  max: 200, // Increase max requests per window
});
```

### Add New Endpoints

Create a new route in `src/routes/` and register it in `src/app.js`. Follow the existing pattern in `currencyRoutes.js` for Swagger documentation.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `EXCHANGE_RATE_API_KEY` | ExchangeRate-API key | Yes | — |
| `PORT` | Server port | No | `3000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `REDIS_URL` | Redis connection URL | No | `redis://localhost:6379` |
| `CACHE_TTL` | Cache duration in seconds | No | `3600` |

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── env.js                  # Environment variable validation
│   │   ├── redis.js                # Redis client setup & connection
│   │   └── swagger.js              # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   └── currencyController.js   # Request handlers
│   ├── middlewares/
│   │   ├── cache.js                # Redis cache middleware
│   │   ├── errorHandler.js         # Global error handler
│   │   └── rateLimiter.js          # Rate limiting middleware
│   ├── routes/
│   │   ├── currencyRoutes.js       # Currency endpoints + Swagger docs
│   │   └── healthRoute.js          # Health check endpoint
│   ├── services/
│   │   └── exchangeRateService.js  # ExchangeRate-API integration
│   ├── utils/
│   │   └── responseHelper.js       # Response formatting utilities
│   └── app.js                      # Express app configuration
├── .github/                        # Issue & PR templates
├── server.js                       # Application entry point
├── render.yaml                     # Render deployment config
├── .env.example                    # Environment template
├── package.json                    # Dependencies & scripts
├── LICENSE                         # MIT License
├── CONTRIBUTING.md                 # Contribution guidelines
├── CODE_OF_CONDUCT.md              # Code of conduct
└── SECURITY.md                     # Security policy
```

## Deployment (Render)

1. Push your code to a GitHub repository
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repo
4. Render will auto-detect the `render.yaml` configuration
5. Add the `EXCHANGE_RATE_API_KEY` environment variable in Render Dashboard
6. Deploy — Redis is optional; the API works without it

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m "feat: add amazing feature"`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Message Format

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code restructuring
- `docs:` — Documentation changes
- `chore:` — Maintenance tasks

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Developer

**Serkanby**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Acknowledgments

- [ExchangeRate-API](https://www.exchangerate-api.com/) — Free and reliable exchange rate data
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) — Interactive API documentation
- [Render](https://render.com/) — Cloud hosting platform

## Contact

- **Issues:** [Open an Issue](https://github.com/Serkanbyx/currency-converter-api/issues)
- **Email:** [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- **Website:** [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
