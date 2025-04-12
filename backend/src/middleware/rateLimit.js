const rateLimit = new Map();

const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 10; // Max requests per window

    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, { count: 1, start: now });
    } else {
        const data = rateLimit.get(ip);
        if (now - data.start > windowMs) {
            rateLimit.set(ip, { count: 1, start: now });
        } else {
            data.count += 1;
            if (data.count > maxRequests) {
                return res.status(429).json({ error: 'Too many requests, try again later' });
            }
        }
    }
    next();
};

module.exports = rateLimitMiddleware;