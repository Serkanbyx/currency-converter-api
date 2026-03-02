const { sendError } = require("../utils/responseHelper");

const errorHandler = (err, req, res, _next) => {
  console.error(`[Error] ${err.message}`, err.stack);

  if (err.response) {
    const status = err.response.status;
    const apiError = err.response.data?.["error-type"] || "External API error";

    const statusMap = {
      404: { code: 404, msg: `Currency not found: ${apiError}` },
      429: { code: 429, msg: "Exchange rate API rate limit exceeded. Try again later." },
    };

    const mapped = statusMap[status] || { code: 502, msg: `External API error: ${apiError}` };
    return sendError(res, mapped.msg, mapped.code);
  }

  if (err.name === "ValidationError") {
    return sendError(res, err.message, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  sendError(res, message, statusCode);
};

module.exports = errorHandler;
