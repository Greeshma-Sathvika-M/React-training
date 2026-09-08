const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware({
      pathFilter: '/api',          // v4 API: forward only /api/* requests
      target: 'http://localhost:5000',
      changeOrigin: true,
      on: {
        error: (_err, _req, res) => {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Server is not running. Please start it with: npm run server' }));
        },
      },
    })
  );
};
