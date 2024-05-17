# mokuroku
蔵書管理システムになる予定

backend
```sh
cd backend/
FRONTEND_ADDR=$FRONTEND_ADDR cargo run
```

frontend
```sh
cd frontend/
docker build -t mokuroku-frontend --build-arg BACKEND_ADDR=$BACKEND_ADDR .
docker run -p $FRONTEND_PORT:80 mokuroku-frontend
```

format(frontend)
```sh
cd frontend/
pnpm exec prettier . --write
```
