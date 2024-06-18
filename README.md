# Novel API

## Requirements

- Docker
- Node 18 (Recommend install with NVM)
- Yarn (Install after install node)

## Setup

Initial development environment (run only one)

```
./scripts/up dev
```

## Run

```
./scripts/serve dev
```

## Docs

API documentation URI: `http://localhost:3031/docs` (May change base on environment).

## Migration

Run after initial development environment

```
./scripts/upgrade dev
```

## Scripts

- build: Build docker image
- migrate-generate: Create new migrate when change entities
- down: Down docker compose
- migrate-down: Down migration
- serve: Run backend
- up: Up docker compose
- migrate-up: Up migration
