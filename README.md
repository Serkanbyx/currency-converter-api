# Currency Converter API

A RESTful API for real-time currency conversion with **Redis caching** and **Swagger** documentation. Powered by [ExchangeRate-API](https://www.exchangerate-api.com/).

## Features

- **Currency Conversion** — Convert any amount between 160+ currencies
- **Exchange Rates** — Get all rates for a base currency
- **Supported Currencies** — List all available currency codes
- **Redis Caching** — Cached responses with configurable TTL (default: 1 hour)
- **Swagger UI** — Interactive API documentation at `/api-docs`
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **Health Check** — Monitor service and Redis status at `/health`
- **Graceful Degradation** — Works without Redis (cache disabled)

## Tech Stack

- **Runtime:** Node.js + Express
- **External API:** ExchangeRate-API v6
- **Cache:** Redis
- **Docs:** Swagger (OpenAPI 3.0)
- **Security:** Helmet, CORS, Rate Limiting
- **Deployment:** Render

## Getting Started

### Prerequisites

- Node.js 18+
- Redis (optional — API works without it)
- ExchangeRate-API key ([get free key](https://www.exchangerate-api.com/))

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd currency-converter-api

# Install dependencies
npm install

# Create .env from example
cp .env.example .env
# Edit .env and add your EXCHANGE_RATE_API_KEY
```

### Running

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:3000` by default.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/convert?from=USD&to=EUR&amount=100` | Convert currency |
| `GET` | `/api/v1/rates/USD` | Get all rates for base currency |
| `GET` | `/api/v1/currencies` | List supported currencies |
| `GET` | `/health` | Health check |
| `GET` | `/api-docs` | Swagger UI documentation |

### Example Request

```bash
curl "http://localhost:3000/api/v1/convert?from=USD&to=EUR&amount=100"
```

### Example Response

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

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `EXCHANGE_RATE_API_KEY` | API key (required) | — |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `CACHE_TTL` | Cache duration in seconds | `3600` |

## Deployment (Render)

1. Push your code to a GitHub repository
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml` configuration
5. Add environment variables:
   - `EXCHANGE_RATE_API_KEY` — your API key
   - `REDIS_URL` — your Redis instance URL (use Render Redis or external provider)

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── env.js              # Environment variables
│   │   ├── redis.js            # Redis client setup
│   │   └── swagger.js          # Swagger/OpenAPI config
│   ├── controllers/
│   │   └── currencyController.js
│   ├── middlewares/
│   │   ├── cache.js            # Redis cache middleware
│   │   ├── errorHandler.js     # Global error handler
│   │   └── rateLimiter.js      # Rate limiting
│   ├── routes/
│   │   ├── currencyRoutes.js   # Currency endpoints + Swagger docs
│   │   └── healthRoute.js      # Health check endpoint
│   ├── services/
│   │   └── exchangeRateService.js  # ExchangeRate-API integration
│   ├── utils/
│   │   └── responseHelper.js   # Response formatting
│   └── app.js                  # Express app setup
├── server.js                   # Entry point
├── render.yaml                 # Render deployment config
├── .env.example                # Environment template
└── package.json
```

## License

ISC
