const COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
};

const METHOD_COLORS = {
  GET: COLORS.green,
  POST: COLORS.cyan,
  PUT: COLORS.yellow,
  PATCH: COLORS.magenta,
  DELETE: COLORS.red,
};

const getStatusColor = (statusCode) => {
  if (statusCode < 300) return COLORS.green;
  if (statusCode < 400) return COLORS.cyan;
  if (statusCode < 500) return COLORS.yellow;
  return COLORS.red;
};

const formatDuration = (ms) => {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    const methodColor = METHOD_COLORS[method] || COLORS.white;
    const statusColor = getStatusColor(statusCode);

    const timestamp = new Date().toISOString().slice(11, 23);

    console.log(
      `  ${COLORS.dim}${timestamp}${COLORS.reset}` +
      `  ${methodColor}${method.padEnd(7)}${COLORS.reset}` +
      `  ${originalUrl}` +
      `  ${statusColor}${statusCode}${COLORS.reset}` +
      `  ${COLORS.dim}${formatDuration(durationMs)}${COLORS.reset}`
    );
  });

  next();
};

module.exports = requestLogger;
