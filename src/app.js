require('dotenv').config(); // Load .env file first

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const healthRoutes = require('./routes/health');
const productRoutes = require('./routes/products');
const { register, metricsMiddleware } = require('./middleware/metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware (runs on every request) ──────────────────
app.use(helmet());         // Adds security headers
app.use(cors());           // Allows cross-origin requests
app.use(morgan('combined')); // Logs every request to terminal
app.use(express.json());   // Parses JSON request bodies
app.use(metricsMiddleware); // Our custom Prometheus metrics

// ── Routes ───────────────────────────────────────────────
app.use('/health', healthRoutes);
app.use('/products', productRoutes);

// GET /metrics — Prometheus scrapes this endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// 404 handler — catches any unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Only start listening if this file is run directly
// (not when imported in tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════╗
    ║   ShopAPI is running!            ║
    ║   http://localhost:${PORT}          ║
    ║   Environment: ${process.env.NODE_ENV}      ║
    ╚══════════════════════════════════╝
    `);
  });
}

module.exports = app; // Export for tests