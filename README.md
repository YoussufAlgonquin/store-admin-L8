# BestBuy Store Admin

A Vue.js admin portal for employees. Lets staff view and process orders, manage products, and generate AI-powered product descriptions and specs via the AI service.

## Features

- View and update order status (pending, processing, complete)
- Create, edit, and delete products
- Generate product descriptions and specs using Azure OpenAI

## Running Locally

Set environment variables and start the dev server:

```bash
export VUE_APP_PRODUCT_SERVICE_URL=http://localhost:3002/
export VUE_APP_MAKELINE_SERVICE_URL=http://localhost:3001/

npm install
npm run serve
```

App runs at `http://localhost:8081/`.

To start backing services (including the AI service), configure your Azure OpenAI credentials in `docker-compose.yml` and run:

```bash
docker compose up
```

## Docker

```bash
docker build -t store-admin .
docker run -p 80:80 store-admin
```
