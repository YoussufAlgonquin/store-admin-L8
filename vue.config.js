const { defineConfig } = require('@vue/cli-service')
const fetch = require("node-fetch")
const bodyParser = require('body-parser')

const PRODUCT_SERVICE_URL = (process.env.VUE_APP_PRODUCT_SERVICE_URL || "http://localhost:8082")
const ORDER_SERVICE_URL   = (process.env.VUE_APP_ORDER_SERVICE_URL   || "http://localhost:3000")
const AI_SERVICE_URL      = (process.env.VUE_APP_AI_SERVICE_URL      || "http://localhost:5000")

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    host: '0.0.0.0',
    allowedHosts: 'all',
    client: false,
    webSocketServer: false,
    setupMiddlewares: (middlewares, devServer) => {

      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.use(bodyParser.json())

      // Health check
      devServer.app.get('/health', (_, res) => {
        res.send({ status: 'ok' })
      })

      // --- Product Service ---

      // GET /products — list all products
      devServer.app.get('/products', (_, res) => {
        fetch(`${PRODUCT_SERVICE_URL}/products`)
          .then(response => response.json())
          .then(products => res.send(products))
          .catch(error => { console.log(error); res.status(500).send({ error: 'Failed to fetch products' }) })
      })

      // GET /products/:id — get single product
      devServer.app.get('/products/:id', (req, res) => {
        fetch(`${PRODUCT_SERVICE_URL}/products/${req.params.id}`)
          .then(response => response.json())
          .then(product => res.send(product))
          .catch(error => { console.log(error); res.status(500).send({ error: 'Failed to fetch product' }) })
      })

      // POST /products — create product
      devServer.app.post('/products', (req, res) => {
        fetch(`${PRODUCT_SERVICE_URL}/products`, {
          method: 'POST',
          body: JSON.stringify(req.body),
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => response.json())
          .then(product => res.status(201).send(product))
          .catch(error => { console.log(error); res.status(500).send({ error: 'Failed to create product' }) })
      })

      // PUT /products/:id — update product
      devServer.app.put('/products/:id', (req, res) => {
        fetch(`${PRODUCT_SERVICE_URL}/products/${req.params.id}`, {
          method: 'PUT',
          body: JSON.stringify(req.body),
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => response.json())
          .then(product => res.send(product))
          .catch(error => { console.log(error); res.status(500).send({ error: 'Failed to update product' }) })
      })

      // DELETE /products/:id — delete product
      devServer.app.delete('/products/:id', (req, res) => {
        fetch(`${PRODUCT_SERVICE_URL}/products/${req.params.id}`, { method: 'DELETE' })
          .then(() => res.sendStatus(204))
          .catch(error => { console.log(error); res.status(500).send({ error: 'Failed to delete product' }) })
      })

      // --- Order Service ---

      // GET /orders — list all orders
      devServer.app.get('/orders', (_, res) => {
        fetch(`${ORDER_SERVICE_URL}/orders`)
          .then(response => response.json())
          .then(orders => res.send(orders))
          .catch(error => { console.log(error); res.status(500).send({ error: 'Failed to fetch orders' }) })
      })

      // GET /orders/:id — get single order
      devServer.app.get('/orders/:id', (req, res) => {
        fetch(`${ORDER_SERVICE_URL}/orders/${req.params.id}`)
          .then(response => response.json())
          .then(order => res.send(order))
          .catch(error => { console.log(error); res.status(500).send({ error: 'Failed to fetch order' }) })
      })

      // --- AI Service ---

      // GET /ai/health
      devServer.app.get('/ai/health', (_, res) => {
        fetch(`${AI_SERVICE_URL}/health`)
          .then(response => response.json())
          .then(health => res.send(health))
          .catch(error => { console.error(error); res.status(500).send({ error: 'AI health check failed' }) })
      })

      // POST /ai/generate/description
      devServer.app.post('/ai/generate/description', (req, res) => {
        fetch(`${AI_SERVICE_URL}/generate/description`, {
          method: 'POST',
          body: JSON.stringify(req.body),
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => response.json())
          .then(data => res.send(data))
          .catch(error => { console.log(error); res.status(500).send({ error: 'Failed to generate description' }) })
      })

      // POST /ai/generate/specs
      devServer.app.post('/ai/generate/specs', (req, res) => {
        fetch(`${AI_SERVICE_URL}/generate/specs`, {
          method: 'POST',
          body: JSON.stringify(req.body),
          headers: { 'Content-Type': 'application/json' }
        })
          .then(response => response.json())
          .then(data => res.send(data))
          .catch(error => { console.log(error); res.status(500).send({ error: 'Failed to generate specs' }) })
      })

      return middlewares;
    }
  }
})
