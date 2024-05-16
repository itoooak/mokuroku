# mokuroku
蔵書管理システムになる予定

backend
```
cd backend/
FRONTEND_ADDR=$FRONTEND_ADDR cargo run
```

frontend
```
cd frontend/
VITE_API_URL_BASE=$BACKEND_ADDR pnpm dev --host
```

format(frontend)
```
cd frontend/
pnpm exec prettier . --write
```
