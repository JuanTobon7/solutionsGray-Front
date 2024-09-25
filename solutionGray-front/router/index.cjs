const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

// Asegúrate de importar 'process' y 'Buffer'
const process = require('process');

const proxyConfig = {
  target: process.env.API_HOST, // Cambia esto por la URL de tu backend
  logLevel: 'debug', // Agrega esto para más información de depuración
  on: {
    error(err, req, res) {
      console.log({
        err, req, res
      })
    },
    proxyReq(proxyReq, req, res) {
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' && req.body) {
        
        console.log(`Request body: ${JSON.stringify(req.body)}`);
        console.log(`Request headers: ${JSON.stringify(req.headers)}`);

        const stringBody = {
          ...req.body,
          client_secret: process.env.SSR_CLIENT,
          client_id: process.env.SSR_CLIENT_ID
        };

        const body = JSON.stringify(stringBody);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
        proxyReq.write(body);
        proxyReq.end()
      }
    },
  },
};

// Usar el proxy en la aplicación de Express para todas las rutas
router.all('*', createProxyMiddleware(proxyConfig));

module.exports = router;
