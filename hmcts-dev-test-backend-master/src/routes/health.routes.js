const express = require('express');

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags:
 *       - Operations
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
