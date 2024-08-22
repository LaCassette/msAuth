const setRateLimit = require('express-rate-limit');

module.exports = rateLimiterMiddleWare = setRateLimit({
    window: 60 * 1000,
    max: 300,
    message: { error : "300 requests max per minutes" },
    headers: true,
});
