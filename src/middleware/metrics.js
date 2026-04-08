const promClient = require('prom-client');

// Create a registry to hold all metrics
const register = new promClient.Registry();

// Automatically collect default metrics (CPU, memory, event loop etc.)
promClient.collectDefaultMetrics({ register });

// Custom metric 1 — counts total HTTP requests
const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Custom metric 2 — measures how long each request takes
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register]
});

// This is a middleware function — it runs on EVERY request automatically
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  // When the response finishes, record the metrics
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;

    httpRequestTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode
    });

    httpRequestDuration.observe(
      { method: req.method, route: route, status_code: res.statusCode },
      duration
    );
  });

  next(); // Move to the next middleware or route handler
};

module.exports = { register, metricsMiddleware };