const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for auth routes (login & signup).
 * Allows a maximum of 10 requests per 15 minutes per IP.
 */
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,     // Disable `X-RateLimit-*` headers
    message: {                                        // fallback (unused when handler is set)
        success: false,
        message: "Too many attempts. Please try again later.",
    },
    handler: (req, res, next, options) => {
        const resetMs  = req.rateLimit?.resetTime?.getTime?.() ?? (Date.now() + options.windowMs);
        const minsLeft = Math.ceil((resetMs - Date.now()) / 60000);
        res.status(429).json({
            success: false,
            message: `Too many attempts. Please try again in ${minsLeft} minute${minsLeft !== 1 ? 's' : ''}.`,
        });
    },
});

/**
 * Rate limiter for the generate interview report endpoint.
 * Allows a maximum of 5 report generations per hour per IP.
 */
const generateReportRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {                                        // fallback (unused when handler is set)
        success: false,
        message: "Too many report generation requests. Please try again later.",
    },
    handler: (req, res, next, options) => {
        const resetMs  = req.rateLimit?.resetTime?.getTime?.() ?? (Date.now() + options.windowMs);
        const minsLeft = Math.ceil((resetMs - Date.now()) / 60000);
        res.status(429).json({
            success: false,
            message: `Too many report generation requests. Please try again in ${minsLeft} minute${minsLeft !== 1 ? 's' : ''}.`,
        });
    },
});

module.exports = { authRateLimiter, generateReportRateLimiter };
