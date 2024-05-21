# mokuroku
蔵書管理システムになる予定

## build / run
```sh
docker compose build
docker compose up
```

ただし、`.env`で以下の環境変数を設定する必要がある
- `HOSTNAME`
- `FRONTEND_PORT`
- `BACKEND_PORT`

## format(frontend)
```sh
cd frontend/
pnpm exec prettier . --write
```
