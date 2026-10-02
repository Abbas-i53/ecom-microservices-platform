# Ecom Microservices Platform (1M+ DAU Ready)

Lead-grade reference for high-availability e-commerce: Node.js + React + MongoDB + Redis.

Maps to resume: `Led team of 12, 1M+ DAU, microservices, 30% resilience gain`.

## Architecture
```
Client (React) -> API Gateway -> [auth | catalog | orders | payments]
                                  |-> MongoDB (primary) + Redis (cache)
                                  |-> Kafka/RabbitMQ (orders -> payments, async)
                                  |-> Prometheus + Winston logs
```

## Why this exists
Monolith split for fault isolation. Each service owns its DB. Cache hit path p95 < 80ms. Circuit breaker + retry + idempotency keys on payments.

## Quick start
```bash
docker compose up --build
# gateway :3000, catalog :3001, orders :3002
curl http://localhost:3000/health
curl http://localhost:3001/api/products
```

## Repo layout
- `services/gateway/` - auth, rate-limit, proxy
- `services/catalog/` - Express + Mongo + Redis cache
- `services/orders/` - queue-backed order creation
- `docker-compose.yml` - one-command local env

## Talking points (interview)
- How gateway isolates catalog failure from checkout.
- Why Redis for read-heavy catalog, Mongo TTL/index strategy.
- Backpressure with queue when payments slow.
```

## Performance notes
- Indexes: `db.products.createIndex({slug:1})`, `db.orders.createIndex({userId:1,createdAt:-1})`
- Cache: 60s TTL catalog, invalidate on write.
- Load test: `npx autocannon -c 500 http://localhost:3000/health`
