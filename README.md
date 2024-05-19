# Novel API

## Requirements

- Docker
- Node 18 (Recommend install with NVM)
- Yarn (Install after install node)

## Setup

Initial development environment (run only one)

```
./scripts/up development
```

## Run

```
./scripts/serve development
```

## Docs

API documentation URI: `http://localhost:3030/docs` (May change base on environment).

## Migration

Run after initial development environment

```
./scripts/upgrade development
```

## Scripts

- build: Build docker image
- create: Create new migrate when change entities
- down: Down docker compose
- downgrade: Down migration
- serve: Run backend
- up: Up docker compose
- upgrade: Up migration
